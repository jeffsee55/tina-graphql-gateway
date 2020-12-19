import { snakeCase, toLower } from "lodash";
import * as yup from "yup";

export const slugify = (string: string) => {
  return toLower(snakeCase(string));
};

/**
 * Iterate through an array of promises sequentially, ensuring the order
 * is preserved.
 *
 * ```js
 * await sequential(templates, async (template) => {
 *   await doSomething(template)
 * })
 * ```
 */
export const sequential = async <A, B>(
  items: A[],
  callback: (args: A) => Promise<B>
) => {
  const accum: B[] = [];

  const reducePromises = async (previous: Promise<B>, endpoint: A) => {
    const prev = await previous;
    // initial value will be undefined
    if (prev) {
      accum.push(prev);
    }

    return callback(endpoint);
  };

  // @ts-ignore FIXME: this can be properly typed
  const result = await items.reduce(reducePromises, Promise.resolve());
  if (result) {
    // @ts-ignore FIXME: this can be properly typed
    accum.push(result);
  }

  return accum;
};

/**
 * Asserts the generic type provided matches the runtime value of the `value`. These assertions
 * are built using the [Yup library](https://github.com/jquense/yup).
 *
 * ```ts
 * // Usage - Given an item, which is of type `unknown`:
 * const item = args.fromSomeEntryPoint // type "unknown"
 *
 * assertShape<{relativePath: string, section: string}>(item, (yup) => yup.object({
 *   relativePath: yup.string().required()
 *   section: yup.string().required()
 * }))
 *
 * // yields no Typescript errors
 * item.relativePath // type "string"
 * ```
 *
 * NOTE: assertions are only as strong as the Yup schema you give it, if you omitted the `required()`
 * portion, null values would be able to pass through as if they're valid
 */
export function assertShape<T extends object>(
  value: unknown,
  yupSchema: (args: typeof yup) => yup.Schema<unknown, unknown>
): asserts value is T {
  const shape = yupSchema(yup);
  try {
    shape.validateSync(value);
  } catch (e) {
    throw new Error(`Failed to assertShape - ${e.message}`);
  }
}
