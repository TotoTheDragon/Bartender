import convert, { Unit } from 'convert-units';

/* eslint-disable no-param-reassign */
export default class Utils {
    static mapObjectValue<T, V>(object: { [key: string]: T }, mapFn: (_: T) => V) {
        return Object.keys(object).reduce((result: { [key: string]: V }, key) => {
            result[key] = mapFn(object[key]);
            return result;
        }, {});
    }

    static fillInDefaults(object: object | undefined, defaults: object): object {
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
        return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : undefined;
    }

    static getSmallestMatchingUnit(unit: Unit): Unit {
        switch (convert().describe(unit).measure) {
        case 'angle':
            return 'deg';
        case 'apparentPower':
            return 'mVA';
        case 'area':
            return 'mm2';
        case 'current':
            return 'mA';
        case 'ditgital':
            return 'B';
        case 'energy':
            return 'mWh';
        case 'frequency':
            return 'mHz';
        case 'illuminance':
            return 'lx';
        case 'length':
            return 'mm';
        case 'mass':
            return 'mg';
        case 'pace':
            return 's/m';
        case 'partsPer':
            return 'ppq';
        case 'power':
            return 'mW';
        case 'pressure':
            return 'Pa';
        case 'reactiveEnergy':
            return 'mVARh';
        case 'reactivePower':
            return 'mVAR';
        case 'speed':
            return 'm/s';
        case 'temperature':
            return 'C';
        case 'time':
            return 'ms';
        case 'voltage':
            return 'mV';
        case 'volume':
            return 'ml';
        case 'volumeFlowRate':
            return 'ml/s';
        default:
            return convert().describe(unit).abbr;
        }
    }
}
