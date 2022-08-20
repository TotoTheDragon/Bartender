export interface Attribute {
    gtin: string;
    name: string;
    type: 'text' | 'integer' | 'float' | 'boolean';
    value: string | number | boolean;
}
