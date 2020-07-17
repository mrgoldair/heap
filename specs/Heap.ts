import * as fc from 'fast-check';
import { Heap } from '../src/Heap';

test('Every sub-root is less than its parent', () => {
	
	fc.assert(
		fc.property(fc.array(fc.tuple(fc.string(6), fc.nat())), (a:[string, number][]) => {
			let queue:Heap<String> = new Heap();
			let heap = queue.heap;

			for (let index = 0; index < a.length; index++) {
				const [ val, priority ] = a[index];
				queue.insert(val, priority);
			}

			return heap.every((node, index) => {

				// the root of our tree (index 0) has no parent
				let parentIndex: number | null = queue.parentIndex(index);

				if (parentIndex){
					let parent = heap[parentIndex];
					return node.priority > parent.priority;
				} else {
					return true;
				}
			});
		}),
		{verbose: true}
	);
});

test('parentIndex always returns positive integers', () => {

	fc.assert(
		fc.property(fc.nat(), (index) => {
			let heap:Heap<String> = new Heap();

			let parentIndex = heap.parentIndex(index);

			return parentIndex >= 0 || parentIndex == null;
		}),
		{verbose: true}
	);
});