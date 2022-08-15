import HealthManager from './HealthManager';

export default abstract class HealthDependency {
    latency: number;

    required: boolean;

    constructor(required: boolean = true) {
        this.required = required;

        this.latency = -1;
    }

    // eslint-disable-next-line no-unused-vars
    abstract init(manager: HealthManager): Promise<void>;

    abstract isHealthy(): boolean;

    getStatus(): HealthDependencyFields {
        return {
            healthy: this.isHealthy(),
            required: this.required,
            latency: this.latency,
        };
    }
}

export interface HealthDependencyFields {
    healthy: boolean;

    latency: number;

    required: boolean;
}
