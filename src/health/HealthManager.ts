import { Logger } from 'winston';
import { Health } from '../models/v1/Health';
import Utils from '../Utils';
import HealthChecker from './HealthChecker';
import HealthDependency from './HealthDependency';

export default class HealthManager {
    private logger: Logger;

    private dependencies: { [name: string]: HealthDependency };

    private checkers: { [name: string]: HealthChecker };

    private dependencyCache: { [name: string]: boolean };

    private checkerCache: { [name: string]: boolean };

    private options: HealthManagerOptions;

    constructor(logger: Logger, opts?: HealthManagerOptions) {
        this.logger = logger;
        this.dependencies = {};
        this.dependencyCache = {};
        this.checkers = {};
        this.checkerCache = {};
        this.options = Utils.fillInDefaults(opts, DefaultOptions);
    }

    public registerDependency(name: string, dependency: HealthDependency) {
        this.dependencies[name] = dependency;
        dependency.init(this);
        setInterval(() => {
            const healthy = dependency.isHealthy();
            if (
                !healthy &&
                (name in this.dependencyCache
                    ? this.dependencyCache[name]
                    : true)
            ) {
                this.logger.warn('Found unhealthy dependency', {
                    name,
                    status: dependency.getStatus(),
                });
                if (this.options.dependencyNotifyOnce) {
                    this.dependencyCache[name] = false;
                }
            } else if (
                healthy &&
                (name in this.dependencyCache
                    ? !this.dependencyCache[name]
                    : false)
            ) {
                this.logger.warn('Found recovered dependency', {
                    name,
                    status: dependency.getStatus(),
                });
                if (this.options.dependencyNotifyOnce) {
                    this.dependencyCache[name] = true;
                }
            }
        }, 1000);
    }

    public registerChecker(checker: HealthChecker, interval: number = 30000) {
        this.checkers[checker.name] = checker;
        checker.doHealthCheck();
        setInterval(async () => {
            await checker.doHealthCheck();
        }, interval);
        setInterval(async () => {
            const healthy = checker.lastCheck?.healthy;
            if (
                !healthy &&
                (checker.name in this.checkerCache
                    ? this.checkerCache[checker.name]
                    : true)
            ) {
                this.logger.warn('Found unhealthy component', {
                    name: checker.name,
                    status: checker.lastCheck,
                });
                if (this.options.checkerNotifyOnce) {
                    this.checkerCache[checker.name] = false;
                }
            } else if (
                healthy &&
                (checker.name in this.checkerCache
                    ? !this.checkerCache[checker.name]
                    : false)
            ) {
                this.logger.warn('Found recovered component', {
                    name: checker.name,
                    status: checker.lastCheck,
                });
                if (this.options.checkerNotifyOnce) {
                    this.checkerCache[checker.name] = true;
                }
            }
        }, 1000);
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

interface HealthManagerOptions {
    checkerNotifyOnce?: boolean;
    dependencyNotifyOnce?: boolean;
}

const DefaultOptions: HealthManagerOptions = {
    checkerNotifyOnce: true,
    dependencyNotifyOnce: true,
};
