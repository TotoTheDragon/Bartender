import { HealthDependencyFields } from '../../health/HealthDependency';

export interface Health {
    healthy: boolean;
    checks: { [key: string]: any };
    dependencies: { [key: string]: HealthDependencyFields };
}
