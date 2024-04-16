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
  RetrieveReturnObject,
  SuburbData,
  Event,
  WmoData,
  currentWeatherData,
  AnalyseReturnObject,
  AverageDailyInWeekWeatherData,
  ModeWeatherCode,
  MeanAttributes,
  WeekWeatherCodes,
  Units,
  Conditions,
  DayConditions,
  NextWeekHourlyData,
  GraphHourlyConditions,
  InsightHourlyConditions,
} from "@src/interfaces";
import { ErrorWithStatus } from "./ErroWithStatus";
import { getCurrentHour } from "@components/Dashboard/utils";
import { apiBaseUrl } from "next-auth/client/_utils";

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
    // (1) Call Database Retrieval
    let weatherData: RetrieveReturnObject = await Api.retrieveWeatherData(
      0,
      0,
      "temperature_2m, shortwave_radiation, weather_code, daylight_duration, sunshine_duration, cloud_cover"
    );
    // console.log(weatherData);

    let events: Event[] = weatherData.events;
    let currentHourAttributes: Attributes | null = null;
    let currentDayAttributes: Attributes | null = null;

    const currentHour = getCurrentHour();

    // (2) Get Current Attributes (Hourly and Daily)
    // for (let i = 0; i < events.length; i++) {
    //   // Get Event date (already in AEST) and Event Hour
    //   let eventHour: number = new Date(events[i].time_object.timestamp).getHours();

    //   //// (a) Get Hourly Attributes for the current hour
    //   if (eventHour === currentHour && events[i].event_type === "hourly") {
    //     currentHourAttributes = events[i].attributes;
    //   }

    //   //// (b) Get Daily Attributes for the current day
    //   if (events[i].event_type === "daily") {
    //     currentDayAttributes = events[i].attributes;
    //   }
    // }

    // // In case the hourly event is missing, pick the hour before
    // if (currentHourAttributes === null) {
    //   console.log(`WARN: Current Hour Data is Missing!`);
    //   currentHourAttributes = events[currentHour - 2].attributes;
    // }

    /*// Throw error if either attributes are still null
    if (currentHourAttributes === null || currentDayAttributes === null) {
      throw new ErrorWithStatus("(await res.json()).message", 500);
    }*/

    //// (a) Get Hourly Attributes for the current hour
    if (events[currentHour] !== undefined) {
      currentHourAttributes = events[currentHour].attributes;
    } else {
      console.log(`WARN from getCurrentWeatherData: Current Hour Data is Missing!`);
      currentHourAttributes = events[currentHour - 1].attributes;
    }

    //// (b) Get Daily Attributes for the current day
    currentDayAttributes = events[events.length - 1].attributes;

    // (3) Get weather images and descriptions for the acquired weather codes
    const wmoData: WmoData[] = await Api.retrieveWmoData();
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
        "daylight_hours": (
          (currentDayAttributes as Attributes).daylight_duration /
          (60 * 60)
        ).toFixed(0),
        "sunshine_hours": (
          (currentDayAttributes as Attributes).sunshine_duration /
          (60 * 60)
        ).toFixed(0),
        "shortwave_radiation": currentHourAttributes.shortwave_radiation,
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
  static async getDailyAverageConditionsDataOfWeek(): Promise<AverageDailyInWeekWeatherData> {
    let avgDailyConditionsArray: Conditions[] = [];
    let units: Units | undefined = undefined;

    for (let i = 0; i < 7; i++) {
      // (1) Call Analyse to get Average Weather Conditions for One Day
      let res: AnalyseReturnObject = await Api.getAverageWeatherData(i, i);

      // console.log(res);

      if (i === 0) {
        units = res.units;
      }

      // In case daily event is unavailable, pick the day before
      if ((res.analytics as MeanAttributes) === undefined) {
        let previous = avgDailyConditionsArray[i - 1];
        avgDailyConditionsArray.push(previous);
        console.log(`WARN from getDailyAverageConditionsDataOfWeek: Day Event ${i} is Missing!`);
        continue;
      }

      // In case units are still undefined
      if (units === undefined) {
        throw new ErrorWithStatus("Units field is missing", 500);
      }

      // (2) Add to avgDailyConditionsArray
      let dayData: Conditions = {
        temperature_2m: (res.analytics as MeanAttributes).temperature_2m.mean,
        daylight_hours: (res.analytics as MeanAttributes).daylight_duration.mean.toString(),
        sunshine_hours: (res.analytics as MeanAttributes).sunshine_duration.mean.toString(),
        shortwave_radiation: (res.analytics as MeanAttributes).shortwave_radiation.mean,
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
  static async getWeatherCodeDataOfWeek(): Promise<WeekWeatherCodes> {
    let weatherCodeArray: number[] = [];

    // (1) Get Current Weather Code
    //// (a) Call Retrieval for Today
    const weatherData: RetrieveReturnObject = await Api.retrieveWeatherData(0, 0, "weather_code");
    // console.log(weatherData);

    //// (b) Extract Current Weather Code
    let events: Event[] = weatherData.events;
    let currentWeatherCode: number = -1;
    const currentHour = getCurrentHour();

    // for (let i = 0; i < events.length; i++) {
    //   let eventHour: number = new Date(events[i].time_object.timestamp).getHours();
    //   if (eventHour === currentHour && events[i].event_type === "hourly") {
    //     currentWeatherCode = events[i].attributes.weather_code;
    //     break;
    //   }
    // }
    // // In case daily event is unavailable, pick the day before
    // if (currentWeatherCode === -1) {
    //   console.log(`WARN: Current Hour Data is Missing!`);
    //   currentWeatherCode = events[currentHour - 2].attributes.weather_code;
    // }

    if (events[currentHour] !== undefined) {
      currentWeatherCode = events[currentHour].attributes.weather_code;
    } else {
      console.log(`WARN from getWeatherCodeDataOfWeek: Current Hour Data is Missing!`);
      currentWeatherCode = events[events.length - 1].attributes.weather_code;
    }

    //// (c) Add Current Weather Code to Array
    weatherCodeArray.push(currentWeatherCode);

    // (2) Get Mode Weather Code for the Following 6 Days
    for (let i = 1; i < 7; i++) {
      let res: AnalyseReturnObject = await Api.getModeWeatherCode(i, i);

      // In case the daily event is missing, pick the day before
      if ((res.analytics as ModeWeatherCode) === undefined) {
        let previous = weatherCodeArray[i - 1];
        weatherCodeArray.push(previous);
        console.log(`WARN from getWeatherCodeDataOfWeek: Day Event ${i} is Missing!`);
        continue;
      }

      let weatherCode: number = (res.analytics as ModeWeatherCode).weather_code.mode[0];
      weatherCodeArray.push(weatherCode);
    }

    // (3) Get weather images and descriptions for the acquired weather codes
    const wmoData: WmoData[] = await Api.retrieveWmoData();
    const dayOrNight: "day" | "night" = currentHour < 6 || currentHour > 18 ? "night" : "day";

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

  /**
   * Gets hourly weather conditions for every day in the next 7 days.
   * Useful for the day overview graph in Forecast page
   * @returns
   */
  static async getHourlyWeatherDataOfWeek(): Promise<NextWeekHourlyData> {
    let weekArr: DayConditions[] = [];
    let units: Units | undefined = undefined;
    for (let i = 0; i < 7; i++) {
      // (1) Retrieve Weather Conditions for each day in a week
      let dayArr: GraphHourlyConditions[] = [];
      let res: RetrieveReturnObject = await Api.retrieveWeatherData(i, i, "temperature_2m, shortwave_radiation, cloud_cover");
      let eventsArr: Event[] = res.events;

      for (let j = 0; j < eventsArr.length; j++) {
        
        // In case an hourly event is missing, pick the hour before
        if (eventsArr[j] === undefined) {
          let prevHourlyConditions: GraphHourlyConditions = dayArr[j - 1];
          dayArr.push(prevHourlyConditions);
          console.log(
            `WARN from getHourlyWeatherDataOfWeek: Hour Data ${j} of Day ${i} is Missing!`
          );
          continue;
        }

        // (2) Retrieve hourly condition for each hour in a day
        if (eventsArr[j].event_type === "hourly") {
          if (i === 0 && j === 0) {
            units = eventsArr[j].attributes.units;
          }
          // Get Hourly Conditions and Add them to Day Array
          let hourlyConditionsObj: GraphHourlyConditions = {
            temperature_2m: eventsArr[j].attributes.temperature_2m,
            solar_radiation: eventsArr[j].attributes.shortwave_radiation,
            cloud_cover: eventsArr[j].attributes.cloud_cover,
          };
          dayArr.push(hourlyConditionsObj);
        }
      }

      // Create Day Conditions Object from Day Arr
      let dayObj: DayConditions = {
        0: dayArr[0],
        1: dayArr[1],
        2: dayArr[2],
        3: dayArr[3],
        4: dayArr[4],
        5: dayArr[5],
        6: dayArr[6],
        7: dayArr[7],
        8: dayArr[8],
        9: dayArr[9],
        10: dayArr[10],
        11: dayArr[11],
        12: dayArr[12],
        13: dayArr[13],
        14: dayArr[14],
        15: dayArr[15],
        16: dayArr[16],
        17: dayArr[17],
        18: dayArr[18],
        19: dayArr[19],
        20: dayArr[20],
        21: dayArr[21],
        22: dayArr[22],
        23: dayArr[23],
      }

      // In case an daily event is missing, pick the day before
      if (dayObj[0] === undefined) {
        dayObj = weekArr[i - 1];
        console.log(`WARN from getHourlyWeatherDataOfWeek: Day Data ${i} is Missing!`);
      }
      // Add Day Conditions to Week Arr
      weekArr.push(dayObj);
    };

    if (weekArr.length !== 7) {
      throw new ErrorWithStatus("Week Array has the Incorrect Length", 500)
    };

    const result: NextWeekHourlyData = {
      units: units as Units,
      0: weekArr[0],
      1: weekArr[1],
      2: weekArr[2],
      3: weekArr[3],
      4: weekArr[4],
      5: weekArr[5],
      6: weekArr[6],
    };
    return result;
  }

  /**
   * Gets hourly weather conditions for precipitation_probability and weather codes
   * Useful for insights in Forecast Page and Overview Page
   */
  static async getInsightDataOfWeek(): Promise<NextWeekHourlyData> {
    let weekArr: DayConditions[] = [];
    let units: Units | undefined = undefined;
    for (let i = 0; i < 7; i++) {
      // (0) Get Weather Code Images and Description
      const wmoData: WmoData[] = await Api.retrieveWmoData();
      
      // (1) Retrieve Weather Conditions for each day in a week
      let dayArr: InsightHourlyConditions[] = [];
      let res: RetrieveReturnObject = await Api.retrieveWeatherData(i, i, "weather_code, precipitation_probability");
      let eventsArr: Event[] = res.events;
      
      for (let j = 0; j < eventsArr.length; j++) {
        
        // In case an hourly event is missing, pick the hour before
        if (eventsArr[j] === undefined) {
          let prevHourlyConditions: InsightHourlyConditions = dayArr[j - 1];
          dayArr.push(prevHourlyConditions);
          console.log(
            `WARN from getInsightDataOfWeek: Hour Data ${j} of Day ${i} is Missing!`
          );
          continue;
        }
        
        // (2) Retrieve hourly condition for each hour in a day
        if (eventsArr[j].event_type === "hourly") {
          if (i === 0 && j === 0) {
            units = eventsArr[j].attributes.units;
          }
          
          // Get hour of the event
          let eventTimeStamp = res.events[j].time_object.timestamp;
          let charTIndex = eventTimeStamp.indexOf("T");
          let hourStr = eventTimeStamp.substring(charTIndex + 1, charTIndex + 3);
          let currentHour = parseInt(hourStr, 10);

          // Determine if current hour is day or night
          const dayOrNight: "day" | "night" = currentHour < 6 || currentHour > 18 ? "night" : "day";
          
          // Get Hourly Conditions and Add them to Day Array
          // console.log(currentHour)
          let hourlyConditionsObj: InsightHourlyConditions = {
            weather_code: {
              image: wmoData[eventsArr[j].attributes.weather_code][dayOrNight].image,
              description: wmoData[eventsArr[j].attributes.weather_code][dayOrNight].description,
            }, 
            precipitation_probability: eventsArr[j].attributes.precipitation_probability,
          };
          dayArr.push(hourlyConditionsObj);
        }
      }

      // Create Day Conditions Object from Day Arr
      let dayObj: DayConditions = {
        0: dayArr[0],
        1: dayArr[1],
        2: dayArr[2],
        3: dayArr[3],
        4: dayArr[4],
        5: dayArr[5],
        6: dayArr[6],
        7: dayArr[7],
        8: dayArr[8],
        9: dayArr[9],
        10: dayArr[10],
        11: dayArr[11],
        12: dayArr[12],
        13: dayArr[13],
        14: dayArr[14],
        15: dayArr[15],
        16: dayArr[16],
        17: dayArr[17],
        18: dayArr[18],
        19: dayArr[19],
        20: dayArr[20],
        21: dayArr[21],
        22: dayArr[22],
        23: dayArr[23],
      }

      // In case an daily event is missing, pick the day before
      if (dayObj[0] === undefined) {
        dayObj = weekArr[i - 1];
        console.log(`WARN from getInsightDataOfWeek: Day Data ${i} is Missing!`);
      }
      // Add Day Conditions to Week Arr
      weekArr.push(dayObj);
    };

    if (weekArr.length !== 7) {
      throw new ErrorWithStatus("Week Array has the Incorrect Length", 500)
    };

    const result: NextWeekHourlyData = {
      units: units as Units,
      0: weekArr[0],
      1: weekArr[1],
      2: weekArr[2],
      3: weekArr[3],
      4: weekArr[4],
      5: weekArr[5],
      6: weekArr[6],
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
            "temperature_2m, shortwave_radiation, weather_code, daylight_duration, sunshine_duration, cloud_cover, precipitation_probability",
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

  // HELPER FUNCTION for all Data Retrieval Calls (excl. weather codes)
  static async retrieveWeatherData(
    start_offset: number,
    end_offset: number,
    attributes: string
  ): Promise<RetrieveReturnObject> {
    const lambdaInvoker = new LambdaInvoker();
    let res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve`,
        queryStringParameters: {
          startDate: formatDate(addDays(new Date(), start_offset)),
          endDate: formatDate(addDays(new Date(), end_offset)),
          address: "21 Hinemoa Street",
          attributes: attributes,
        },
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );
    return await res.json();

    // const lambdaInvoker = new LambdaInvoker();
    // let res = await lambdaInvoker.invokeLambda(
    //   {
    //     httpMethod: "GET",
    //     path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve`,
    //     queryStringParameters: {
    //       startDate: formatDate(addDays(new Date(), day)),
    //       endDate: formatDate(addDays(new Date(), day)),
    //       address: "21 Hinemoa Street",
    //       attributes: "temperature_2m, shortwave_radiation, cloud_cover",
    //     },
    //   },
    //   DEFAULT_RETRIEVAL_LAMBDA
    // );
    // return await res.json();
  }

  // HELPER FUNCTION for all weather code data retrieval calls
  static async retrieveWmoData(): Promise<WmoData[]> {
    const lambdaInvoker = new LambdaInvoker();
    let res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-wmo`,
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );
    return await res.json();
  }

  // static getDayStr(offset: number): string {
  //   // Get Current UTC Date plus the offset number of days
  //   let currentDate = addDays(new Date(), offset);

  //   // Convert UTC Date to AEST
  //   currentDate.setUTCHours(currentDate.getUTCHours() + 10);

  //   // Convert Date to String
  //   let currentDateStr = currentDate.toISOString();
  //   return currentDateStr = currentDateStr.split("T")[0];
  // }
}
