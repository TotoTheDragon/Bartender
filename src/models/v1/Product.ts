import { BartenderImage } from './BartenderImage';
import { ProductQuantity } from './ProductQuantity';

export interface Product {
    gtin?: string;
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    images?: BartenderImage[];
    quantity?: ProductQuantity;
    attributes?: {[key: string]: string | number | boolean}
}
