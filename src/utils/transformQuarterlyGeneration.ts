export default function transformQuarterlyConsumption(value: Object) {
  if (typeof value === "object" && value !== null) {
    const filteredValues = Object.values(value).filter(
      (item) => item !== undefined && item !== null && item !== ""
    );
    return filteredValues.join(",");
  }

  return "";
}
