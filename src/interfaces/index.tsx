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

export interface Attributes {
  location: Location;
  units: Units;
  weather_code: number;
  shortwave_radiation: number;
  temperature_2m: number;
  daylight_duration: number;
  sunshine_duration: number;
  cloud_cover: number;
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
  solar_radiation: number;
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
export interface NextWeekHourlyGraph {
  units: Units;
  0: DayConditions;
  1: DayConditions;
  2: DayConditions;
  3: DayConditions;
  4: DayConditions;
  5: DayConditions;
  6: DayConditions;
}

export interface DayConditions {
  0: HourlyConditions;
  1: HourlyConditions;
  2: HourlyConditions;
  3: HourlyConditions;
  4: HourlyConditions;
  5: HourlyConditions;
  6: HourlyConditions;
  7: HourlyConditions;
  8: HourlyConditions;
  9: HourlyConditions;
  10: HourlyConditions;
  11: HourlyConditions;
  12: HourlyConditions;
  13: HourlyConditions;
  14: HourlyConditions;
  15: HourlyConditions;
  16: HourlyConditions;
  17: HourlyConditions;
  18: HourlyConditions;
  19: HourlyConditions;
  20: HourlyConditions;
  21: HourlyConditions;
  22: HourlyConditions;
  23: HourlyConditions;
}
// Used for Day Overview Graph in Forecast Page
export interface HourlyConditions {
  temperature_2m: number;
  solar_radiation: number;
  cloud_cover: number;
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
  "temperature_2m": MeanData;
  "daylight_hours": MeanData;
  "sunshine_hours": MeanData;
  "solar_radiation": MeanData;
  "cloud_cover": MeanData;
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
