class Node<T,U> {
	
	value: T;
	priority: U;

	constructor(value: T, priority: U){
		this.priority = priority;
		this.value = value;
	}
}

export class Heap<T> {

	heap: Array<Node<T,Number>>;
	branchFactor: number;

	constructor(branchFactor:number = 4) {
		this.branchFactor = branchFactor;
		this.heap = new Array<Node<T,Number>>();
	}

	highestPriorityChildIndex(root: number): number | null {
		
		// calculate where the children nodes start
		let currentIndex:number = (root * this.branchFactor) + 1;
		let current:Node<T,Number> = this.heap[currentIndex];

		if (current == null) return null;

		for(let index:number = ((root * this.branchFactor) + 2); index <= ((root * this.branchFactor) + this.branchFactor); index++){
			// get our next child
			let candidate:Node<T,Number> = this.heap[index];

			// our current node is the last child
			if(candidate == null) return currentIndex;

			if(candidate.priority < current.priority){
				currentIndex = index;
				current = candidate;
			}
		}

		return currentIndex;
	}

	// this is tree (not heap) specific so could perhaps be imported from such a module
	firstLeafIndex(): number {
		return Math.round(this.heap.length / 4);
	}

	// same here...
	parentIndex(index:number): number | null {

		// 0 is the root of the tree and by definition, has no parent
		if (index == 0) return null;

		return Math.round(Math.floor((index - 1) / this.branchFactor));
	}

	pushDown(index:number): void {

		let currentIndex:number = index;
		let node:Node<T,Number> = this.heap[index];
		let firstLeafIndex:number = this.firstLeafIndex();

		while(currentIndex < firstLeafIndex){

			// by definition of our while-loop, we'll should 
			// always be traversing nodes that have children
			let highestPriorityChildIndex:number | null = this.highestPriorityChildIndex(currentIndex);

			let highestPriorityChild = this.heap[highestPriorityChildIndex];

			// if our node is of lesser priority (higher value in min heap), then swap it
			if(node.priority > highestPriorityChild.priority) {
				this.heap[currentIndex] = highestPriorityChild;
				currentIndex = highestPriorityChildIndex;
			} else {
				// our node is of higher priority (lesser value); heap invariants are satisfied
				return;
			}
		}

		// we can't traverse the tree anymore, so place our node at `currentIndex` 
		this.heap[currentIndex] = node;
	}

	bubbleUp(index:number): void {
		
		// The node we're bubbling up from tail position
		let current:Node<T,Number> = this.heap[index];
		// The index under inspection as we travel up the heap
		let currentIndex:number = index;

		// We exit either because
		// a) we're at the root or
		// b) we've stabilised the heap's invariants
		while (currentIndex > 0){
			let parentIndex: number = this.parentIndex(currentIndex);
			let parent:Node<T,Number> = this.heap[parentIndex];

			if(current.priority < parent.priority){
				// Swap the parent with current node
				this.heap[currentIndex] = parent;
				// Update the index to compare against
				currentIndex = parentIndex;
			} else {
				// b) heap invariants are satisfied; our element is in the right spot
				this.heap[currentIndex] = current;
				return;
			}
		}

		// a) we've reached the root so this MUST be where current is set
		this.heap[currentIndex] = current;
		return;
	}

	top(): T | null {
		// get first (still exists in heap)
		let item:T;

		if(this.heap.length) {
			item = this.heap[0].value;
		} else {
			return null;
		}

		// place last element, first
		this.heap[0] = this.heap[this.heap.length - 1];

		// remove the (now duplicate) last element
		this.heap = this.heap.slice(0, this.heap.length - 1);

		// push down root to reinstate heap invariants
		this.pushDown(0);

		// return our min/max item
		return item;
	}

	peek(): T {
		// does not affect the heap
		return this.heap[0].value;
	}

	search(value:T): number {

		for (let index = 0; index < this.heap.length; index++) {
			if ( value == this.heap[index].value ) return index;
		}

		return -1;
	}

	insert(value:T, priority:number): void {

		// if the value exists, update the node (val and priority)
		if ( this.search(value) ) return this.update(value, priority);

		// create our new heap node
		let node:Node<T,Number> = new Node<T,Number>(value, priority);

		// node goes to the end of the heap
		this.heap.push(node)

		// move new node into the correct position, reinstating heap invariants
		this.bubbleUp(this.heap.length - 1);
	}

	remove(value:T): void {

		let index:number = this.search(value);

		// if it's not found, return
		if(!index) return;

		// if our item also happens to be the last in the heap
		// the usual processing (popping and assigning) essentially replace it with itself.
		if( index == this.heap.length - 1) {
			// pop and discard;
			this.heap.pop();
			return;
		}

		// .. otherwise move the tail of heap to `found` index
		// `pop()` also shrinks the underlying array so we don't
		// need to slice
		this.heap[index] = this.heap.pop();

		// reinstate heap invariants
		this.pushDown(index);
	}

	update(value:T, priority:number, index?:number ): void {

		// index may be passed in to update an already found value
		if(index == null) index = this.search(value);

		// if the index, and therefore value, exists, update it
		if(index) {
			this.heap[index].value = value;
		}

		// set new priority and reinstate heapd invariants
		if(this.heap[index].priority == priority) {
			return;
		} else if (this.heap[index].priority > priority) {
			this.heap[index].priority = priority;
			this.pushDown(index);
		} else {
			this.heap[index].priority = priority;
			this.bubbleUp(index);
		}
	}
}