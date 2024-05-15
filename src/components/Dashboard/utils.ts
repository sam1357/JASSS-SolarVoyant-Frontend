import { CUR_TIMEZONE } from "@src/constants";
import { toZonedTime } from "date-fns-tz";

/**
 * This file contains utility functions that are used in the Dashboard component
 * @param index The index of the day of the week
 * @returns The day of the week
 */
export function getDayOfWeek(index: number) {
  if (index === 0) {
    return "Today";
  }
  const today: Date = new Date();
  today.setDate(today.getDate() + index);
  const dayOfWeek: number = today.getDay();
  const days: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
}

/**
 * This function returns the current hour of the day
 * @returns The current hour of the day
 */
export function getCurrentHour() {
  const now: Date = toZonedTime(new Date(), CUR_TIMEZONE);
  const hour: number = now.getHours();
  return hour;
}

/**
 * This function returns the current day of the week
 * @returns The current day of the week
 */
export function getFormattedDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  return `${day} ${month}, ${year}`;
}

/**
 * This function returns the short date of the day
 * @param index The index of the day of the week
 * @returns The short date of the day
 */
export function getShortDate(index: number): string {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + index);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  return `${day}/${formattedMonth}`;
}

/**
 * This function returns the time of the hour
 * @param index The index of the hour
 * @returns The time of the hour
 */
export function getTime(index: number): string {
  const formattedHour = index < 10 ? `0${index}` : index;
  return `${formattedHour}:00`;
}

/**
 * This function returns the name of the attribute
 * @param attribute The attribute to get the name of
 * @returns The name of the attribute
 */
export function getAttributeName(attribute: string) {
  switch (attribute) {
    case "shortwave_radiation":
      return "Solar Irradiance";
    case "temperature_2m":
      return "Temperature";
    case "daylight_hours":
      return "Daylight Hours";
    case "sunshine_hours":
      return "Sunshine Hours";
    case "cloud_cover":
      return "Cloud Cover";
    case "sunshine_duration":
    case "sunshine_hours":
      return "Sunshine Duration";
    default:
      return "Generation VS Consumption";
  }
}

/**
 * This function returns the name of the attribute
 * @param aggregate A string of comma separated attributes
 * @returns An array of attributes
 */
export function parseAttributesArray(aggregate: string): string[] {
  // potentially add validity checking later
  return aggregate.split(",").map((value) => value.trim());
}
