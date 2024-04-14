import { addDays, capitalizeFirstLetter, formatDate, getChoroplethCondition } from "./utils";
import LambdaInvoker from "./lambdaInvoker";
import {
  DEFAULT_USER_DATA_LAMBDA,
  SECONDS_IN_HOUR,
  DEFAULT_RETRIEVAL_LAMBDA,
} from "@src/constants";
import {
  Attributes,
  ChoroplethConditionData,
  JSONData,
  SuburbData,
  Event,
  DashboardData,
  WmoData,
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
   * Changes username
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async setUserData(
    userID: string,
    info: { [field: string]: string }
  ): Promise<Response> {
    const res = await fetch("/api/changeUserData", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: userID,
        info: info,
      }),
    });

    return res;
  }

  /**
   * Changes password
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<Response> {
    const res = await fetch("/api/changePassword", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    return res;
  }
  /**
   * Deletes user account
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async deleteUser(userID: string): Promise<Response> {
    const res = await fetch("/api/deleteUser", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: userID,
      }),
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
   * Gets weather data for dashboard purposes
   * @returns {Promise<DashboardData>} - weather data for the next 7 days
   */
  static async getWeatherData(): Promise<DashboardData> {
    const lambdaInvoker = new LambdaInvoker();

    // Step 1: Get all the required data for the current day
    let res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve`,
        queryStringParameters: {
          startDate: formatDate(addDays(new Date(), 0)),
          endDate: formatDate(addDays(new Date(), 0)),
          address: "21 Hinemoa Street",
          attributes: "temperature_2m, shortwave_radiation, weather_code, daylight_duration",
        },
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );

    const weatherData: JSONData = await res.json();
    let events: Event[] = weatherData.events;
    let currentAttributes: Attributes | null = null;
    let dailyAttributes: Attributes | null = null;

    // Pick out the hourly event for the current hour
    const currentHour = getCurrentHour();
    for (let i = 0; i < events.length; i++) {
      const eventHour: number = new Date(events[i].time_object.timestamp).getHours();
      if (eventHour === currentHour) {
        currentAttributes = events[i].attributes;
        break;
      }
    }

    // In case the hourly event is missing, pick the hour before
    if (currentAttributes === null) {
      currentAttributes = events[currentHour - 2].attributes;
    }
    for (let i = 0; i < events.length; i++) {
      if (events[i].event_type === "daily") {
        dailyAttributes = events[i].attributes;
      }
    }
    if (currentAttributes === null || dailyAttributes === null) {
      throw new ErrorWithStatus((await res.json()).message, 500);
    }
    let weatherCodeArray: number[] = [];
    weatherCodeArray.push(currentAttributes.weather_code);

    // Step 2: Get all the required data for the upcoming days
    res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve`,
        queryStringParameters: {
          startDate: formatDate(addDays(new Date(), 1)),
          endDate: formatDate(addDays(new Date(), 6)),
          address: "21 Hinemoa Street",
          attributes: "weather_code",
        },
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );
    const weatherCodes: JSONData = await res.json();
    events = weatherCodes.events;
    for (let i = 0; i < events.length; i++) {
      const eventHour: number = new Date(events[i].time_object.timestamp).getHours();
      if (eventHour === currentHour) {
        weatherCodeArray.push(events[i].attributes.weather_code);
      }
    }

    // Step 3: Get weather images and descriptions for the acquired weather codes
    res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "GET",
        path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-wmo`,
      },
      DEFAULT_RETRIEVAL_LAMBDA
    );

    const wmoData: WmoData[] = await res.json();
    const dayOrNight: "day" | "night" = currentHour < 5 || currentHour > 18 ? "night" : "day";

    const result: DashboardData = {
      0: {
        "suburb": currentAttributes.location.suburb,
        "units": currentAttributes.units,
        "temperature_2m": currentAttributes.temperature_2m,
        "daylight_hours": (dailyAttributes.daylight_duration / (60 * 60)).toFixed(0),
        "solar_radiation": currentAttributes.shortwave_radiation,
        "weather_code": {
          "image": wmoData[weatherCodeArray[0]][dayOrNight].image,
          "description": wmoData[weatherCodeArray[0]][dayOrNight].description,
        },
      },
      1: {
        "weather_code": {
          "image": wmoData[weatherCodeArray[1]][dayOrNight].image,
          "description": wmoData[weatherCodeArray[1]][dayOrNight].description,
        },
      },
      2: {
        "weather_code": {
          "image": wmoData[weatherCodeArray[2]][dayOrNight].image,
          "description": wmoData[weatherCodeArray[2]][dayOrNight].description,
        },
      },
      3: {
        "weather_code": {
          "image": wmoData[weatherCodeArray[3]][dayOrNight].image,
          "description": wmoData[weatherCodeArray[3]][dayOrNight].description,
        },
      },
      4: {
        "weather_code": {
          "image": wmoData[weatherCodeArray[4]][dayOrNight].image,
          "description": wmoData[weatherCodeArray[4]][dayOrNight].description,
        },
      },
      5: {
        "weather_code": {
          "image": wmoData[weatherCodeArray[5]][dayOrNight].image,
          "description": wmoData[weatherCodeArray[5]][dayOrNight].description,
        },
      },
      6: {
        "weather_code": {
          "image": wmoData[weatherCodeArray[6]][dayOrNight].image,
          "description": wmoData[weatherCodeArray[6]][dayOrNight].description,
        },
      },
    };
    return result;
  }
}
