/// <reference types="./foreign-key-constraint-builder.d.ts" />
import { ForeignKeyConstraintNode } from '../operation-node/foreign-key-constraint-node.js';
import { parseOnModifyForeignAction } from '../parser/on-modify-action-parser.js';
export class ForeignKeyConstraintBuilder {
    #node;
    constructor(node) {
        this.#node = node;
    }
    onDelete(onDelete) {
        return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, {
            onDelete: parseOnModifyForeignAction(onDelete),
        }));
    }
    onUpdate(onUpdate) {
        return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, {
            onUpdate: parseOnModifyForeignAction(onUpdate),
        }));
    }
    /**
     * Simply calls the provided function passing `this` as the only argument. `$call` returns
     * what the provided function returns.
     */
    $call(func) {
        return func(this);
    }
    toOperationNode() {
        return this.#node;
    }
}
