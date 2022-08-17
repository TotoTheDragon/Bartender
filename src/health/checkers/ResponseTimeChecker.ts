import percentile from 'percentile';
import Utils from '../../Utils';
import HealthChecker from '../HealthChecker';

export default class ResponseTimeChecker extends HealthChecker {
    // TODO benchmark
    /*
        TODO if too slow rewrite datastructure to node-based system
        that overwrites root with root+1 and then adds another one at tail
    */

    history: number[];

    constructor() {
        super('response-time');
        this.history = [];
    }

    addResponseTime(time: number) {
        this.history.push(time);
        while (this.history.length > 1000) this.history.shift();
    }

    async doHealthCheck(): Promise<void> {
        const percentiles: number[] = percentile(
            [50, 90, 95],
            this.history,
        ) as number[];
        this.lastCheck = {
            healthy: percentiles[0] < 30 || percentiles[0] === undefined,
            average: Utils.average(this.history),
            '50th': percentiles[0],
            '90th': percentiles[1],
            '95th': percentiles[2],
        };
    }
}
