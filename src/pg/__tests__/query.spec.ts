import { extend, pg } from '../..';

describe('pg', () => {
  it('should accept an array of parameters', () => {
    const findMe = pg<{ id: string }, [string]>`
      SELECT * FROM public.foo
        WHERE id = $1::TEXT
    `;

    const id = 'someRandomId';

    const q = findMe.compile([id]);

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT * FROM public.foo
        WHERE id = $1::TEXT
    `,
      values: [id],
    });
  });

  it('should access key of parameters', () => {
    const findMe = pg<{ id: string }, { id: string }>`
      SELECT * FROM public.foo
        WHERE id = ${'id'}::TEXT
    `;

    const id = 'someRandomId';

    const q = findMe.compile({ id });

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT * FROM public.foo
        WHERE id = $1::TEXT
    `,
      values: [id],
    });
  });

  it('should add .value to parameters', () => {
    const id = 'someRandomId';
    const findMe = pg<{ id: string }>`
      SELECT * FROM public.foo
        WHERE id = ${(agg) => agg.value(id)}::TEXT
    `;

    const q = findMe.compile();

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT * FROM public.foo
        WHERE id = $1::TEXT
    `,
      values: [id],
    });
  });

  it('should use same parameter for multiple calls to same key', () => {
    const findMe = pg<{ id: string }, { id: string }>`
      SELECT * FROM public.foo
        WHERE id = ${'id'}::TEXT
        OR id = ${'id'}::TEXT
    `;

    const id = 'someRandomId';

    const q = findMe.compile({ id });

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT * FROM public.foo
        WHERE id = $1::TEXT
        OR id = $1::TEXT
    `,
      values: [id],
    });
  });

  it('should compile to same config with multiple calls', () => {
    const findMe = pg<{ id: string }, { id: string }>`
      SELECT * FROM public.foo
        WHERE id = ${'id'}::TEXT
    `;

    const id = 'someRandomId';

    const queries = Array.from({ length: 5 }, () => findMe.compile({ id }));

    for (const q of queries) {
      expect(q).toStrictEqual({
        name: expect.stringContaining(''),
        text: `
      SELECT * FROM public.foo
        WHERE id = $1::TEXT
    `,
        values: [id],
      });
    }
  });

  it('should access multiple keys', () => {
    const findMe = pg<{ id: string }, { bar: string; id: string }>`
      SELECT id FROM public.foo
        WHERE id = ${'id'}::TEXT
          AND foo = ${'bar'}::TEXT
    `;

    const id = 'foo';
    const bar = 'bar2000';

    const q = findMe.compile({ id, bar });

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT id FROM public.foo
        WHERE id = $1::TEXT
          AND foo = $2::TEXT
    `,
      values: [id, bar],
    });
  });

  it('should ignore order of params', () => {
    const findMe = pg<{ id: string }, { bar: string; id: string }>`
      SELECT id FROM public.foo
        WHERE id = ${'id'}::TEXT
          AND foo = ${'bar'}::TEXT
    `;

    const id = 'foo';
    const bar = 'bar2000';

    const q = findMe.compile({ bar, id });

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT id FROM public.foo
        WHERE id = $1::TEXT
          AND foo = $2::TEXT
    `,
      values: [id, bar],
    });
  });

  it('should parse array in .values', () => {
    const findMe = pg<{ id: string }, string[]>`
      SELECT id FROM public.foo
        WHERE id in (${(agg, items) => agg.values(items)})
    `;

    const values = ['foo', 'bar', 'and', 'cheddar'];

    const q = findMe.compile(values);

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT id FROM public.foo
        WHERE id in ($1,$2,$3,$4)
    `,
      values,
    });
  });

  it('should access array by key in .values', () => {
    const findMe = pg<{ id: string }, { id: string; tags: string[] }>`
      SELECT id FROM public.foo
        WHERE id = ${'id'}
        AND tags in (${(agg) => agg.values('tags')})
    `;

    const id = 'foobar';
    const tags = ['foo', 'bar', 'and', 'cheddar'];

    const q = findMe.compile({ tags, id: 'foobar' });

    expect(q).toStrictEqual({
      name: expect.stringContaining(''),
      text: `
      SELECT id FROM public.foo
        WHERE id = $1
        AND tags in ($2,$3,$4,$5)
    `,
      values: [id, ...tags],
    });
  });

  it('should work with no helpers with extend', () => {
    const findMe = pg<{ id: string }, string[]>`
        SELECT id FROM public.foo
        WHERE id in (${(agg, values) => agg.values(values)})
    `;

    const findMeExtended = extend(findMe, {});

    expect(Object.keys(findMeExtended)).toStrictEqual(['compile']);
  });

  it('should add helpers with extend', () => {
    const findMe = pg<{ id: string }, string[]>`
      SELECT id FROM public.foo
        WHERE id in (${(agg, values) => agg.values(values)})
    `;

    const findMeExtended = extend(findMe, {
      to: { id: ({ id }) => id },
      from: { id: ({ id }: { id: string }) => [id] },
    });

    const result = { id: 'foobar' };

    expect(findMeExtended.toId(result)).toStrictEqual(result.id);
    expect(findMeExtended.fromId(result)).toStrictEqual([result.id]);
  });

  it('should create different query names', () => {
    const findMe = pg<unknown, { a: number[]; b: number[] }>`
      SELECT * FROM public.foo
        WHERE a in (${(agg, { a }) => agg.values(a)})
        AND b in (${(agg, { b }) => agg.values(b)});
    `;

    const queryA = findMe.compile({ a: [1], b: [1, 1] });
    const queryB = findMe.compile({ a: [1, 1], b: [1] });

    expect(queryA.name).not.toStrictEqual(queryB.name);
  });

  it('should not fail for empty query', () => {
    const findMe = pg``;

    expect(findMe.compile()).toStrictEqual({
      name: expect.stringContaining(''),
      text: '',
      values: [],
    });
  });
});
