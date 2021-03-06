export default class Heap {
    constructor(compare, branchFactor = 4) {
        this.branchFactor = branchFactor;
        this.heap = new Array();
        this.compare = compare;
    }
    get length() {
        return this.heap.length;
    }
    // Is `a` higher priority than `b`
    isHigherPriority(a, b) {
        // If the heap is just numbers we can determine priority easily
        if (typeof a == "number" && typeof b == "number")
            return a < b;
        // Otherwise we have to use the comparator fn to determine priority
        if (this.compare == null)
            throw new Error("Non number types must be used with a custom comparator");
        // Unless we're strictly a lower number (< 0), then we're not higher priority
        // Conversely, if we're equal to or higher then (0,1), we're lower priority
        let result = this.compare(a, b) < 0;
        return result;
    }
    highestPriorityChildIndex(root) {
        // First child index
        let currentIndex = (root * this.branchFactor) + 1;
        let current = this.heap[currentIndex];
        if (current == null)
            return null;
        for (let index = ((root * this.branchFactor) + 2); index <= ((root * this.branchFactor) + this.branchFactor); index++) {
            // get our next child
            let candidate = this.heap[index];
            // our current node is the last child
            if (candidate == null)
                return currentIndex;
            if (this.isHigherPriority(candidate, current)) {
                currentIndex = index;
                current = candidate;
            }
        }
        return currentIndex;
    }
    // This is tree (not heap) specific so could perhaps be imported from such a module
    firstLeafIndex() {
        return Math.round(this.heap.length / this.branchFactor);
    }
    parentIndex(index) {
        // 0 is the root of the tree and by definition, has no parent
        if (index == 0)
            return null;
        return Math.round(Math.floor((index - 1) / this.branchFactor));
    }
    pushDown(index = 0) {
        // Only makes sense when there's multiple items to compare
        if (this.heap.length < 2)
            return;
        let currentIndex = index;
        let node = this.heap[index];
        let firstLeafIndex = this.firstLeafIndex();
        // By definition we'll should always be traversing nodes that have some children
        while (currentIndex < firstLeafIndex) {
            let highestPriorityChildIndex = this.highestPriorityChildIndex(currentIndex);
            let highestPriorityChild = this.heap[highestPriorityChildIndex];
            // If the child is higher priority, swap them
            if (this.isHigherPriority(highestPriorityChild, node)) {
                this.heap[currentIndex] = highestPriorityChild;
                currentIndex = highestPriorityChildIndex;
            }
            else {
                break;
            }
        }
        // we can't traverse the tree anymore, so place our node at `currentIndex` 
        this.heap[currentIndex] = node;
    }
    bubbleUp(index) {
        // The node we're bubbling up from tail position
        let current = this.heap[index];
        // The index under inspection as we travel up the heap
        let currentIndex = index;
        // We exit either because
        // a) we're at the root or
        // b) we've stabilised the heap's invariants
        while (currentIndex > 0) {
            let parentIndex = this.parentIndex(currentIndex);
            let parent = this.heap[parentIndex];
            if (this.isHigherPriority(current, parent)) {
                // Swap the parent with current node
                this.heap[currentIndex] = parent;
                // Update the index to compare against
                currentIndex = parentIndex;
            }
            else {
                // b) heap invariants are satisfied; our element is in the right spot
                this.heap[currentIndex] = current;
                return;
            }
        }
        // a) we've reached the root so this MUST be where current is set
        this.heap[currentIndex] = current;
        return;
    }
    top() {
        let item;
        if (this.heap.length > 0) {
            item = this.heap[0];
        }
        else {
            return null;
        }
        // Copy last element to first index
        this.heap[0] = this.heap[this.length - 1];
        // Remove the (now duplicate) last element
        this.heap = this.heap.slice(0, this.length - 1);
        // Push down root to reinstate heap invariants
        this.pushDown(0);
        // Return our min/max item
        return item;
    }
    peek() {
        // Non destructive - doesn't remove [0]
        return this.heap[0];
    }
    search(item) {
        for (let index = 0; index < this.heap.length; index++) {
            if (this.compare(item, this.heap[index]) == 0)
                return index;
        }
        return -1;
    }
    contains(item) {
        return this.search(item) != -1;
    }
    insert(item) {
        if (item.toString().trim().length == 0)
            throw new Error("item cannot be empty");
        // Disallow duplicates
        if (this.search(item) != -1)
            return;
        // node goes to the end of the heap
        this.heap.push(item);
        // move new node into the correct position, reinstating heap invariants
        this.bubbleUp(this.heap.length - 1);
    }
    remove(item) {
        let index = this.search(item);
        // Not found so just return
        if (index == -1)
            return;
        // Our item also happens to be the last in the heap
        if (index == (this.heap.length - 1)) {
            this.heap.pop();
            return;
        }
        // Simply overwrite the item at the index being removed
        this.heap[index] = this.heap.pop();
        // reinstate heap invariants
        this.pushDown(index);
    }
}
