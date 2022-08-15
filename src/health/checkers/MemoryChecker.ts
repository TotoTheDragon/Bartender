import { totalmem } from 'os';
import HealthChecker from '../HealthChecker';

export default class MemoryChecker extends HealthChecker {
    constructor() {
        super('memory');
    }
    async doHealthCheck(): Promise<void> {
        const usage = process.memoryUsage();
        const heapPercentage = (100 * usage.heapUsed) / usage.heapTotal;
        const systemUsage = (100 * usage.rss) / totalmem();
        const healthy = heapPercentage < 99 && systemUsage < 95;
        this.lastCheck = {
            healthy,
            heapPercentage: Math.round(heapPercentage),
            systemUsage: Math.round(systemUsage),
        };
    }
}
