import { HOUSEHOLD_1_CONSUMPTION, HOUSEHOLD_2_CONSUMPTION, HOUSEHOLD_3_CONSUMPTION, HOUSEHOLD_4_CONSUMPTION, HOUSEHOLD_5_CONSUMPTION } from "@src/constants";

export default function transformQuarterlyConsumption(value: Object) {
    if (typeof value === 'object' && value !== null) {
        const filteredValues = Object.values(value).filter(item => item !== undefined && item !== null && item !== '');
        return filteredValues.join(",");
    }

    return "";
}
