import type { Wretch, WretchAddon } from "../types.js";
export interface FormDataAddon {
  /**
   * Converts the javascript object to a FormData and sets the request body.
   *
   * ```js
   * const form = {
   *   hello: "world",
   *   duck: "Muscovy",
   * };
   *
   * wretch("...").addons(FormDataAddon).formData(form).post();
   * ```
   *
   * The `recursive` argument when set to `true` will enable recursion through all
   * nested objects and produce `object[key]` keys. It can be set to an array of
   * string to exclude specific keys.
   *
   * > Warning: Be careful to exclude `Blob` instances in the Browser, and
   * > `ReadableStream` and `Buffer` instances when using the node.js compatible
   * > `form-data` package.
   *
   * ```js
   * const form = {
   *   duck: "Muscovy",
   *   duckProperties: {
   *     beak: {
   *       color: "yellow",
   *     },
   *     legs: 2,
   *   },
   *   ignored: {
   *     key: 0,
   *   },
   * };
   *
   * // Will append the following keys to the FormData payload:
   * // "duck", "duckProperties[beak][color]", "duckProperties[legs]"
   * wretch("...").addons(FormDataAddon).formData(form, ["ignored"]).post();
   * ```
   *
   * @param formObject - An object which will be converted to a FormData
   * @param recursive - If `true`, will recurse through all nested objects. Can be set as an array of string to exclude specific keys.
   */
  formData<T extends FormDataAddon, C, R>(
    this: T & Wretch<T, C, R>,
    formObject: object,
    recursive?: string[] | boolean,
  ): this;
}
/**
 * Adds the ability to convert a an object to a FormData and use it as a request body.
 *
 * ```js
 * import FormDataAddon from "wretch/addons/formData"
 *
 * wretch().addon(FormDataAddon)
 * ```
 */
declare const formData: WretchAddon<FormDataAddon>;
export default formData;
