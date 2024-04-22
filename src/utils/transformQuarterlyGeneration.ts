/**
 * Transforms quarterly consumption data based on the provided object value.
 *
 * @param {Object} value The object containing consumption data.
 * @returns {string} Transformed quarterly consumption data joined by comma.
 */
export default function transformQuarterlyConsumption(value: Object) {
  if (typeof value === "object" && value !== null) {
    const filteredValues = Object.values(value).filter(
      (item) => item !== undefined && item !== null && item !== ""
    );
    return filteredValues.join(",");
  }

  return "";
}
