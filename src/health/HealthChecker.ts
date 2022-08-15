export default abstract class HealthChecker {
    name: string;

    lastCheck: { healthy: boolean; [key: string]: any } | null;

    constructor(name: string) {
        this.name = name;
        this.lastCheck = null;
    }

    abstract doHealthCheck(): Promise<void>;
}
