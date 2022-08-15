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

    static now() {
        const ts = process.hrtime();
        return ts[0] * 1e3 + ts[1] / 1e6;
    }

    static average(nums: number[]): number | undefined {
        return nums.length
            ? nums.reduce((a, b) => a + b, 0) / nums.length
            : undefined;
    }
}
