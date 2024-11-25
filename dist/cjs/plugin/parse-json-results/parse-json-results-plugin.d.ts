import { QueryResult } from '../../driver/database-connection.js';
import { RootOperationNode } from '../../query-compiler/query-compiler.js';
import { UnknownRow } from '../../util/type-utils.js';
import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs } from '../kysely-plugin.js';
export interface ParseJSONResultsPluginOptions {
    /**
     * When `'in-place'`, arrays' and objects' values are parsed in-place. This is
     * the most time and space efficient option.
     *
     * This can result in runtime errors if some objects/arrays are readonly.
     *
     * When `'create'`, new arrays and objects are created to avoid such errors.
     *
     * Defaults to `'in-place'`.
     */
    objectStrategy?: ObjectStrategy;
}
type ObjectStrategy = 'in-place' | 'create';
/**
 * Parses JSON strings in query results into JSON objects.
 *
 * This plugin can be useful with dialects that don't automatically parse
 * JSON into objects and arrays but return JSON strings instead.
 *
 * ```ts
 * const db = new Kysely<DB>({
 *   // ...
 *   plugins: [new ParseJSONResultsPlugin()]
 *   // ...
 * })
 * ```
 */
export declare class ParseJSONResultsPlugin implements KyselyPlugin {
    #private;
    readonly opt: ParseJSONResultsPluginOptions;
    constructor(opt?: ParseJSONResultsPluginOptions);
    /**
     * This is called for each query before it is executed. You can modify the query by
     * transforming its {@link OperationNode} tree provided in {@link PluginTransformQueryArgs.node | args.node}
     * and returning the transformed tree. You'd usually want to use an {@link OperationNodeTransformer}
     * for this.
     *
     * If you need to pass some query-related data between this method and `transformResult` you
     * can use a `WeakMap` with {@link PluginTransformQueryArgs.queryId | args.queryId} as the key:
     *
     * ```ts
     * const plugin = {
     *   data: new WeakMap<QueryId, SomeData>(),
     *
     *   transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
     *     this.data.set(args.queryId, something)
     *     return args.node
     *   },
     *
     *   transformResult(args: PluginTransformResultArgs): QueryResult<UnknownRow> {
     *     const data = this.data.get(args.queryId)
     *     return args.result
     *   }
     * }
     * ```
     *
     * You should use a `WeakMap` instead of a `Map` or some other strong references because `transformQuery`
     * is not always matched by a call to `transformResult` which would leave orphaned items in the map
     * and cause a memory leak.
     */
    transformQuery(args: PluginTransformQueryArgs): RootOperationNode;
    /**
     * This method is called for each query after it has been executed. The result
     * of the query can be accessed through {@link PluginTransformResultArgs.result | args.result}.
     * You can modify the result and return the modifier result.
     */
    transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>>;
}
export {};
