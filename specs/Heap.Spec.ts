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

type Segment = {
  start:Point
  end:Point
}

function compareSegments(a:Segment,b:Segment) {
  let r:number = a.start.y - b.start.y
    
  if ( r == 0 ){
    return a.start.x - b.start.x;
  } else {
    return r;
  }
}

test('Heap(min) returns items in priority order', () => {
  fc.assert(

    fc.property(fc.array(fc.record({
      start: fc.record({ x:fc.nat(),y:fc.nat() }),
      end: fc.record({ x:fc.nat(),y:fc.nat() })
    })), inputs => {
      let queue:Heap<Segment> = new Heap(compareSegments);

      for (let index = 0; index < inputs.length; index++) {
        queue.insert( inputs[index] );
      }

      let results = [];
      while( queue.peek() != null ){
        results.push(queue.top());
      }

      for (let index = 0; index < results.length - 1; index++) {
        let a = results[index];
        let b = results[index + 1];
        expect(a).toBeLessThanOrEqual(b);
      }
    })
  );
});