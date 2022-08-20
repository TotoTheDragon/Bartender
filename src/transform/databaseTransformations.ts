import convert from 'convert-units';
import { Product } from '../models/v1/Product';
import { CachedQuantity, ProductQuantity } from '../models/v1/ProductQuantity';
import Utils from '../Utils';
import Transformer from './transformer';

export default function registerDatabaseTransformations() {
    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.DB_PRODUCT,
        Transformer.TRANSFORMATIONS.INTERNAL_PRODUCT,
        (o) => {
            const product: Product = {};
            const attributes = Transformer.transformArray(
                o.attributes || [],
                Transformer.TRANSFORMATIONS.DB_ATTRIBUTE,
                Transformer.TRANSFORMATIONS.INTERNAL_ATTRIBUTE,
            );
            product.gtin = o.gtin;
            product.name = o.name;
            product.description = o.description;
            product.brand = o.brand;
            product.category = o.category;
            product.images = o.images || [];
            product.attributes = {};
            product.quantity = Transformer.transform(
                o.quantity,
                Transformer.TRANSFORMATIONS.DB_QUANTITY,
                Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
            );
            product.attributes = Transformer.transform(
                attributes,
                Transformer.TRANSFORMATIONS.ARRAY_KEY_NAME,
                Transformer.TRANSFORMATIONS.OBJECT_KEY_NAME,
            );
            return product;
        },
    );

    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.INTERNAL_PRODUCT,
        Transformer.TRANSFORMATIONS.DB_INSERT_PRODUCT,
        (o) => {
            // "gtin", "name", "description", "category", "brand", "quantity_id", "images"
            const arr: any[] = [];
            arr.push(o.gtin);
            arr.push(o.name);
            arr.push(o.description);
            arr.push(o.category);
            arr.push(o.brand);
            arr.push(o.quantity.id);
            arr.push(o.images);
            return arr;
        },
    );

    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.DB_QUANTITY,
        Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
        (o) => {
            const quantity: CachedQuantity = {
                id: -1,
                value: -1,
                unit: 'year',
                amount: -1,
                total: -1,
            };
            quantity.id = o.id;
            quantity.amount = o.quantity_amount;
            quantity.value = o.quantity_value;
            quantity.unit = o.quantity_unit;
            quantity.total = quantity.amount * quantity.value;
            return quantity;
        },
    );

    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.UNSANITIZED_QUANTITY,
        Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
        (o) => {
            const quantity: ProductQuantity = {
                id: -1,
                value: -1,
                unit: 'year',
                amount: -1,
                total: -1,
            };
            quantity.id = o.id;
            quantity.unit = Utils.getSmallestMatchingUnit(o.unit);
            quantity.value = convert(o.value).from(o.unit).to(quantity.unit);
            quantity.amount = o.amount;
            quantity.total = quantity.amount * quantity.value;
            return quantity;
        },
    );

    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.DB_ATTRIBUTE,
        Transformer.TRANSFORMATIONS.INTERNAL_ATTRIBUTE,
        (o) => {
            const attribute: any = {};
            attribute.gtin = o.gtin;
            attribute.name = o.name;
            attribute.type = o.type;
            attribute.value = Utils.getAttributeValue(o);
            return attribute;
        },
    );

    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.INTERNAL_ATTRIBUTE,
        Transformer.TRANSFORMATIONS.DB_INSERT_ATTRIBUTE,
        (o) => {
            // gtin, name, type, text_value, integer_value, float_value, boolean_value
            const arr: any[] = [];
            arr.push(o.gtin);
            arr.push(o.name);
            arr.push(o.type);
            arr.push(o.type === 'text' ? o.value : null);
            arr.push(o.type === 'integer' ? o.value : null);
            arr.push(o.type === 'float' ? o.value : null);
            arr.push(o.type === 'boolean' ? o.value : null);
            return arr;
        },
    );
}
