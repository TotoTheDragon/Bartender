import convert, { Unit } from 'convert-units';
import DatabaseManager from '../../database/DatabaseManager';
import Utils from '../../Utils';

const quantityCache: Map<string, DatabaseQuantity> = new Map();

export interface ProductQuantity {
    value: number;
    unit: Unit;
    amount: number;
    total: number;
}

export type DatabaseQuantity = ProductQuantity & { id: number };

function hashQuantity(quantity: ProductQuantity): string {
    return quantity.value + quantity.unit + quantity.amount;
}

export async function getQuantity(
    database: DatabaseManager,
    quantity: ProductQuantity,
): Promise<DatabaseQuantity> {
    // Normalize quantity to default form
    const newUnit = Utils.getSmallestMatchingUnit(quantity.unit);
    const newValue = convert(quantity.value).from(quantity.unit).to(newUnit);

    const normalizedQuantity = {
        value: newValue,
        unit: newUnit,
        amount: quantity.amount,
        total: newValue * quantity.amount,
    };
    // Check if we already know the id for this quantity
    const hashedQuantity: string = hashQuantity(normalizedQuantity);

    if (quantityCache.has(hashedQuantity)) {
        return quantityCache.get(hashedQuantity) as DatabaseQuantity;
    }

    // Check if the quantity is already in the database
    const foundResults: { id: number }[] = await database.query(
        'SELECT id FROM quantity WHERE quantity_value = $1 AND quantity_amount = $2 AND quantity_unit = $3;',
        [
            normalizedQuantity.value,
            normalizedQuantity.amount,
            normalizedQuantity.unit,
        ],
    );
    // The quantity already exists
    if (foundResults.length > 0) {
        quantityCache.set(hashedQuantity, {
            id: foundResults[0].id,
            ...normalizedQuantity,
        });
    } else {
        // Create a new quantity
        const createdResults: { id: number }[] = await database.query(
            'INSERT INTO quantity (quantity_value, quantity_amount, quantity_unit) VALUES ($1, $2, $3) RETURNING id;',
            [
                normalizedQuantity.value,
                normalizedQuantity.amount,
                normalizedQuantity.unit,
            ],
        );

        if (createdResults.length > 0) {
            quantityCache.set(hashedQuantity, {
                id: createdResults[0].id as number,
                ...normalizedQuantity,
            });
        }
    }

    if (quantityCache.has(hashedQuantity)) {
        return quantityCache.get(hashedQuantity) as DatabaseQuantity;
    }

    throw new Error('Was not able to find or create quantity');
}
