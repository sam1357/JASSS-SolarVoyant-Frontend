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
