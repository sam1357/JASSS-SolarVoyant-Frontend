import { addDays, capitalizeFirstLetter, formatDate, getChoroplethCondition } from "./utils";
import LambdaInvoker from "./lambdaInvoker";
import {
  DEFAULT_USER_DATA_LAMBDA,
  SECONDS_IN_HOUR,
  DEFAULT_RETRIEVAL_LAMBDA,
  DEFAULT_ANALYTICS_LAMBDA,
} from "@src/constants";
import {
  Attributes,
  ChoroplethConditionData,
  retrieveReturnObject,
  SuburbData,
  Event,
  WmoData,
  currentWeatherData,
  AnalyseReturnObject,
  AverageConditions,
  MeanData,
  AverageDailyInWeekWeatherData,
  ModeWeatherCode,
  MeanAttributes,
  WeekWeatherCodes,
  Units,
  Conditions,
} from "@src/interfaces";
import { ErrorWithStatus } from "./ErroWithStatus";
import { getCurrentHour } from "@components/Dashboard/utils";

export class Api {
  /**
   * Handles an OAuth operation for a user
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async handleOauth(email: string, provider: string, username: string): Promise<Response> {
    const lambdaInvoker = new LambdaInvoker();
    const res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "POST",
        path: `/${process.env.STAGING_ENV}/user-data/handle-oauth`,
        body: JSON.stringify({
          email: email,
          provider: capitalizeFirstLetter(provider),
          username: username,
        }),
      },
      DEFAULT_USER_DATA_LAMBDA
    );
    return res;
  }

  /**
   * Gets the ID of a user
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async getId(email: string, provider: string, username: string): Promise<Response> {
    const res = await Api.handleOauth(email, provider, username);
    return (await res.json()).id;
  }

  /**
   * Registers a user
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async register(username: string, email: string, password: string): Promise<Response> {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    return res;
  }

  /**
   * Gets choropleth data for the heatmap
   * @param condition The condition to fetch data for
   * @returns {Promise<Record<string, number>>} - The choropleth data
   */
  static async getChoroplethData(condition: string): Promise<Record<string, number>> {
    const res = await fetch("/api/choropleth/fetch-heatmap-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condition }),
    });

    if (res.status !== 200) {
      return {};
    }

    const data = await res.json();

    const finalRes: Record<string, number> = {};
    const convertToHours = condition === "sunshine_duration" ? SECONDS_IN_HOUR : 1;

    for (const suburb of data) {
      finalRes[suburb.placeId] = suburb.data / convertToHours;
    }

    const values = Object.values(finalRes);
    const mean = values.reduce((acc: number, curr: number) => acc + curr, 0) / values.length;

    return { ...finalRes, mean };
  }

  /**
   * Fetches historical detailed data for a given search term and condition
   * @param search The suburb or address to fetch data for
   * @param condition The condition to fetch data for
   * @returns {Promise<SuburbData[]>} - The historical data
   */
  static async getHistoricalDetailedData(search: string, condition: string): Promise<SuburbData[]> {
    // if search seems like an address, make a body use address otherwise use suburb
    if (!search) return [];
    const body = search.includes(",") ? { address: search } : { suburb: search };

    const res = await fetch("/api/choropleth/fetch-historical-detailed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, condition }),
    });

    const data = await res.json();
    if (res.status !== 200) {
      return [];
    }

    const { label, unit } = getChoroplethCondition(condition) as ChoroplethConditionData;
    const key = `${label} ${unit}`;

    const finalRes: SuburbData[] = data.events.map((d: any) => ({
      "date": formatDate(d.time_object.timestamp, "MMM d, yyyy"),
      [key]: Number(
        (
          (d.attributes[condition] as number) /
          (condition === "sunshine_duration" ? SECONDS_IN_HOUR : 1)
        ).toFixed(2)
      ), // convert to hours if sunshine duration
    }));

    return finalRes;
  }

  /**
   * Get lat long from an address
   * @param address The address to get lat long for
   * @returns {Promise<Record<string, number>} - The lat long
   */
  static async getLatLong(address: string): Promise<Record<string, number>> {
    const res = await fetch("/api/choropleth/fetch-lat-long", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    return await res.json();
  }

  /**
   * Gets current weather data for the stats card of the dashboard page
   * @returns {Promise<currentWeatherData>} - weather data for the next 7 days
   */
  static async getCurrentWeatherData(): Promise<currentWeatherData> {
    const lambdaInvoker = new LambdaInvoker();

    // (1) Call Database Retrieval
    let res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve`,
        queryStringParameters: {
          startDate: formatDate(addDays(new Date(), 0)),
          endDate: formatDate(addDays(new Date(), 0)),
          address: "21 Hinemoa Street",
          attributes:
            "temperature_2m, shortwave_radiation, weather_code, daylight_duration, sunshine_duration, cloud_cover",
        },
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );
    const weatherData: retrieveReturnObject = await res.json();

    let events: Event[] = weatherData.events;
    let currentHourAttributes: Attributes | null = null;
    let currentDayAttributes: Attributes | null = null;

    const currentHour = getCurrentHour();

    // (2) Get Current Attributes (Hourly and Daily)
    for (let i = 0; i < events.length; i++) {
      // Get Event date (already in AEST) and Event Hour
      let eventHour: number = new Date(events[i].time_object.timestamp).getHours();

      //// (a) Get Hourly Attributes for the current hour
      if (eventHour === currentHour && events[i].event_type === "hourly") {
        currentHourAttributes = events[i].attributes;
      }

      //// (b) Get Daily Attributes for the current day
      if (events[i].event_type === "daily") {
        currentDayAttributes = events[i].attributes;
      }
    }

    // In case the hourly event is missing, pick the hour before
    if (currentHourAttributes === null) {
      currentHourAttributes = events[currentHour - 2].attributes;
    }

    // Throw error if either attributes are still null
    if (currentHourAttributes === null || currentDayAttributes === null) {
      throw new ErrorWithStatus((await res.json()).message, 500);
    }

    // (3) Get weather images and descriptions for the acquired weather codes
    res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-wmo`,
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );
    const wmoData: WmoData[] = await res.json();
    const dayOrNight: "day" | "night" = currentHour < 5 || currentHour > 18 ? "night" : "day";

    // (4) Return data
    const result: currentWeatherData = {
      "suburb": currentHourAttributes.location.suburb,
      "units": currentHourAttributes.units,
      "weather_code": {
        "image": wmoData[currentHourAttributes.weather_code][dayOrNight].image,
        "description": wmoData[currentHourAttributes.weather_code][dayOrNight].description,
      },
      "current_conditions": {
        "temperature_2m": currentHourAttributes.temperature_2m,
        "daylight_hours": (currentDayAttributes.daylight_duration / (60 * 60)).toFixed(0),
        "sunshine_hours": (currentDayAttributes.sunshine_duration / (60 * 60)).toFixed(0),
        "solar_radiation": currentHourAttributes.shortwave_radiation,
        "cloud_cover": currentHourAttributes.cloud_cover,
      },
    };
    return result;
  }

  /**
   * Gets average weather conditions for every day in the next 7 days.
   * Useful for the Weekly Overview Graph in Overview Page and Gauge Cards in Forecast Page
   * @returns {Promise<AverageDailyInWeekWeatherData>} - weather data for the next 7 days
   */
  static async getDailyAverageConditionsOfWeekData(): Promise<AverageDailyInWeekWeatherData> {
    let avgDailyConditionsArray: Conditions[] = [];
    let units: Units | undefined = undefined;

    for (let i = 0; i < 7; i++) {
      // (1) Call Analyse to get Average Weather Conditions for One Day
      let res: AnalyseReturnObject = await Api.getAverageWeatherData(i, i);

      if (i === 0) {
        units = res.units;
      }

      // In case daily event is unavailable, pick the day before
      if (i === 6 && (res.analytics as MeanAttributes) === undefined) {
        let previous = avgDailyConditionsArray[5];
        avgDailyConditionsArray.push(previous);
        console.log("WARN: Last Daily Event is Missing!");
        break;
      }

      // In case units is still undefined
      if (units === undefined) {
        throw new ErrorWithStatus("Units field is missing", 500);
      }

      // (2) Add to avgDailyConditionsArray
      let dayData: Conditions = {
        temperature_2m: (res.analytics as MeanAttributes).temperature_2m.mean,
        daylight_hours: (res.analytics as MeanAttributes).daylight_hours.mean.toString(),
        sunshine_hours: (res.analytics as MeanAttributes).sunshine_hours.mean.toString(),
        solar_radiation: (res.analytics as MeanAttributes).solar_radiation.mean,
        cloud_cover: (res.analytics as MeanAttributes).cloud_cover.mean,
      };
      avgDailyConditionsArray.push(dayData);
    }

    // (3) Return result
    const result: AverageDailyInWeekWeatherData = {
      "units": units as Units,
      "0": avgDailyConditionsArray[0],
      "1": avgDailyConditionsArray[1],
      "2": avgDailyConditionsArray[2],
      "3": avgDailyConditionsArray[3],
      "4": avgDailyConditionsArray[4],
      "5": avgDailyConditionsArray[5],
      "6": avgDailyConditionsArray[6],
    };
    return result;
  }

  /**
   * Gets weather codes for every day in the next 7 days for card set of the forecast page
   * @returns {Promise<WeekWeatherCodes>} - weather data for the next 7 days
   */
  static async getWeekWeatherCodeData(): Promise<WeekWeatherCodes> {
    const lambdaInvoker = new LambdaInvoker();
    let weatherCodeArray: number[] = [];

    // (1) Get Current Weather Code
    //// (a) Call Retrieval for Today
    let res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve`,
        queryStringParameters: {
          startDate: formatDate(addDays(new Date(), 0)),
          endDate: formatDate(addDays(new Date(), 0)),
          address: "21 Hinemoa Street",
          attributes: "weather_code",
        },
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );
    const weatherData: retrieveReturnObject = await res.json();

    //// (b) Extract Current Weather Code
    let events: Event[] = weatherData.events;
    let currentWeatherCode: number = -1;
    const currentHour = getCurrentHour();

    for (let i = 0; i < events.length; i++) {
      let eventHour: number = new Date(events[i].time_object.timestamp).getHours();
      if (eventHour === currentHour && events[i].event_type === "hourly") {
        currentWeatherCode = events[i].attributes.weather_code;
        break;
      }
    }

    // In case daily event is unavailable, pick the day before
    if (currentWeatherCode === -1) {
      currentWeatherCode = events[currentHour - 2].attributes.weather_code;
    }

    //// (c) Add Current Weather Code to Array
    weatherCodeArray.push(currentWeatherCode);

    // (2) Get Mode Weather Code for the Following 6 Days
    for (let i = 1; i < 7; i++) {
      let res: AnalyseReturnObject = await Api.getModeWeatherCode(i, i);

      // In case the daily event is missing, pick the day before
      if (i === 6 && (res.analytics as ModeWeatherCode) === undefined) {
        let previous = weatherCodeArray[5];
        weatherCodeArray.push(previous);
        console.log("Last Daily Event is Missing!");
        break;
      }

      let weatherCode: number = (res.analytics as ModeWeatherCode).weather_code.mode[0];
      weatherCodeArray.push(weatherCode);
    }

    // (3) Get weather images and descriptions for the acquired weather codes
    res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-wmo`,
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );
    const wmoData: WmoData[] = await res.json();
    const dayOrNight: "day" | "night" = currentHour < 5 || currentHour > 18 ? "night" : "day";

    // (4) Return data
    const result: WeekWeatherCodes = {
      "0": {
        "image": wmoData[weatherCodeArray[0]][dayOrNight].image,
        "description": wmoData[weatherCodeArray[0]][dayOrNight].description,
      },
      "1": {
        "image": wmoData[weatherCodeArray[1]]["day"].image,
        "description": wmoData[weatherCodeArray[1]]["day"].description,
      },
      "2": {
        "image": wmoData[weatherCodeArray[2]]["day"].image,
        "description": wmoData[weatherCodeArray[2]]["day"].description,
      },
      "3": {
        "image": wmoData[weatherCodeArray[3]]["day"].image,
        "description": wmoData[weatherCodeArray[3]]["day"].description,
      },
      "4": {
        "image": wmoData[weatherCodeArray[4]]["day"].image,
        "description": wmoData[weatherCodeArray[4]]["day"].description,
      },
      "5": {
        "image": wmoData[weatherCodeArray[5]]["day"].image,
        "description": wmoData[weatherCodeArray[5]]["day"].description,
      },
      "6": {
        "image": wmoData[weatherCodeArray[6]]["day"].image,
        "description": wmoData[weatherCodeArray[6]]["day"].description,
      },
    };
    return result;
  }

  // HELPER FUNCTION for getDailyAverageConditionsOfWeekData
  static async getAverageWeatherData(
    start_day_offset: number,
    end_day_offset: number
  ): Promise<AnalyseReturnObject> {
    const lambdaInvoker = new LambdaInvoker();
    let res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "POST",
        path: `/${process.env.STAGING_ENV}/data-analytics/analyse-selective`,
        queryStringParameters: {
          startDate: formatDate(addDays(new Date(), start_day_offset)),
          endDate: formatDate(addDays(new Date(), end_day_offset)),
          address: "21 Hinemoa Street",
          attributes:
            "temperature_2m, shortwave_radiation, weather_code, daylight_duration, sunshine_duration, cloud_cover",
        },
        body: {
          query: {
            temperature_2m: "mean",
            shortwave_radiation: "mean",
            weather_code: "mean",
            daylight_duration: "mean",
            sunshine_duration: "mean",
            cloud_cover: "mean",
          },
        },
      },
      DEFAULT_ANALYTICS_LAMBDA
    );
    return await res.json();
  }

  // HELPER FUNCTION for getWeekWeatherCodeData
  static async getModeWeatherCode(
    start_day_offset: number,
    end_day_offset: number
  ): Promise<AnalyseReturnObject> {
    const lambdaInvoker = new LambdaInvoker();
    let res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "POST",
        path: `/${process.env.STAGING_ENV}/data-analytics/analyse-selective`,
        queryStringParameters: {
          startDate: formatDate(addDays(new Date(), start_day_offset)),
          endDate: formatDate(addDays(new Date(), end_day_offset)),
          address: "21 Hinemoa Street",
          attributes: "weather_code",
        },
        body: {
          query: {
            weather_code: "mode",
          },
        },
      },
      DEFAULT_ANALYTICS_LAMBDA
    );
    // console.log(await res.json());
    return await res.json();
  }
}
