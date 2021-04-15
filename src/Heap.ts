
export class Heap<T> {

  heap: Array<T>;
  branchFactor: number;
  compare: (a:T,b:T) => number;

  constructor(compare?:(a:T,b:T) => number, branchFactor:number = 4) {
    this.branchFactor = branchFactor;
    this.heap = new Array<T>();
    this.compare = compare;
  }

  get length() {
    return this.heap.length;
  }

  // Is `a` higher priority than `b`
  isHigherPriority(a:T,b:T): boolean {

    // If the heap is just numbers we can determine priority easily
    if (typeof a == "number" && typeof b == "number"){
      return a < b;
    }

    // Otherwise we have to use the comparator fn to determine priority
    if (this.compare == null)
      throw new Error("Non number types must be used with a custom comparator");

    // Unless we're strictly a lower number (< 0), then we're not higher priority
    // Conversely, if we're equal to or higher then (0,1), we're lower priority
    let result = this.compare(a,b) < 0 ? true : false;
    return result;
  }

  highestPriorityChildIndex(root: number): number | null {

    // calculate where the children nodes start
    let currentIndex:number = (root * this.branchFactor) + 1;
    let current:T = this.heap[currentIndex];

    if (current == null)
      return null;

    for(let index:number = ((root * this.branchFactor) + 2);
        index <= ((root * this.branchFactor) + this.branchFactor);
        index++){
      // get our next child
      let candidate:T = this.heap[index];

      // our current node is the last child
      if(candidate == null)
        return currentIndex;

      if( this.isHigherPriority( candidate,current ) ){
        currentIndex = index;
        current = candidate;
      }
    }

    return currentIndex;
  }

  // this is tree (not heap) specific so could perhaps be imported from such a module
  firstLeafIndex(): number {
    return Math.round(this.heap.length / this.branchFactor);
  }

  // same here...
  parentIndex(index:number): number | null {

    // 0 is the root of the tree and by definition, has no parent
    if ( index == 0 )
      return null;

    return Math.round(Math.floor((index - 1) / this.branchFactor));
  }

  pushDown(index:number): void {

    let currentIndex:number = index;
    let node:T = this.heap[index];
    let firstLeafIndex:number = this.firstLeafIndex();

    while(currentIndex < firstLeafIndex){

      // by definition of our while-loop, we'll should 
      // always be traversing nodes that have children
      let highestPriorityChildIndex:number | null = this.highestPriorityChildIndex(currentIndex);

      let highestPriorityChild = this.heap[highestPriorityChildIndex];

      // if our node is of lesser priority (higher ordinal value in a min heap), then swap it
      if( !this.isHigherPriority(node,highestPriorityChild) ) {
        this.heap[currentIndex] = highestPriorityChild;
        currentIndex = highestPriorityChildIndex;
      } else {
        // our node is of higher priority (lower ordinal value); heap invariants are satisfied
        return;
      }
    }

    // we can't traverse the tree anymore, so place our node at `currentIndex` 
    this.heap[currentIndex] = node;
  }

  bubbleUp(index:number): void {

    // The node we're bubbling up from tail position
    let current:T = this.heap[index];
    // The index under inspection as we travel up the heap
    let currentIndex:number = index;

    // We exit either because
    // a) we're at the root or
    // b) we've stabilised the heap's invariants
    while (currentIndex > 0){
      let parentIndex:number = this.parentIndex(currentIndex);
      let parent:T = this.heap[parentIndex];

      if ( this.isHigherPriority(current,parent) ){
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

  top(): T {
    
    let item:T;

    if ( this.heap.length > 0 ){
      item = this.heap[0];
    } else {
      return null;
    }

    // copy last element to first index
    this.heap[0] = this.heap[this.length - 1];

    // remove the (now duplicate) last element
    this.heap = this.heap.slice(0, this.length - 1);

    // push down root to reinstate heap invariants
    this.pushDown(0);

    // return our min/max item
    return item;
  }

  peek(): T | null {
    // does not affect the heap
    if( this.heap[0] ) {
      return this.heap[0];
    } else {
      return null;
    }
  }

  search(item:T): number | boolean {

    for (let index = 0; index < this.heap.length; index++) {
      if( item == this.heap[index] )
        return index;
    }

    return false;
  }

  insert(item:T): boolean {

    if( item.toString().trim().length == 0 )
      throw new Error("item cannot be empty");
      
    // Disallow duplicates
    if( this.search(item) )
      return false;

    // node goes to the end of the heap
    this.heap.push(item)

    // move new node into the correct position, reinstating heap invariants
    this.bubbleUp(this.heap.length - 1);

    return true;
  }

  remove(item:T): void {

    let index:number | boolean = this.search(item);

    // if it's not found, return
    if(!index)
      return;

    if( typeof index == "number" ) {

      // if our item also happens to be the last in the heap
      if( index == (this.heap.length - 1) ) {
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
  }
}