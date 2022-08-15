export default abstract class HealthChecker {
    name: string;

    lastCheck: object | null;

    constructor(name: string) {
        this.name = name;
        this.lastCheck = null;
    }

    abstract doHealthCheck(): Promise<void>;
}
