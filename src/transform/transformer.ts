export default class Transformer {
    static TRANSFORMATIONS = {
        DB_PRODUCT: 'database-product',
        INTERNAL_PRODUCT: 'internal-product',
        DB_QUANTITY: 'database-quantity',
        INTERNAL_QUANTITY: 'internal-quantity',
        UNSANITIZED_QUANTITY: 'unsanitized-quantity',
        DB_ATTRIBUTE: 'database-attribute',
        INTERNAL_ATTRIBUTE: 'internal-attribute',
        ARRAY_KEY_NAME: 'array-key-name',
        OBJECT_KEY_NAME: 'object-key-name',
    };

    static transformationMap: Map<string, Map<string, (o: any) => any>> = new Map();

    static transform<T>(object: any, from: string, to: string): T {
        if (!this.transformationMap.has(from) || !this.transformationMap.get(from)!.has(to)) {
            throw new Error(
                `Tried to transform from: ${from}, to: ${to}, but have no transformations available`,
            );
        }

        const transformer = this.transformationMap.get(from)!.get(to)!;

        return transformer(object);
    }

    static transformArray<T>(object: any[], from: string, to: string): T[] {
        if (!this.transformationMap.has(from) || !this.transformationMap.get(from)!.has(to)) {
            throw new Error(
                `Tried to transform from: ${from}, to: ${to}, but have no transformations available`,
            );
        }

        const transformer = this.transformationMap.get(from)!.get(to)!;

        return object
            .filter((i) => i !== null)
            .filter((i) => i !== undefined)
            .map((i) => transformer(i));
    }

    static registerTransformer(from: string, to: string, transformer: (_o: any) => any) {
        if (!this.transformationMap.has(from)) {
            this.transformationMap.set(from, new Map());
        }
        this.transformationMap.get(from)!.set(to, transformer);
    }
}
