import { Client, ClientConfig } from 'pg';

export default class DatabaseManager {
    private client: Client;

    constructor(config?: ClientConfig) {
        this.client = new Client(config);
    }

    public async connect(): Promise<void> {
        return this.client.connect();
    }

    public async query<T>(query: string, args?: any[]): Promise<T[]> {
        return (await this.client.query<T>(query, args)).rows;
    }
}
