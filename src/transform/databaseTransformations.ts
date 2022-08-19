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
            product.gtin = o.gtin;
            product.name = o.name;
            product.description = o.description;
            product.brand = o.brand;
            product.category = o.category;
            product.images = o.images || [];
            product.attributes = {};
            product.quantity = undefined;
            return product;
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
        Transformer.TRANSFORMATIONS.UNSANITED_QUANTITY,
        Transformer.TRANSFORMATIONS.INTERNAL_QUANTITY,
        (o) => {
            const quantity: ProductQuantity = {
                value: -1,
                unit: 'year',
                amount: -1,
                total: -1,
            };
            quantity.unit = Utils.getSmallestMatchingUnit(o.unit);
            quantity.value = convert(o.value).from(o.unit).to(quantity.unit);
            quantity.amount = o.quantity_amount;
            quantity.total = quantity.amount * quantity.value;
            return quantity;
        },
    );

    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.DB_ATTRIBUTE,
        Transformer.TRANSFORMATIONS.INTERNAL_ATTRIBUTE,
        (o) => {
            const attribute: any = {};
            attribute.name = o.name;
            attribute.type = o.type;
            attribute.value = Utils.getAttributeValue(o);
            return attribute;
        },
    );
}
