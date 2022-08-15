import { Health } from '../models/v1/Health';
import HealthChecker from './HealthChecker';
import HealthDependency from './HealthDependency';
import Utils from '../Utils';

export default class HealthManager {
    private dependencies: { [name: string]: HealthDependency };

    private checkers: { [name: string]: HealthChecker };

    constructor() {
        this.dependencies = {};
        this.checkers = {};
    }

    public registerDependency(name: string, dependency: HealthDependency) {
        this.dependencies[name] = dependency;
        dependency.init(this);
    }

    public registerChecker(checker: HealthChecker, interval: number = 30000) {
        this.checkers[checker.name] = checker;
        checker.doHealthCheck();
        setInterval(() => checker.doHealthCheck(), interval);
    }

    public isHealthy(): boolean {
        const faultyDependency = Object.values(this.dependencies).find(
            (dependency) => !dependency.isHealthy() && dependency.required,
        );
        if (faultyDependency !== undefined) return false;
        return true;
    }

    public getHealth(): Health {
        return {
            healthy: this.isHealthy(),
            dependencies: Utils.mapObjectValue(
                this.dependencies,
                (dependency) => dependency.getStatus(),
            ),
            checks: Utils.mapObjectValue(
                this.checkers,
                (checker) => checker.lastCheck,
            ),
        };
    }
}
