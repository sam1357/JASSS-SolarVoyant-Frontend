export type GooglePlacesAutocompleteOption = {
  label: string;
  value: google.maps.places.AutocompletePrediction;
};

export type GooglePlacesAutocompleteHandle = {
  getSessionToken: () => google.maps.places.AutocompleteSessionToken | undefined;
  refreshSessionToken: () => void;
};

export interface LatLng {
  lat: number;
  lng: number;
}

export interface AutocompletionRequest {
  bounds?: [LatLng, LatLng];
  componentRestrictions?: { country: string | string[] };
  location?: LatLng;
  offset?: number;
  radius?: number;
  types?: string[];
}

export default interface GooglePlacesAutocompleteProps {
  autocompletionRequest?: AutocompletionRequest;
  debounce?: number;
  minLengthAutocomplete?: number;
  withSessionToken?: boolean;
  // eslint-disable-next-line
  onSelect: (option: GooglePlacesAutocompleteOption) => void;
  onClose: () => void;
  width?: string;
}

export type Session =
  | {
      user?: User;
      accessToken?: string;
      expires?: string;
      error?: string;
    }
  | null
  | undefined;

export interface User {
  email?: string;
  name?: string;
  image?: string;
  id?: string;
}

export interface UserDataAuthResponse {
  id: string;
}

export type APIResponse = {
  status: number;
  json?: { error?: string };
};

export type SuburbData = {
  date: string;
  [key: string]: number | string;
};

export type ChoroplethConditionData = {
  label: string;
  unit: string;
  value: string;
  icon: JSX.Element;
};

export interface ChoroplethColourValueMapping {
  boundaryValue: number;
  colour: string;
  label: string;
}

// Input Data Format: ADAGE 3.0 model
export interface Location {
  suburb: string;
  latitude: number;
  longitude: number;
}

export interface Units {
  // time: string;
  [key: string]: string | number | undefined;
}

export interface TimeObject {
  timestamp: string;
  timezone: string;
}

export interface RetrieveReturnObject {
  data_source: string;
  dataset_type: string;
  dataset_id: string;
  time_object: TimeObject;
  events: Event[];
}

export interface EventTimeObject {
  timestamp: string;
  duration: number;
  duration_unit: string;
  timezone: string;
}

export interface Event {
  time_object: EventTimeObject;
  event_type: string;
  attributes: Attributes;
}

export interface Attributes { // Backend Return Object
  location: Location;
  units: Units;
  weather_code: number;
  shortwave_radiation: number;
  temperature_2m: number;
  daylight_duration: number;
  sunshine_duration: number;
  cloud_cover: number;
  precipitation_probability: number;
  [key: string]: Location | Units | number | undefined | string;
}

// Dashboard types
export interface WeatherCode {
  image: string;
  description: string;
}

export interface WmoData {
  day: WeatherCode;
  night: WeatherCode;
}

export interface Conditions {
  temperature_2m: number;
  daylight_hours: string;
  sunshine_hours: string;
  shortwave_radiation: number;
  cloud_cover: number;
}

// Used for the Weather Stats Card in Overview Page
export interface currentWeatherData {
  suburb: string;
  units: Units;
  weather_code: WeatherCode;
  current_conditions: Conditions;
}

// Used for Weekly Overview Graph Overview Page
export interface AverageDailyInWeekWeatherData {
  units: Units;
  0: Conditions;
  1: Conditions;
  2: Conditions;
  3: Conditions;
  4: Conditions;
  5: Conditions;
  6: Conditions;
}

// Used for the Weather Card Set in Forecast Page
export interface WeekWeatherCodes {
  0: WeatherCode;
  1: WeatherCode;
  2: WeatherCode;
  3: WeatherCode;
  4: WeatherCode;
  5: WeatherCode;
  6: WeatherCode;
}

// Used for Day Overview Graph in Forecast Page
export interface NextWeekHourlyData {
  units: Units;
  [index: number]: DayConditions;
}

export interface DayConditions extends Array<GraphHourlyConditions | InsightHourlyConditions> {}

// Used for Day Overview Graph in Forecast Page
export interface GraphHourlyConditions {
  temperature_2m: number;
  solar_radiation: number;
  cloud_cover: number;
}

export interface InsightHourlyConditions {
  weather_code: number;
  precipitation_probability: number;
}

// Return Objects for Analyse
export interface AnalyseReturnObject {
  "time_object": TimeObject,
  "location": Location,
  "units": Units,
  "analytics": MeanAttributes | ModeWeatherCode
}

// Return Objects for Analyse
export interface MeanAttributes {
  temperature_2m: MeanData;
  daylight_duration: MeanData;
  sunshine_duration: MeanData;
  shortwave_radiation: MeanData;
  cloud_cover: MeanData;
  precipitation_probability: MeanData;
}

// Return Objects for Analyse
export interface MeanData {
  "mean": number
}

// Return Objects for Analyse
export interface ModeWeatherCode {
  "weather_code": {
    "mode": number[]
  }
}

// Return Objects for S3 Bucket
export interface quarterlySuburbConditions {
  suburb: string,
  temp_average: string[],
  daylight_average: string[],
  radiation_average: string[],
}

// Return object of getEnergyDataOfWeek 
export interface energyDataObj {
  production: energyWithTimeStamp[] | energyWithTimeStamp,
  consumption: energyWithTimeStamp[] | energyWithTimeStamp,
  net: energyWithTimeStamp[] | energyWithTimeStamp,
}

export interface energyWithTimeStamp {
  value: number,
  timeStamp: string,
}
// Return object for getAllDataOfUser
export interface fullUserObj {
  surface_area: string,
  suburb: string,
  quarterly_energy_consumption: string,
  email: string,
  username: string,
  user_id: string,
  [field: string]: string | number | number;
}

// Return object for getHourlyEnergyDataOfWeek
export interface hourlyEnergyDataObj {
  energy_production_hourly: number[],
  energy_consumption_hourly: number[],
}

export interface GaugeLabels {
  low: {
    label: string;
    limit: number;
  };
  medium: {
    label: string;
  };
  high: {
    label: string;
    limit: number;
  };
  minimum: number;
  maximum: number;
}
