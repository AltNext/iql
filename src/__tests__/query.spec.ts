import { extend, query } from '../query';

describe('query', () => {
  it('index', () => {
    const findMe = query<{ id: string }, [string]>`
      SELECT * FROM public.foo
        WHERE id = $1::text
    `;

    const id = 'asdasda';

    const q = findMe.compile([id]);

    expect(q).toStrictEqual({
      name: expect.anything(),
      text: `
      SELECT * FROM public.foo
        WHERE id = $1::text
    `,
      values: [id],
    });
  });

  it('key', () => {
    const findMe = query<{ id: string }, { id: string }>`
      SELECT * FROM public.foo
        WHERE id = ${'id'}::text
    `;

    const id = 'asdasda';

    const q = findMe.compile({ id });

    expect(q).toStrictEqual({
      name: expect.anything(),
      text: `
      SELECT * FROM public.foo
        WHERE id = $1::text
    `,
      values: [id],
    });
  });

  it('multi call', () => {
    const findMe = query<{ id: string }, { id: string }>`
      SELECT * FROM public.foo
        WHERE id = ${'id'}::text
    `;

    const id = 'asdasda';

    const queries = Array.from({ length: 5 }, () => findMe.compile({ id }));

    for (const q of queries) {
      expect(q).toStrictEqual({
        name: expect.anything(),
        text: `
      SELECT * FROM public.foo
        WHERE id = $1::text
    `,
        values: [id],
      });
    }
  });

  it('key multiple', () => {
    const findMe = query<{ id: string }, { bar: string; id: string }>`
      SELECT id FROM public.foo
        WHERE id = ${'id'}::text
          AND foo = ${'bar'}::text
    `;

    const id = 'foo';
    const bar = 'bar2000';

    const q = findMe.compile({ id, bar });

    expect(q).toStrictEqual({
      name: expect.anything(),
      text: `
      SELECT id FROM public.foo
        WHERE id = $1::text
          AND foo = $2::text
    `,
      values: [id, bar],
    });
  });

  it('key multiple reverse', () => {
    const findMe = query<{ id: string }, { bar: string; id: string }>`
      SELECT id FROM public.foo
        WHERE id = ${'id'}::text
          AND foo = ${'bar'}::text
    `;

    const id = 'foo';
    const bar = 'bar2000';

    const q = findMe.compile({ bar, id });

    expect(q).toStrictEqual({
      name: expect.anything(),
      text: `
      SELECT id FROM public.foo
        WHERE id = $1::text
          AND foo = $2::text
    `,
      values: [id, bar],
    });
  });

  it('array', () => {
    const findMe = query<{ id: string }, string[]>`
      SELECT id FROM public.foo
        WHERE id in (${(agg, items) => agg.values(items)})
    `;

    const values = ['foo', 'bar', 'and', 'cheddar'];

    const q = findMe.compile(values);

    expect(q).toStrictEqual({
      name: expect.anything(),
      text: `
      SELECT id FROM public.foo
        WHERE id in ($1,$2,$3,$4)
    `,
      values,
    });
  });

  it('key array', () => {
    const findMe = query<{ id: string }, { id: string; tags: string[] }>`
      SELECT id FROM public.foo
        WHERE id = ${'id'}
        AND tags in (${(agg, { tags }) => agg.values(tags)})
    `;

    const id = 'foobar';
    const tags = ['foo', 'bar', 'and', 'cheddar'];

    const q = findMe.compile({ tags, id: 'foobar' });

    expect(q).toStrictEqual({
      name: expect.anything(),
      text: `
      SELECT id FROM public.foo
        WHERE id = $1
        AND tags in ($2,$3,$4,$5)
    `,
      values: [id, ...tags],
    });
  });

  it('extention', () => {
    const findMe = query<{ id: string }, string[]>`
      SELECT id FROM public.foo
        WHERE id in (${(agg, values) => agg.values(values)})
    `;

    const findMeExtended = extend(findMe, { to: { asId: ({ id }) => id } });

    const result = { id: 'foobar' };

    expect(findMeExtended.asId(result)).toStrictEqual(result.id);
  });

  it('query name', () => {
    const findMe = query<unknown, { a: number[]; b: number[] }>`
      SELECT * FROM public.foo
        WHERE a in (${(agg, { a }) => agg.values(a)})
        AND b in (${(agg, { b }) => agg.values(b)});
    `;

    const queryA = findMe.compile({ a: [1], b: [1, 1] });
    const queryB = findMe.compile({ a: [1, 1], b: [1] });

    expect(queryA.name).not.toStrictEqual(queryB.name);
  });
});
