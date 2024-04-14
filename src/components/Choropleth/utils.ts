import {
  DEFAULT_MAP_MIN_ZOOM,
  DEFAULT_MAP_MAX_ZOOM,
  GOOGLE_MAP_LIGHT_ID,
  GOOGLE_MAP_DARK_ID,
  SYDNEY_BOUNDS,
} from "@src/constants";
import { ChoroplethColourValueMapping, LatLng } from "@src/interfaces";
import { Api } from "@src/utils/Api";

/**
 * Fetches the data for the choropleth map
 * @param condition - The condition to fetch data for
 * @returns {Promise<any>} - The data for the choropleth map
 */
export const fetchData = async (condition: string) => {
  return await Api.getChoroplethData(condition);
};

/**
 * Returns the options for the choropleth map
 * @param isLight is light mode?
 * @param zoom zoom of map
 * @returns
 */
export const getOptions = (isLight: boolean, zoom: number) => {
  return {
    zoom,
    minZoom: DEFAULT_MAP_MIN_ZOOM,
    maxZoom: DEFAULT_MAP_MAX_ZOOM,
    mapId: isLight ? GOOGLE_MAP_LIGHT_ID : GOOGLE_MAP_DARK_ID,
    disableDefaultUI: true,
    clickableIcons: false,
    backgroundColor: "transparent",
    restriction: {
      latLngBounds: SYDNEY_BOUNDS,
      strictBounds: false,
    },
  };
};

/**
 * Converts the latitude and longitude of an object to a LatLng object, so it can be serialized
 * @param latLng - The latitude and longitude of the object
 * @returns {LatLng} - The latitude and longitude of the object, serialized
 */
export const getLatLngObject = (latLng: any): LatLng => {
  return { lat: latLng.lat(), lng: latLng.lng() };
};

/**
 * This function generates the colour value mappings for the choropleth map
 * It takes into account the middle 50% of the data, and divides it into 8 steps, to get a more
 * accurate representation of the data
 *
 * @param data The data to generate the colour value mappings for
 * @param unit The unit of the data
 * @returns The mapping
 */
export function generateChoroplethColourValueMappings(
  data: number[],
  unit: string
): ChoroplethColourValueMapping[] {
  // Sort the data in ascending order
  const sortedData = data.slice().sort((a, b) => a - b);

  // Calculate the index for the lower and upper quartiles, and determine middle 50%
  const lowerQuartileIndex = Math.floor(sortedData.length * 0.25);
  const upperQuartileIndex = Math.floor(sortedData.length * 0.75);
  const lowerBoundaryValue = sortedData[lowerQuartileIndex];
  const upperBoundaryValue = sortedData[upperQuartileIndex];

  // Create the value mappings
  const stepCount = 8; // Because we have 8 steps between 100 and 900
  const stepSize = (upperBoundaryValue - lowerBoundaryValue) / stepCount;
  const valueMappings: ChoroplethColourValueMapping[] = [];

  // Push the initial value mapping
  valueMappings.push({
    boundaryValue: lowerBoundaryValue,
    colour: "100",
    label: `${lowerBoundaryValue.toFixed(2)} ${unit}`,
  });

  // Calculate and insert intermediate value mappings
  for (let i = 1; i < stepCount; i++) {
    const boundaryValue = lowerBoundaryValue + stepSize * i;
    const colour = (100 * (i + 1)).toString(); // Increment colour value by 100 for each step
    const label = `${boundaryValue.toFixed(2)} ${unit}`;
    valueMappings.push({ boundaryValue, colour, label });
  }

  // Push the final value mapping, set to an arbitrary high value
  valueMappings.push({
    boundaryValue: 10000,
    colour: "900",
    label: `>${upperBoundaryValue.toFixed(2)} ${unit}`,
  });

  return valueMappings;
}
