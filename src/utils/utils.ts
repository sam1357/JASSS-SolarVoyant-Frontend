import { CHOROPLETH_AVAILABLE_CONDITIONS } from "@src/components/Choropleth/ConditionSelector";
import { CUR_TIMEZONE, FORMAT_STRING } from "@src/constants";
import { ConditionsSelectorData } from "@src/interfaces";
import { format, toZonedTime } from "date-fns-tz";

/**
 * Checks if a string is a parse-able JSON object
 * @param s the string to check
 * @returns if the string is JSON parse-able
 */
export const testJSON = (s: string): boolean => {
  if (typeof s !== "string") {
    return false;
  }
  try {
    JSON.parse(s);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Given a date string, format it in a given format (default yyyy-MM-dd) in the current timezone
 * @param {Date} date The date to format
 * @param {string} inFormat The format to use
 * @returns {string} The formatted date
 */
export const formatDate = (date: Date, inFormat = FORMAT_STRING): string => {
  const dateInSydneyTimezone = toZonedTime(date, CUR_TIMEZONE);
  return format(dateInSydneyTimezone, inFormat);
};

/**
 * Generate a date that is x days before or after the given date.
 * @param {Date} date - The date to start from.
 * @param {number} days - The number of days to add or subtract.
 * @returns {Date} The new date.
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

/**
 * Given a value, get the full choropleth condition
 * @param condition The condition to get the full data for
 * @returns The data for the condition
 */
export const getChoroplethCondition = (condition: string): ConditionsSelectorData | undefined => {
  return CHOROPLETH_AVAILABLE_CONDITIONS.find((c) => c.value === condition);
};
