import { Schema } from 'ajv';
import format from 'pg-format';
import DatabaseManager from '../../database/DatabaseManager';
import { DatabaseQuerier } from '../../database/DatabaseQuerier';
import Transformer from '../../transform/transformer';
import Utils from '../../Utils';
import { Attribute } from './Attribute';
import { BartenderImage } from './BartenderImage';
import {
    getCachedQuantity,
    getQuantity,
    ProductQuantity,
    QUANTITY_SCHEMA,
} from './ProductQuantity';

export interface Product {
    gtin?: string;
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    images?: BartenderImage[];
    quantity?: ProductQuantity;
    attributes?: { [key: string]: Attribute };
}

export interface RequiredProductData {
    // Required
    gtin: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    quantity: ProductQuantity;
    // Optional
    images: BartenderImage[];
    attributes: { [key: string]: Attribute };
}

export const PRODUCT_SCHEMA: Schema = {
    type: 'object',
    properties: {
        gtin: { type: 'string', format: 'gtin' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        brand: { type: 'string' },
        quantity: QUANTITY_SCHEMA,
    },
    required: ['gtin', 'name', 'description', 'category', 'brand', 'quantity'],
};

export async function getProduct(
    database: DatabaseQuerier,
    gtin: string,
): Promise<Product | undefined> {
    const result = await database.queryFirst<any>(
        `
        SELECT product.*,
            row_to_json(quantity) as quantity,
            json_agg(product_attributes) as attributes
        FROM product
        JOIN quantity ON quantity.id = product.quantity_id
        LEFT JOIN product_attributes ON product_attributes.gtin = product.gtin
        WHERE product.gtin = $1
        GROUP BY product.gtin, quantity.*;
        `,
        [gtin],
    );

    const product = Transformer.transform<Product>(
        result,
        Transformer.TRANSFORMATIONS.DB_PRODUCT,
        Transformer.TRANSFORMATIONS.INTERNAL_PRODUCT,
    );

    return product;
}

export async function createProduct(
    database: DatabaseQuerier,
    productData: RequiredProductData,
): Promise<Product> {
    const transaction =
        database instanceof DatabaseManager ? await database.createTransaction() : database;
    try {
        // Get quantity and create it if it does not exist yet
        const quantityId =
            getCachedQuantity(productData.quantity)?.id ||
            (await getQuantity(transaction, productData.quantity)).id;

        const insertProduct = { ...productData };

        // Make sure that stuff is synced properly
        insertProduct.quantity.id = quantityId;
        if (insertProduct.attributes) {
            Object.keys(insertProduct.attributes).forEach((name) => {
                insertProduct.attributes[name].name = name;
                insertProduct.attributes[name].gtin = insertProduct.gtin;
            });
        } else {
            insertProduct.attributes = {};
        }

        await transaction.query(
            format(
                'INSERT INTO product ("gtin", "name", "description", "category", "brand", "quantity_id", "images") VALUES (%L) RETURNING 1;',
                Transformer.transform(
                    insertProduct,
                    Transformer.TRANSFORMATIONS.INTERNAL_PRODUCT,
                    Transformer.TRANSFORMATIONS.DB_INSERT_PRODUCT,
                ),
            ),
        );
        if (Object.keys(insertProduct.attributes).length > 0) {
            await transaction.query(
                format(
                    'INSERT INTO product_attributes (gtin, name, type, text_value, integer_value, float_value, boolean_value) VALUES %L;',
                    Transformer.transformArray<any>(
                        Transformer.transform<any[]>(
                            insertProduct.attributes,
                            Transformer.TRANSFORMATIONS.OBJECT_KEY_NAME,
                            Transformer.TRANSFORMATIONS.ARRAY_KEY_NAME,
                        ),
                        Transformer.TRANSFORMATIONS.INTERNAL_ATTRIBUTE,
                        Transformer.TRANSFORMATIONS.DB_INSERT_ATTRIBUTE,
                    ),
                ),
            );
        }

        const product = await getProduct(transaction, insertProduct.gtin);

        if (product === undefined) {
            throw new Error('Did not properly create product');
        }
        await transaction.commit();
        return product;
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
}

export async function getProducts(database: DatabaseQuerier) {
    const test: any[] = await database.query<any>(
        `
        SELECT product.*,
            row_to_json(quantity) as quantity,
            json_agg(product_attributes) as attributes
        FROM product
        JOIN quantity ON quantity.id = product.quantity_id
        LEFT JOIN product_attributes ON product_attributes.gtin = product.gtin
        GROUP BY product.gtin, quantity.*;
        `,
    );

    const product = Transformer.transformArray<Product>(
        test,
        Transformer.TRANSFORMATIONS.DB_PRODUCT,
        Transformer.TRANSFORMATIONS.INTERNAL_PRODUCT,
    );

    return product;
}

export async function deleteProduct(database: DatabaseQuerier, gtin: string): Promise<void> {
    await database.queryFirst<any>('DELETE FROM product_attributes WHERE gtin = $1', [gtin]);
    await database.queryFirst<any>('DELETE FROM product WHERE gtin = $1', [gtin]);
}

export async function patchProduct(
    database: DatabaseManager,
    gtin: string,
    productData: Product,
): Promise<Product> {
    if (gtin === undefined) {
        throw new Error('Was not able to patch product due to invalid gtin');
    }

    const transaction =
        database instanceof DatabaseManager ? await database.createTransaction() : database;
    try {
        // PATCH product
        const allowedPatchFields = ['name', 'description', 'category', 'brand', 'images'];

        const fieldsToPatch = allowedPatchFields.filter((field) => field in productData);

        if (fieldsToPatch.length > 0) {
            const sets: string[] = [];

            fieldsToPatch.forEach((field) => {
                if (field === 'images') {
                    sets.push(format('%I = %L', field, JSON.stringify(productData.images)));
                } else {
                    sets.push(format('%I = %L', field, (productData as any)[field]));
                }
            });

            await transaction.query(format('UPDATE product SET %s WHERE gtin = %L;', sets, gtin));
        }

        // PATCH attributes
        if (
            productData.attributes !== undefined &&
            Object.keys(productData.attributes).length > 0
        ) {
            await Promise.all(
                Object.keys(productData.attributes).map((name) => transaction.query(
                    format(
                        'INSERT INTO product_attributes (gtin, name, type, %I) VALUES (%L, %L, %L, %L) ON CONFLICT (gtin, name) DO UPDATE SET type = %L, %I = %L;',
                        Utils.getAttributeValuePath(productData.attributes![name]),
                        gtin,
                        name,
                            productData.attributes![name].type,
                            productData.attributes![name].value,
                            productData.attributes![name].type,
                            Utils.getAttributeValuePath(productData.attributes![name]),
                            productData.attributes![name].value,
                    ),
                )),
            );
        }

        // Return updated product
        const product = await getProduct(transaction, gtin);

        if (product === undefined) {
            throw new Error('Product does not exist');
        }
        await transaction.commit();
        return product;
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
}
