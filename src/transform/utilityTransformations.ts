import Transformer from './transformer';

export default function registerUtilityTransformations() {
    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.ARRAY_KEY_NAME,
        Transformer.TRANSFORMATIONS.OBJECT_KEY_NAME,
        (o: any[]) => {
            const obj: any = {};
            o.forEach((i) => {
                obj[i.name] = i;
            });
            return obj;
        },
    );

    Transformer.registerTransformer(
        Transformer.TRANSFORMATIONS.OBJECT_KEY_NAME,
        Transformer.TRANSFORMATIONS.ARRAY_KEY_NAME,
        (o: { [key: string]: any }) => {
            const arr: any[] = [];
            Object.keys(o).forEach((key) => {
                arr.push(o[key]);
            });
            return arr;
        },
    );
}
