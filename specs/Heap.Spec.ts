import * as fc from 'fast-check';
import { Heap } from '../src/Heap';

// test('Sample', () => {
// 	console.log(fc.sample(fc.array(
//     fc.record({
//       start: fc.record({ x:fc.nat(),y:fc.nat() }),
//       end: fc.record({ x:fc.nat(),y:fc.nat() })
//   }),{ minLength:1 } ), 3))
// })

type Point = {
  x:number,
  y:number
}

function comparePoints( a:Point,b:Point ) {
  let r:number = a.y - b.y;
    
  if ( r == 0 ){
    return a.x - b.x;
  } else {
    return r;
  }
}

test('Heap (number) returns items in priority order', () => {
  fc.assert(
    fc.property(fc.array(fc.nat()), inputs => {
      let queue:Heap<number> = new Heap();

      for (let index = 0; index < inputs.length; index++) {
        queue.insert( inputs[index] );
      }

      let results = [];
      while ( queue.peek() != undefined ){
        results.push( queue.top() );
      }

      for (let index = 0; index < results.length - 1; index++) {
        let a = results[index];
        let b = results[index + 1];
        expect(a).toBeLessThanOrEqual(b);
      }
    })
  );
});

test('Heap (segment) returns items in priority order', () => {
  fc.assert(
    fc.property(fc.array(fc.record({ x:fc.nat(),y:fc.nat() })), inputs => {
      let queue:Heap<Point> = new Heap(comparePoints);

      for (let index = 0; index < inputs.length; index++) {
        queue.insert( inputs[index] );
      }

      let results = [];
      while( queue.peek() != undefined ){
        results.push(queue.top());
      }

      for (let index = 0; index < results.length - 1; index++) {
        let a = results[index];
        let b = results[index + 1];
        expect(a.y).toBeLessThanOrEqual(b.y);
      }
    })
  );
});