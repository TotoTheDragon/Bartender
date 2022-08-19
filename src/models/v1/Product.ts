import { Schema } from 'ajv';
import DatabaseManager from '../../database/DatabaseManager';
import Transformer from '../../transform/transformer';
import { Attribute } from './Attribute';
import { BartenderImage } from './BartenderImage';
import {
    getQuantity, getQuantityById, ProductQuantity, QUANTITY_SCHEMA,
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
    required: ['gtin'],
};

export async function getProduct(
    database: DatabaseManager,
    gtin: string,
): Promise<Product | undefined> {
    const databaseProduct = await database.queryFirst<any>(
        'SELECT * FROM product WHERE gtin = $1',
        [gtin],
    );

    if (databaseProduct === undefined) {
        return undefined;
    }

    const databaseAttributes: any[] = await database.query<any>(
        'SELECT * FROM product_attributes WHERE gtin = $1;',
        [gtin],
    );

    const product = Transformer.transform<Product>(
        databaseProduct,
        Transformer.TRANSFORMATIONS.DB_PRODUCT,
        Transformer.TRANSFORMATIONS.INTERNAL_PRODUCT,
    );

    const attributes = Transformer.transformArray<Attribute>(
        databaseAttributes,
        Transformer.TRANSFORMATIONS.DB_ATTRIBUTE,
        Transformer.TRANSFORMATIONS.INTERNAL_ATTRIBUTE,
    );

    product.quantity = await getQuantityById(database, databaseProduct.quantity_id);

    product.attributes = Transformer.transform(
        attributes,
        Transformer.TRANSFORMATIONS.ARRAY_KEY_NAME,
        Transformer.TRANSFORMATIONS.OBJECT_KEY_NAME,
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

    if (result.length === 0) {
        throw new Error('Was not able to create product');
    }

    return { ...product, images: product.images ?? [] };
}
