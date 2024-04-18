import {
  HOUSEHOLD_1_CONSUMPTION,
  HOUSEHOLD_2_CONSUMPTION,
  HOUSEHOLD_3_CONSUMPTION,
  HOUSEHOLD_4_CONSUMPTION,
  HOUSEHOLD_5_CONSUMPTION,
} from "@src/constants";

export default function transformQuarterlyConsumption(value: any) {
  if (value.use === "householdMembers") {
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

  // Join quarter1C, quarter2C, quarter3C, quarter4C
  const { quarter1C, quarter2C, quarter3C, quarter4C } = value;
  if (quarter1C && quarter2C && quarter3C && quarter4C) {
    return `${quarter1C},${quarter2C},${quarter3C},${quarter4C}`;
  }

  return "";
}
