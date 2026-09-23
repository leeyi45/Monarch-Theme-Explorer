import { describe, expect, it } from 'vitest';

import { unflattenObject } from '../utils';

describe(unflattenObject, () => {
  it('works on non-nested', () => {
    const obj = unflattenObject([
      ['a', 'hi'],
      ['b', 'bye']
    ]);

    expect(obj.a).toEqual({ '': 'hi' });
    expect(obj.b).toEqual({ '': 'bye' });
  });

  it('works on nested', () => {
    const obj = unflattenObject([
      ['a', 'a'],
      ['a.b', 'b'],
      ['a.c', 'c'],
      ['b.c.d', 'd']
    ]);

    expect(obj.a).toEqual({
      '': 'a',
      b: { '': 'b' },
      c:  { '': 'c' }
    });

    expect(obj.b).toEqual({
      c: { d: { '': 'd' } }
    });
  });

  it('overwrites when a property is specified more than once', () => {
    const obj = unflattenObject([
      ['b.c', 4],
      ['a', 1],
      ['a', 2],
      ['b.c', 3],
    ]);

    expect(obj.a['']).toEqual(2);
    expect(obj.b.c['']).toEqual(3);
  });
});
