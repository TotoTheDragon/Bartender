import { ClientConfig, Pool } from 'pg';
import { Logger } from 'winston';
import HealthDependency from '../health/HealthDependency';
import DatabaseTransaction from './DatabaseTransaction';

export default class DatabaseManager extends HealthDependency {
    private logger: Logger;

    private pool: Pool;

    latency: number;

    connected: boolean;

    constructor(logger: Logger, config?: ClientConfig) {
        super();
        this.logger = logger;
        this.pool = new Pool(config);
        this.latency = -1;
        this.connected = false;
        this.pool.on('error', () => {
            this.connected = false;
        });
    }

    public async connect(): Promise<void> {
        return this.pool.connect((err) => {
            if (err) {
                this.logger.error('Could not connect to database', { err });
            }
            this.connected = true;
        });
    }

    public async ping(): Promise<number> {
        const start: number = Date.now();
        await this.query('SELECT 1;');
        const end: number = Date.now();
        this.latency = end - start;
        return this.latency;
    }

    public isHealthy(): boolean {
        return this.connected && this.latency >= 0 && this.latency <= 100;
    }

    async init(): Promise<void> {
        setInterval(() => {
            try {
                this.ping();
            } catch {
                this.latency = -1;
            }
        }, 10000);
        this.ping();
    }

    public async query<T>(query: string, args?: any[]): Promise<T[]> {
        return (await this.pool.query<T>(query, args)).rows;
    }

    public async queryFirst<T>(query: string, args?: any[]): Promise<T> {
        return (await this.pool.query<T>(query, args)).rows[0];
    }

    public async createTransaction(): Promise<DatabaseTransaction> {
        const client = await this.pool.connect();
        const transaction = new DatabaseTransaction(client);
        await transaction.start();
        return transaction;
    }
}
