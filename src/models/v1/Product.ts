import { Schema } from 'ajv';
import DatabaseManager from '../../database/DatabaseManager';
import Transformer from '../../transform/transformer';
import { Attribute } from './Attribute';
import { BartenderImage } from './BartenderImage';
import { getQuantity, ProductQuantity, QUANTITY_SCHEMA } from './ProductQuantity';

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
    required: ['gtin'],
};

export async function getProduct(
    database: DatabaseManager,
    gtin: string,
): Promise<Product | undefined> {
    const test = await database.queryFirst<any>(
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
        test,
        Transformer.TRANSFORMATIONS.DB_PRODUCT,
        Transformer.TRANSFORMATIONS.INTERNAL_PRODUCT,
    );

    return product;
}

export async function createProduct(
    database: DatabaseManager,
    product: RequiredProductData,
): Promise<Product> {
    const quantityId = (await getQuantity(database, product.quantity)).id;
    const result = await database.query(
        'INSERT INTO product (gtin, "name", "description", "category", "brand", "quantity_id", "images") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING 1;',
        [
            product.gtin,
            product.name,
            product.description,
            product.category,
            product.brand,
            quantityId,
            product.images || [],
        ],
    );

    const result2 = await database.query(
        'INSERT INTO product_attributes (gtin, type, text_value) VALUES ($1, $2, $3) RETURNING 1;',
        [product.gtin, 'text', 'attribute'],
    );

    if (result.length === 0) {
        throw new Error('Was not able to create product');
    }

    console.log(result2);

    return { ...product, images: product.images ?? [] };
}

export async function getProducts(database: DatabaseManager) {
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
