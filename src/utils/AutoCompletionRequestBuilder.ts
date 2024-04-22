import { AutocompletionRequest } from "@interfaces/index";

/**
 * Constructs an AutocompletionRequest object for Google Maps Places Autocomplete API.
 *
 * @param {AutocompletionRequest} autocompletionRequest The base AutocompletionRequest object.
 * @param {string} input The input string for autocompletion.
 * @param {google.maps.places.AutocompleteSessionToken} [sessionToken] Optional session token for autocomplete requests.
 * @returns {google.maps.places.AutocompletionRequest} An AutocompletionRequest object configured with the provided parameters.
 */
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
