import DatabaseManager from './DatabaseManager';
import DatabaseTransaction from './DatabaseTransaction';

export type DatabaseQuerier = DatabaseManager | DatabaseTransaction;
