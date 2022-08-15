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
}
