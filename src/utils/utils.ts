import { CHOROPLETH_AVAILABLE_CONDITIONS } from "@src/components/Choropleth/ConditionSelector";
import {
  CUR_TIMEZONE,
  DEFAULT_RETRIEVAL_LAMBDA,
  DEFAULT_USER_DATA_LAMBDA,
  FORMAT_STRING,
} from "@src/constants";
import {
  ConditionsSelectorData,
  fullUserObj,
  hourlyEnergyDataObj,
  InsightProcessedData,
  Timeframes,
  quarterlySuburbConditions,
} from "@src/interfaces";
import { format, toZonedTime } from "date-fns-tz";
import numeric from "numeric";
import LambdaInvoker from "@utils/lambdaInvoker";

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

/**
 * Calculate temperature and daylight coefficient for energy consumption prediction
 * @param user
 * @returns
 */
export async function handleCoefficientCalculation(user: any, userId: string): Promise<void> {
  const consumptionArray = user.quarterly_energy_consumption.split(",");

  // Now assume all those fields exist
  const coefficientMatrix = [
    [parseFloat(user.q1_t), parseFloat(user.q1_d)],
    [parseFloat(user.q2_t), parseFloat(user.q2_d)],
    [parseFloat(user.q3_t), parseFloat(user.q3_d)],
    [parseFloat(user.q4_t), parseFloat(user.q4_d)],
  ];
  const solutionEquation = [
    parseFloat(consumptionArray[0].trim()),
    parseFloat(consumptionArray[1].trim()),
    parseFloat(consumptionArray[2].trim()),
    parseFloat(consumptionArray[3].trim()),
  ];

  const svd = numeric.svd(coefficientMatrix);
  // Calculating the pseudoinverse
  const S = numeric.diag(
    numeric.rep([svd.S.length], 0).map((_x: any, i: any) => (svd.S[i] > 0 ? 1 / svd.S[i] : 0))
  );
  const A_inv = numeric.dot(numeric.transpose(svd.V), numeric.dot(S, numeric.transpose(svd.U)));

  const solution: any = numeric.dot(A_inv, solutionEquation);

  const tempCoefficient = solution[0];
  const daylightCoefficient = solution[1];
  if (user.user_id) {
    await setDataOfUser(userId, {
      "temp_coefficient": String(Math.abs(tempCoefficient)),
      "daylight_coefficient": String(-Math.abs(daylightCoefficient)),
    });
  }
}

/**
 * Calculate prod coefficient for energy generation prediction
 * @param user
 * @returns void
 */
export async function calculateProdCoefficientVals(user: any, userId: string): Promise<void> {
  const prod_coefficients: number[] = [];

  let predictedGenerationQ1;
  // Calculate the predicted generation for Q1 and each quarter
  if (parseFloat(user.q1_t) > 25) {
    predictedGenerationQ1 =
      parseFloat(user.q1_r) *
      parseFloat(user.surface_area) *
      (1 - 0.004 * (parseFloat(user.q1_t) - 25));
  } else {
    predictedGenerationQ1 = parseFloat(user.q1_r);
  }

  let predictedGenerationQ2;
  if (parseFloat(user.q2_t) > 25) {
    predictedGenerationQ2 =
      parseFloat(user.q2_r) *
      parseFloat(user.surface_area) *
      (1 - 0.004 * (parseFloat(user.q2_t) - 25));
  } else {
    predictedGenerationQ2 = parseFloat(user.q2_r);
  }

  let predictedGenerationQ3;
  if (parseFloat(user.q3_t) > 25) {
    predictedGenerationQ3 =
      parseFloat(user.q3_r) *
      parseFloat(user.surface_area) *
      (1 - 0.004 * (parseFloat(user.q3_t) - 25));
  } else {
    predictedGenerationQ3 = parseFloat(user.q3_r);
  }

  let predictedGenerationQ4;
  if (parseFloat(user.q4_t) > 25) {
    predictedGenerationQ4 =
      parseFloat(user.q4_r) *
      parseFloat(user.surface_area) *
      (1 - 0.004 * (parseFloat(user.q4_t) - 25));
  } else {
    predictedGenerationQ4 = parseFloat(user.q4_r);
  }

  // Calculate the production coefficients
  prod_coefficients.push(predictedGenerationQ1 / parseFloat(user.q1_w));
  prod_coefficients.push(predictedGenerationQ2 / parseFloat(user.q2_w));
  prod_coefficients.push(predictedGenerationQ3 / parseFloat(user.q3_w));
  prod_coefficients.push(predictedGenerationQ4 / parseFloat(user.q4_w));
  if (user.user_id) {
    await setDataOfUser(userId, { "production_coefficient": prod_coefficients });
    // await Api.setUserData(userId, { "production_coefficient": prod_coefficients });
  }
}

/**
 * Fetch the quarterly data and update the user data
 * @param user The user object
 * @param userId The user ID
 */
export async function fetchQuarterlyDataAndUpdateUserData(
  user: any,
  userId: string
): Promise<void> {
  const lambdaInvoker = new LambdaInvoker();
  let res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-mapping`,
    },
    DEFAULT_RETRIEVAL_LAMBDA
  );

  const quarterlySuburbData: quarterlySuburbConditions[] = (await res.json()).allSuburbs;
  // (2) Update User Fields
  for (let i = 0; i < quarterlySuburbData.length; i++) {
    let currentSuburb: quarterlySuburbConditions = quarterlySuburbData[i];

    if (currentSuburb.suburb === `${capitalise(user.suburb)}`) {
      for (let j = 0; j < 4; j++) {
        let setUserParam = {
          [`q${j + 1}_t`]: currentSuburb.temp_average[j],
          [`q${j + 1}_d`]: currentSuburb.daylight_average[j],
          [`q${j + 1}_r`]: currentSuburb.radiation_average[j],
        };
        await setDataOfUser(userId, setUserParam);
      }
    }
  }
}

/**
 * Retrieves hourly energy data of the week for a user.
 *
 * @param {any} user The user object.
 * @returns {Promise<hourlyEnergyDataObj>} A promise that resolves to the hourly energy data of the week.
 */
export async function getHourlyEnergyDataOfWeek(user: any): Promise<hourlyEnergyDataObj> {
  const lambdaInvoker = new LambdaInvoker();
  let res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-energy-data`,
      queryStringParameters: {
        userID: user.user_id,
      },
    },
    DEFAULT_RETRIEVAL_LAMBDA
  );
  return await res.json();
}

/**
 * Retrieves all data of a user.
 *
 * @param {any} userId The ID of the user.
 * @returns {Promise<fullUserObj>} A promise that resolves to the full user object.
 */
export async function getAllDataOfUser(userId: any): Promise<fullUserObj> {
  const lambdaInvoker = new LambdaInvoker();
  let res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/user-data/get-all`,
      body: JSON.stringify({ userID: userId }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );
  return (await res.json()).data;
}

/**
 * Sets data of a user.
 *
 * @param {any} userId The ID of the user.
 * @param {any} setFields The fields to set for the user.
 * @returns {Promise<any>} A promise that resolves when the operation is completed.
 */
export async function setDataOfUser(userId: any, setFields: any): Promise<any> {
  const lambdaInvoker = new LambdaInvoker();

  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "PATCH",
      path: `/${process.env.STAGING_ENV}/user-data/set`,
      body: JSON.stringify({
        userID: userId,
        info: setFields,
      }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  return await res.json();
}

/**
 * Generates a timestamp based on date and hour offsets.
 *
 * @param {number} dateOffset The offset in days from the current date.
 * @param {number} hourOffset The offset in hours from midnight.
 * @returns {Promise<string>} A promise that resolves to the generated timestamp.
 */
export async function generateTimeStamp(dateOffset: number, hourOffset: number): Promise<string> {
  // Convert Current Date to AEST
  let currentDate = new Date();
  currentDate.setUTCHours(currentDate.getUTCHours() + 10);
  currentDate.setUTCHours(0, 0, 0, 0);

  // Add dateOffset
  currentDate.setDate(currentDate.getDate() + dateOffset);

  // Add hourOffset (from midnight)
  currentDate.setUTCHours(currentDate.getUTCHours() + hourOffset);

  // Convert Date to String
  let dateStr = currentDate.toISOString();
  let timestamp = dateStr.replace(/\..*/, "+10:00");
  return timestamp;
}

/**
 * Capitalises a suburb name as a proper noun. For example surry hills -> Surry Hills
 * @param suburb the suburb to capitalise
 * @returns the suburb with capitalised letters per word
 */
export function capitalise(suburb: string): string {
  const words: string[] = suburb.split(" ");
  const capitalisedWords = words.map((word) => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  });
  return capitalisedWords.join(" ");
}

/**
 * Finds the suburb name based on an array of terms.
 *
 * @param {any[]} terms An array of terms.
 * @returns {string} The suburb name.
 */
export const findSuburbName = (terms: any[]) => {
  // look for the object with NSW in terms, then suburb is the previous object
  const suburb = terms.find((term) => term.value === "NSW");
  return terms[terms.indexOf(suburb) - 1].value;
};
