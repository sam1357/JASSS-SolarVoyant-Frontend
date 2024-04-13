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
  time: string;
  [key: string]: string | number | undefined;
}

export interface TimeObject {
  timestamp: string;
  timezone: string;
}

export interface JSONData {
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

export interface TodayData {
  suburb: string;
  units: Units;
  temperature_2m: number;
  daylight_hours: string;
  solar_radiation: number;
  weather_code: WeatherCode;
}

export interface DashboardData {
  0: TodayData;
  1: { weather_code: WeatherCode };
  2: { weather_code: WeatherCode };
  3: { weather_code: WeatherCode };
  4: { weather_code: WeatherCode };
  5: { weather_code: WeatherCode };
  6: { weather_code: WeatherCode };
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
