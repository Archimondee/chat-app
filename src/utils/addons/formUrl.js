function encodeQueryValue(key, value) {
  return (
    encodeURIComponent(key) +
    "=" +
    encodeURIComponent(
      typeof value === "object" ? JSON.stringify(value) : "" + value,
    )
  );
}
function convertFormUrl(formObject) {
  return Object.keys(formObject)
    .map(key => {
      const value = formObject[key];
      if (value instanceof Array) {
        return value.map(v => encodeQueryValue(key, v)).join("&");
      }
      return encodeQueryValue(key, value);
    })
    .join("&");
}
/**
 * Adds the ability to convert a an object to a FormUrl and use it as a request body.
 *
 * ```js
 * import FormUrlAddon from "wretch/addons/formUrl"
 *
 * wretch().addon(FormUrlAddon)
 * ```
 */
const formUrl = {
  wretch: {
    formUrl(input) {
      return this.body(
        typeof input === "string" ? input : convertFormUrl(input),
      ).content("application/x-www-form-urlencoded");
    },
  },
};
export default formUrl;
//# sourceMappingURL=formUrl.js.map
