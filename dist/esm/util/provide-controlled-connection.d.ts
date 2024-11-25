import { ConnectionProvider } from '../driver/connection-provider.js';
import { DatabaseConnection } from '../driver/database-connection.js';
export declare function provideControlledConnection(connectionProvider: ConnectionProvider): Promise<ControlledConnection>;
export interface ControlledConnection extends DatabaseConnection {
    release(): void;
}
