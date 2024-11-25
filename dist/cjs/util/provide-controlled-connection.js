"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideControlledConnection = provideControlledConnection;
const deferred_js_1 = require("./deferred.js");
async function provideControlledConnection(connectionProvider) {
    const connectionDefer = new deferred_js_1.Deferred();
    const connectionReleaseDefer = new deferred_js_1.Deferred();
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
