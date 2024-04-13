import { AutocompletionRequest } from "@interfaces/index";

export const RequestBuilder = (
  autocompletionRequest: AutocompletionRequest,
  input: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken
): google.maps.places.AutocompletionRequest => {
  const { bounds, location, ...rest } = autocompletionRequest;

  const res: google.maps.places.AutocompletionRequest = {
    input,
    ...rest,
    componentRestrictions: { country: "au" },
  };

  if (sessionToken) {
    res.sessionToken = sessionToken;
  }

  if (bounds) {
    res.bounds = new google.maps.LatLngBounds(...bounds);
  }

  if (location) {
    res.location = new google.maps.LatLng(location);
  }

  return res;
};
