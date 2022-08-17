import { isGTIN, isValid } from 'gtin';
import DatabaseManager from '../../database/DatabaseManager';
import { BartenderImage } from './BartenderImage';
import { getQuantity, ProductQuantity } from './ProductQuantity';

export interface Product {
    gtin?: string;
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    images?: BartenderImage[];
    quantity?: ProductQuantity;
    attributes?: { [key: string]: string | number | boolean };
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
    images?: BartenderImage[];
    attributes?: { [key: string]: string | number | boolean };
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
            product.images ?? [],
        ],
    );

    if (result.length === 0) {
        throw new Error('Was not able to create product');
    }

    return { ...product, images: product.images ?? [] };
}

export function checkRequiredCreateFields(product: RequiredProduct) {
    if (
        !(typeof product.gtin === 'string') ||
        !isGTIN(product.gtin) ||
        !isValid(product.gtin)
    ) {
        throw new Error('gtin is invalid');
    }
    if (
        product.name === undefined ||
        product.name === null ||
        product.name === ''
    ) {
        throw new Error('name is invalid');
    }
    if (
        product.description === undefined ||
        product.description === null ||
        product.description === ''
    ) {
        throw new Error('description is invalid');
    }
    if (
        product.category === undefined ||
        product.category === null ||
        product.category === ''
    ) {
        throw new Error('category is invalid');
    }
    if (
        product.brand === undefined ||
        product.brand === null ||
        product.brand === ''
    ) {
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
