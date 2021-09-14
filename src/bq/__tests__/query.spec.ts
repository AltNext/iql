import { bq, extend } from '../..';

const getParamsFromValues = <T>(values: T[], startIndex = 0): Record<string, T> =>
  values.reduce<Record<string, T>>((acc, value, index) => ({ ...acc, [`param_${index + startIndex}`]: value }), {});

describe('bq', () => {
  it('should accept an array of parameters', () => {
    const findMe = bq<{ id: string }, [string]>`
      SELECT * FROM \`public.foo\`
        WHERE id = @param_0
    `;

    const id = 'asdasda';

    const q = findMe.compile([id]);

    expect(q).toStrictEqual({
      query: `
      SELECT * FROM \`public.foo\`
        WHERE id = @param_0
    `,
      params: getParamsFromValues([id]),
    });
  });

  it('should access key of parameters', () => {
    const findMe = bq<{ id: string }, { id: string }>`
      SELECT * FROM \`public.foo\`
        WHERE id = ${'id'}
    `;

    const id = 'asdasda';

    const q = findMe.compile({ id });

    expect(q).toStrictEqual({
      query: `
      SELECT * FROM \`public.foo\`
        WHERE id = @id
    `,
      params: { id },
    });
  });

  it('should add .value to parameters', () => {
    const id = 'asdasda';
    const findMe = bq<{ id: string }>`
      SELECT * FROM \`public.foo\`
        WHERE id = ${(agg) => agg.value(id)}
    `;

    const q = findMe.compile();

    expect(q).toStrictEqual({
      query: `
      SELECT * FROM \`public.foo\`
        WHERE id = @param_0
    `,
      params: getParamsFromValues([id]),
    });
  });

  it('should use same parameter for multiple calls to same key', () => {
    const findMe = bq<{ id: string }, { id: string }>`
      SELECT * FROM \`public.foo\`
        WHERE id = ${'id'}
        OR id = ${'id'}
    `;

    const id = 'asdasda';

    const q = findMe.compile({ id });

    expect(q).toStrictEqual({
      query: `
      SELECT * FROM \`public.foo\`
        WHERE id = @id
        OR id = @id
    `,
      params: { id },
    });
  });

  it('should compile to same config with multiple calls', () => {
    const findMe = bq<{ id: string }, { id: string }>`
      SELECT * FROM \`public.foo\`
        WHERE id = ${'id'}
    `;

    const id = 'asdasda';

    const queries = Array.from({ length: 5 }, () => findMe.compile({ id }));

    for (const q of queries) {
      expect(q).toStrictEqual({
        query: `
      SELECT * FROM \`public.foo\`
        WHERE id = @id
    `,
        params: { id },
      });
    }
  });

  it('should access multiple keys', () => {
    const findMe = bq<{ id: string }, { bar: string; id: string }>`
      SELECT id FROM \`public.foo\`
        WHERE id = ${'id'}
          AND foo = ${'bar'}
    `;

    const id = 'foo';
    const bar = 'bar2000';

    const q = findMe.compile({ id, bar });

    expect(q).toStrictEqual({
      query: `
      SELECT id FROM \`public.foo\`
        WHERE id = @id
          AND foo = @bar
    `,
      params: { id, bar },
    });
  });

  it('should ignore order of params', () => {
    const findMe = bq<{ id: string }, { bar: string; id: string }>`
      SELECT id FROM \`public.foo\`
        WHERE id = ${'id'}
          AND foo = ${'bar'}
    `;

    const id = 'foo';
    const bar = 'bar2000';

    const q = findMe.compile({ bar, id });

    expect(q).toStrictEqual({
      query: `
      SELECT id FROM \`public.foo\`
        WHERE id = @id
          AND foo = @bar
    `,
      params: { id, bar },
    });
  });

  it('should parse array in .values', () => {
    const findMe = bq<{ id: string }, string[]>`
      SELECT id FROM \`public.foo\`
        WHERE id in (${(agg, items) => agg.values(items)})
    `;

    const values = ['foo', 'bar', 'and', 'cheddar'];

    const q = findMe.compile(values);

    expect(q).toStrictEqual({
      query: `
      SELECT id FROM \`public.foo\`
        WHERE id in (@param_0,@param_1,@param_2,@param_3)
    `,
      params: getParamsFromValues(values),
    });
  });

  it('should access array by key in .values', () => {
    const findMe = bq<{ id: string }, { id: string; tags: string[] }>`
      SELECT id FROM \`public.foo\`
        WHERE id = ${'id'}
        AND tags in (${(agg) => agg.values('tags')})
    `;

    const id = 'foobar';
    const tags = ['foo', 'bar', 'and', 'cheddar'];

    const q = findMe.compile({ tags, id: 'foobar' });

    expect(q).toStrictEqual({
      query: `
      SELECT id FROM \`public.foo\`
        WHERE id = @id
        AND tags in (@param_0,@param_1,@param_2,@param_3)
    `,
      params: { id, ...getParamsFromValues(tags) },
    });
  });

  it('should work with no helpers with extend', () => {
    const findMe = bq<{ id: string }, string[]>`
        SELECT id FROM \`public.foo\`
        WHERE id in (${(agg, values) => agg.values(values)})
    `;

    const findMeExtended = extend(findMe, {});

    expect(Object.keys(findMeExtended)).toStrictEqual(['compile']);
  });

  it('should add helpers with extend', () => {
    const findMe = bq<{ id: string }, string[]>`
      SELECT id FROM \`public.foo\`
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

  it('should not fail for empty query', () => {
    const findMe = bq``;

    expect(findMe.compile()).toStrictEqual({
      query: '',
      params: {},
    });
  });

  it('should work with compileValue named `param_N`', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const findMe = bq<{ id: string }, { param_0: string }>`
      SELECT * FROM \`public.foo\`
        WHERE id = ${(agg, { param_0 }) => agg.value(param_0)}
    `;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const param_0 = 'asdasda';

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const q = findMe.compile({ param_0 });

    expect(q).toStrictEqual({
      query: `
      SELECT * FROM \`public.foo\`
        WHERE id = @param_1
    `,
      params: getParamsFromValues([param_0], 1),
    });
  });

  it('should work again with compileValue named `param_N`', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const findMe = bq<{ id: string }, { param_0: string }>`
      SELECT * FROM \`public.foo\`
        WHERE id = ${(agg, { param_0 }) => agg.value(param_0)}
        AND id = ${'param_0'}
    `;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const param_0 = 'asdasda';

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const q = findMe.compile({ param_0 });

    expect(q).toStrictEqual({
      query: `
      SELECT * FROM \`public.foo\`
        WHERE id = @param_1
        AND id = @param_0
    `,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      params: { ...getParamsFromValues([param_0], 1), param_0 },
    });
  });
});
