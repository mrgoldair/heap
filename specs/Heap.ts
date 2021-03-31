import * as fc from 'fast-check';
import { Heap } from '../src/Heap';

// test('Sample', () => {
// 	console.log(fc.sample(fc.array(fc.tuple(fc.string(), fc.nat()), { minLength:1 } ), 3))
// })

test('Heap(min) returns items in priority order', () => {
	fc.assert(
		fc.property(fc.array(fc.tuple(fc.string({minLength:4}), fc.nat()), { minLength:5 }), inputs => {
			let queue:Heap<string> = new Heap();

			for (let index = 0; index < inputs.length; index++) {
				const [ key,priority ] = inputs[index];
				queue.insert( key,priority );
			}

			let results = [];
			while( queue.peek() != null ){
				results.push(queue.top());
			}

			for (let index = 0; index < results.length - 1; index++) {
				let [ a,p ] = results[index];
				let [ b,q ] = results[index + 1];
				expect(p).toBeLessThanOrEqual(q);
			}
		})
	);
});