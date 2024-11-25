/// <reference types="./parse-json-results-plugin.d.ts" />
import { isPlainObject, isString } from '../../util/object-utils.js';
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
export class ParseJSONResultsPlugin {
    opt;
    #objectStrategy;
    constructor(opt = {}) {
        this.opt = opt;
        this.#objectStrategy = opt.objectStrategy || 'in-place';
    }
    // noop
    transformQuery(args) {
        return args.node;
    }
    async transformResult(args) {
        return {
            ...args.result,
            rows: parseArray(args.result.rows, this.#objectStrategy),
        };
    }
}
function parseArray(arr, objectStrategy) {
    const target = objectStrategy === 'create' ? new Array(arr.length) : arr;
    for (let i = 0; i < arr.length; ++i) {
        target[i] = parse(arr[i], objectStrategy);
    }
    return target;
}
function parse(obj, objectStrategy) {
    if (isString(obj)) {
        return parseString(obj);
    }
    if (Array.isArray(obj)) {
        return parseArray(obj, objectStrategy);
    }
    if (isPlainObject(obj)) {
        return parseObject(obj, objectStrategy);
    }
    return obj;
}
function parseString(str) {
    if (maybeJson(str)) {
        try {
            return parse(JSON.parse(str), 'in-place');
        }
        catch (err) {
            // this catch block is intentionally empty.
        }
    }
    return str;
}
function maybeJson(value) {
    return value.match(/^[\[\{]/) != null;
}
function parseObject(obj, objectStrategy) {
    const target = objectStrategy === 'create' ? {} : obj;
    for (const key in obj) {
        target[key] = parse(obj[key], objectStrategy);
    }
    return target;
}
