import { Schema } from 'ajv';
import convert, { Unit } from 'convert-units';
import { DatabaseQuerier } from '../../database/DatabaseQuerier';
import Transformer from '../../transform/transformer';

const quantityCache: Map<string, CachedQuantity> = new Map();
const quantityIdCache: Map<number, CachedQuantity> = new Map();

export interface ProductQuantity {
    id: number;
    value: number;
    unit: Unit;
    amount: number;
    total: number;
}

export const QUANTITY_SCHEMA: Schema = {
    type: 'object',
    properties: {
        value: { type: 'number' },
        amount: { type: 'number' },
        unit: { enum: convert().possibilities() },
    },
    required: ['value', 'amount', 'unit'],
};

export type CachedQuantity = ProductQuantity & { id: number };

function hashQuantity(quantity: ProductQuantity): string {
    return quantity.value + quantity.unit + quantity.amount;
}

function addToCache(quantity: CachedQuantity): CachedQuantity {
    const hashedQuantity = hashQuantity(quantity);
    quantityCache.set(hashedQuantity, quantity);
    quantityIdCache.set(quantity.id, quantity);
    return quantity;
}

export function getCachedQuantity(
    unsanitizedQuantity: ProductQuantity,
): CachedQuantity | undefined {
    const quantity = Transformer.transform<ProductQuantity>(
        unsanitizedQuantity,
        Transformer.TRANSFORMATIONS.UNSANITIZED_QUANTITY,
        Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
    );

    const hashedQuantity = hashQuantity(quantity);

    return quantityCache.get(hashedQuantity);
}

export function getCachedQuantityById(id: number): CachedQuantity | undefined {
    return quantityIdCache.get(id);
}

export async function getQuantity(
    database: DatabaseQuerier,
    unsanitizedQuantity: ProductQuantity,
): Promise<CachedQuantity> {
    const quantity = Transformer.transform<ProductQuantity>(
        unsanitizedQuantity,
        Transformer.TRANSFORMATIONS.UNSANITIZED_QUANTITY,
        Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
    );

    // Check if we already know the id for this quantity
    const hashedQuantity = hashQuantity(quantity);

    if (quantityCache.has(hashedQuantity)) {
        return quantityCache.get(hashedQuantity) as CachedQuantity;
    }

    // Check if the quantity is already in the database
    const existingQuantity: { id: number } = await database.queryFirst(
        'SELECT id FROM quantity WHERE quantity_value = $1 AND quantity_amount = $2 AND quantity_unit = $3;',
        [quantity.value, quantity.amount, quantity.unit],
    );

    if (existingQuantity) {
        return addToCache(
            Transformer.transform(
                existingQuantity,
                Transformer.TRANSFORMATIONS.DB_QUANTITY,
                Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
            ),
        );
    }

    // Create a new quantity
    const createdQuantity = await database.queryFirst(
        'INSERT INTO quantity (quantity_value, quantity_amount, quantity_unit) VALUES ($1, $2, $3) RETURNING *;',
        [quantity.value, quantity.amount, quantity.unit],
    );

    if (createdQuantity) {
        return addToCache(
            Transformer.transform(
                createdQuantity,
                Transformer.TRANSFORMATIONS.DB_QUANTITY,
                Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
            ),
        );
    }

    if (quantityCache.has(hashedQuantity)) {
        return quantityCache.get(hashedQuantity) as CachedQuantity;
    }

    // Quantity still does not exist somehow
    throw new Error('Was not able to find or create quantity');
}
export async function getQuantityById(
    database: DatabaseQuerier,
    id: number,
): Promise<CachedQuantity> {
    if (quantityIdCache.has(id)) {
        return quantityIdCache.get(id) as CachedQuantity;
    }

    const result = await database.queryFirst('SELECT * FROM quantity WHERE id = $1;', [id]);

    if (result) {
        return addToCache(
            Transformer.transform(
                result,
                Transformer.TRANSFORMATIONS.DB_QUANTITY,
                Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
            ),
        );
    }

    throw new Error('Tried getting non-existent quantity by id');
}
