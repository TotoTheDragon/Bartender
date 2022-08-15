import { Client, ClientConfig } from 'pg';
import HealthDependency from '../health/HealthDependency';

export default class DatabaseManager extends HealthDependency {
    client: Client;

    latency: number;

    connected: boolean;

    constructor(config?: ClientConfig) {
        super();
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
                console.log(err);
                console.log('Was not able to connect to database');
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
    }

    public async query<T>(query: string, args?: any[]): Promise<T[]> {
        return (await this.client.query<T>(query, args)).rows;
    }
}
