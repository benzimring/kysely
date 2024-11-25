/// <reference types="./provide-controlled-connection.d.ts" />
import { Deferred } from './deferred.js';
export async function provideControlledConnection(connectionProvider) {
    const connectionDefer = new Deferred();
    const connectionReleaseDefer = new Deferred();
    connectionProvider
        .provideConnection(async (connection) => {
        connectionDefer.resolve(connection);
        return await connectionReleaseDefer.promise;
    })
        .catch((ex) => connectionDefer.reject(ex));
    const connection = (await connectionDefer.promise);
    connection.release = connectionReleaseDefer.resolve;
    return connection;
}
