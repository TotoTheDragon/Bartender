export interface Health {
    healthy: boolean;
    checks: object;
    dependencies: { [key: string]: HealthDependency };
}

interface HealthDependency {
    name: string;
    healthy: boolean;
    latency: number;
}
