export interface Attribute {
    name: string,
    type: 'text' | 'integer' | 'float' | 'boolean',
    value: string | number | boolean
}
