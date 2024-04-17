import { CHOROPLETH_AVAILABLE_CONDITIONS } from "@src/components/Choropleth/ConditionSelector";
import { CUR_TIMEZONE, FORMAT_STRING } from "@src/constants";
import { ChoroplethConditionData, InsightProcessedData, Timeframes } from "@src/interfaces";
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
export const getChoroplethCondition = (condition: string): ChoroplethConditionData | undefined => {
  return CHOROPLETH_AVAILABLE_CONDITIONS.find((c) => c.value === condition);
}; // Function to convert hour number to readable string

/**
 * Get the readable string for the hour
 * @param hour The hour to convert
 * @returns The readable string
 */
const getHourString = (hour: number): string => {
  if (hour === 0) return "midnight";
  if (hour === 12) return "midday";
  if (hour < 12) return `${hour}am`;
  if (hour === 24) return "midnight";
  return `${hour - 12}pm`;
};

/**
 * Format the hours to be more readable
 * @param hours The hours to format
 * @returns The formatted hours
 */
function formatHours(hours: number[]): string {
  // Sort the hours in ascending order
  hours.sort((a, b) => a - b);

  let formattedString = "";
  let consecutiveStart = hours[0];
  let consecutiveEnd = hours[0];

  for (let i = 1; i < hours.length; i++) {
    if (hours[i] === hours[i - 1] + 1) {
      consecutiveEnd = hours[i];
    } else {
      if (consecutiveStart === consecutiveEnd) {
        formattedString += `${getHourString(consecutiveStart)}, `;
      } else if (consecutiveEnd - consecutiveStart === 1) {
        formattedString += `${getHourString(consecutiveStart)}, ${getHourString(consecutiveEnd)}, `;
      } else {
        formattedString += `${getHourString(consecutiveStart)}-${getHourString(consecutiveEnd)}, `;
      }
      consecutiveStart = consecutiveEnd = hours[i];
    }
  }

  // Handle the last set of hours
  if (consecutiveStart === consecutiveEnd) {
    formattedString += `${getHourString(consecutiveStart)}`;
  } else if (consecutiveEnd - consecutiveStart === 1) {
    formattedString += `${getHourString(consecutiveStart)}, ${getHourString(consecutiveEnd)}`;
  } else {
    formattedString += `${getHourString(consecutiveStart)}-${getHourString(consecutiveEnd)}`;
  }

  return formattedString;
}

/**
 * Format the timeframes to be more readable
 * @param timeFrames The timeframes to format
 * @returns The formatted timeframes
 */
const formatTimeFrames = (timeFrames: Timeframes[]): string[] => {
  return timeFrames.map((timeFrame: any) => {
    return `${getHourString(timeFrame.start)} to ${getHourString(timeFrame.end)}`;
  });
};

/**
 * Generate insights based on the processed data from the API for daily forecast
 * @param processedData The processed data from the API
 * @returns The insights generated
 */
export const generateInsightsDaily = (processedData: InsightProcessedData): string[] => {
  const { severeWeather, lowPrecipitation, timeFrame } = processedData;
  const insights = [];

  insights.push(
    severeWeather.length > 0
      ? `Severe weather is expected at ${formatHours(
          severeWeather
        )}. It is advisable to turn off your solar panels during this time.`
      : "No severe weather is expected today."
  );

  insights.push(
    lowPrecipitation.length > 0
      ? `Low precipitation is expected at ${formatHours(
          lowPrecipitation
        )} today. It is advisable to clean/maintain your solar panels during this time.`
      : "Precipitation is expected throughout the day, so it is not advisable to clean/maintain your solar panels today."
  );

  if (timeFrame) {
    insights.push(
      timeFrame.length > 0
        ? `There are long timeframes of low precipitation from ${formatTimeFrames(timeFrame).join(
            " and "
          )} today. It is advisable to hang your laundry out to dry during this time to save energy.`
        : "There are no long timeframes of low precipitation today, so it is not advisable to hang your laundry out to dry today."
    );
  }

  return insights;
};

/**
 * Format the days to be more readable
 * @param days The days to format
 * @returns The formatted days
 */
const formatDays = (days: number[]): string => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (days.length === 7) {
    return "throughout this week";
  }

  // if there are consecutive days, group them together
  const consecutiveDays = [];
  let consecutiveStart = days[0];
  let consecutiveEnd = days[0];

  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      consecutiveEnd = days[i];
    } else {
      if (consecutiveStart === consecutiveEnd) {
        consecutiveDays.push(daysOfWeek[consecutiveStart]);
      } else {
        consecutiveDays.push(`${daysOfWeek[consecutiveStart]}-${daysOfWeek[consecutiveEnd]}`);
      }
      consecutiveStart = consecutiveEnd = days[i];
    }
  }

  // Handle the last set of days
  if (consecutiveStart === consecutiveEnd) {
    consecutiveDays.push(daysOfWeek[consecutiveStart]);
  } else {
    consecutiveDays.push(`${daysOfWeek[consecutiveStart]}-${daysOfWeek[consecutiveEnd]}`);
  }

  return `on ${consecutiveDays.join(", ")}`;
};

/**
 * Generate insights based on the processed data from the API for weekly forecast
 * @param processedData The processed data from the API
 * @returns The insights generated
 */
export const generateInsightsWeekly = (processedData: InsightProcessedData): string[] => {
  const { severeWeather, lowPrecipitation } = processedData;
  const insights = [];

  insights.push(
    severeWeather.length > 0
      ? `Severe weather is expected ${formatDays(
          severeWeather
        )}. It is advisable to turn off your solar panels during this time.`
      : "No severe weather is expected this week."
  );

  insights.push(
    lowPrecipitation.length > 0
      ? `Low precipitation is expected ${formatDays(
          lowPrecipitation
        )} this week. It is advisable to clean/maintain your solar panels during this time.`
      : "Precipitation is expected throughout the week, so it is not advisable to clean/maintain your solar panels this week."
  );

  return insights;
};
