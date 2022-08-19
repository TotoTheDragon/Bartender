import { Client, ClientConfig } from 'pg';
import { Logger } from 'winston';
import HealthDependency from '../health/HealthDependency';

export default class DatabaseManager extends HealthDependency {
    private logger: Logger;

    private client: Client;

    latency: number;

    connected: boolean;

    constructor(logger: Logger, config?: ClientConfig) {
        super();
        this.logger = logger;
        this.client = new Client(config);
        this.latency = -1;
        this.connected = false;
        this.client.on('end', () => {
            this.connected = false;
        });
        this.client.on('error', () => {
            this.connected = false;
        });
    }

    public async connect(): Promise<void> {
        return this.client.connect((err) => {
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
        return (await this.client.query<T>(query, args)).rows;
    }

    public async queryFirst<T>(query: string, args?: any[]): Promise<T> {
        return (await this.client.query<T>(query, args)).rows[0];
    }
}
