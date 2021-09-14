import type { BuilderInput, IParamAggregator } from './interfaces';

export const generateQuery = <T, K, ArrayProps extends boolean>(
  template: TemplateStringsArray,
  agg: IParamAggregator<K, ArrayProps>,
  compileValues: K,
  args: BuilderInput<T, K, ArrayProps>[],
): string => {
  const parts = Array.from(template);

  return args.reduce((acc, arg) => {
    if (typeof arg === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return `${acc}${arg(agg, compileValues)}${parts.shift()!}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return `${acc}${agg.key(arg)}${parts.shift()!}`;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, parts.shift()!);
};
