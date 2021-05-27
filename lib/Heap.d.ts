export default class Heap<T> {
    heap: Array<T>;
    branchFactor: number;
    compare: (a: T, b: T) => number;
    constructor(compare?: (a: T, b: T) => number, branchFactor?: number);
    get length(): number;
    isHigherPriority(a: T, b: T): boolean;
    highestPriorityChildIndex(root: number): number | null;
    firstLeafIndex(): number;
    parentIndex(index: number): number | null;
    pushDown(index?: number): void;
    bubbleUp(index: number): void;
    top(): T | null;
    peek(): T | undefined;
    search(item: T): number;
    insert(item: T): void;
    remove(item: T): void;
}
