/* eslint-disable no-param-reassign */
export default class Utils {
    static mapObjectValue<T, V>(
        object: { [key: string]: T },
        mapFn: (_: T) => V,
    ) {
        return Object.keys(object).reduce(
            (result: { [key: string]: V }, key) => {
                result[key] = mapFn(object[key]);
                return result;
            },
            {},
        );
    }

    static fillInDefaults(
        object: object | undefined,
        defaults: object,
    ): object {
        const obj: { [key: string]: any } = {};
        if (object !== undefined) {
            Object.entries(object).forEach(([key, val]) => {
                obj[key] = val;
            });
        }
        Object.entries(defaults).forEach(([key, val]) => {
            if (!(key in obj)) obj[key] = val;
        });
        return obj;
    }
}
