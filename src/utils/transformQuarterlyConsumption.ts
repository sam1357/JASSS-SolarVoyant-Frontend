import {
  HOUSEHOLD_1_CONSUMPTION,
  HOUSEHOLD_2_CONSUMPTION,
  HOUSEHOLD_3_CONSUMPTION,
  HOUSEHOLD_4_CONSUMPTION,
  HOUSEHOLD_5_CONSUMPTION,
} from "@src/constants";

export default function transformQuarterlyConsumption(value: Object) {
  if (value && "householdMembers" in value && typeof value.householdMembers === "string") {
    switch (value.householdMembers) {
      case "1":
        return HOUSEHOLD_1_CONSUMPTION;
      case "2":
        return HOUSEHOLD_2_CONSUMPTION;
      case "3":
        return HOUSEHOLD_3_CONSUMPTION;
      case "4":
        return HOUSEHOLD_4_CONSUMPTION;
      case "5":
        return HOUSEHOLD_5_CONSUMPTION;
    }
  }

  // If the input is an object, transform it into a comma-separated string of its values
  if (typeof value === "object" && value !== null) {
    const filteredValues = Object.values(value).filter(
      (item) => item !== undefined && item !== null && item !== ""
    );
    return filteredValues.join(",");
  }

  return "";
}
