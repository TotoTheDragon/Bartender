import { isGTIN, isValid } from 'gtin';
import DatabaseManager from '../../database/DatabaseManager';
import Transformer from '../../transform/transformer';
import { Attribute } from './Attribute';
import { BartenderImage } from './BartenderImage';
import { getQuantity, getQuantityById, ProductQuantity } from './ProductQuantity';

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

interface RequiredProduct {
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
    product: RequiredProduct,
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

export function checkRequiredCreateFields(product: RequiredProduct) {
    if (!(typeof product.gtin === 'string') || !isGTIN(product.gtin) || !isValid(product.gtin)) {
        throw new Error('gtin is invalid');
    }
    if (product.name === undefined || product.name === null || product.name === '') {
        throw new Error('name is invalid');
    }
    if (
        product.description === undefined ||
        product.description === null ||
        product.description === ''
    ) {
        throw new Error('description is invalid');
    }
    if (product.category === undefined || product.category === null || product.category === '') {
        throw new Error('category is invalid');
    }
    if (product.brand === undefined || product.brand === null || product.brand === '') {
        throw new Error('brand is invalid');
    }

    if (
        product.quantity === undefined ||
        product.quantity === null ||
        !(typeof product.quantity === 'object')
    ) {
        throw new Error('quantity is invalid');
    }

    if (
        product.quantity?.value === undefined ||
        product.quantity?.value === null ||
        product.quantity?.value <= 0
    ) {
        throw new Error('quantity.value is invalid');
    }

    if (
        product.quantity?.amount === undefined ||
        product.quantity?.amount === null ||
        product.quantity?.amount <= 0
    ) {
        throw new Error('quantity.amount is invalid');
    }

    if (
        product.quantity?.unit === undefined ||
        product.quantity?.unit === null ||
        (product.quantity?.unit as unknown) === ''
    ) {
        throw new Error('quantity.unit is invalid');
    }
}
