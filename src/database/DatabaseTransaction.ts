import { PoolClient } from 'pg';

export default class DatabaseTransaction {
    client: PoolClient;

    open: boolean;

    constructor(client: PoolClient) {
        this.client = client;
        this.open = true;
    }

    public async query<T>(query: string, args?: any[]): Promise<T[]> {
        if (!this.open) {
            throw new Error('Tried to query on closed transaction');
        }
        return (await this.client.query<T>(query, args)).rows;
    }

    public async queryFirst<T>(query: string, args?: any[]): Promise<T> {
        if (!this.open) {
            throw new Error('Tried to query on closed transaction');
        }
        return (await this.client.query<T>(query, args)).rows[0];
    }

    public async commit(close: boolean = true): Promise<void> {
        if (!this.open) {
            throw new Error('Tried to commit on closed transaction');
        }
        this.query('COMMIT');
        if (close) {
            this.close();
        }
    }

    public async rollback(close: boolean = true): Promise<void> {
        if (!this.open) {
            throw new Error('Tried to rollback on closed transaction');
        }
        this.query('ROLLBACK');
        if (close) {
            this.close();
        }
    }

    public async start(): Promise<void> {
        if (!this.open) {
            throw new Error('Tried to start on closed transaction');
        }
        this.query('BEGIN');
    }

    private async close(): Promise<void> {
        if (!this.open) {
            throw new Error('Tried to close already closed transaction');
        }
        this.open = false;
        this.client.release();
    }
}
