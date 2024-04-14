import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { AsyncSelect } from "chakra-react-select";
import { useDebouncedCallback } from "use-debounce";
import GooglePlacesAutocompleteProps, {
  AutocompletionRequest,
  GooglePlacesAutocompleteHandle,
  GooglePlacesAutocompleteOption,
} from "@interfaces/index";
import { RequestBuilder } from "@utils/AutoCompletionRequestBuilder";
import { Box, useBreakpointValue } from "@chakra-ui/react";

const GooglePlacesAutocomplete: React.ForwardRefRenderFunction<
  GooglePlacesAutocompleteHandle,
  GooglePlacesAutocompleteProps
> = (
  {
    autocompletionRequest = {},
    debounce = 300,
    minLengthAutocomplete = 0,
    withSessionToken = false,
    onSelect,
    onClose,
    width,
  }: GooglePlacesAutocompleteProps,
  ref
): React.ReactElement => {
  const [placesService, setPlacesService] = useState<
    google.maps.places.AutocompleteService | undefined
  >(undefined);
  const [sessionToken, setSessionToken] = useState<
    google.maps.places.AutocompleteSessionToken | undefined
  >(undefined);
  const fetchSuggestions = useDebouncedCallback(
    (
      value: string,
      // eslint-disable-next-line
      cb: (options: GooglePlacesAutocompleteOption[]) => void
    ): void => {
      if (!placesService) return cb([]);
      if (value.length < minLengthAutocomplete) return cb([]);

      const autocompletionReq: AutocompletionRequest = {
        ...autocompletionRequest,
      };

      placesService.getPlacePredictions(
        RequestBuilder(autocompletionReq, value, withSessionToken && sessionToken),
        (suggestions) => {
          cb(
            (suggestions || []).map((suggestion) => ({
              label: suggestion.description,
              value: suggestion,
            }))
          );
        }
      );
    },
    debounce
  );

  const initializeService = () => {
    if (!window.google)
      throw new Error("[react-google-places-autocomplete]: Google script not loaded");
    if (!window.google.maps)
      throw new Error("[react-google-places-autocomplete]: Google maps script not loaded");
    if (!window.google.maps.places)
      throw new Error("[react-google-places-autocomplete]: Google maps places script not loaded");

    setPlacesService(new window.google.maps.places.AutocompleteService());
    setSessionToken(new google.maps.places.AutocompleteSessionToken());
  };

  useImperativeHandle(
    ref,
    () => ({
      getSessionToken: () => {
        return sessionToken;
      },
      refreshSessionToken: () => {
        setSessionToken(new google.maps.places.AutocompleteSessionToken());
      },
    }),
    [sessionToken]
  );

  useEffect(() => {
    initializeService();
  }, []);

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchSelection, setSearchSelection] = useState<GooglePlacesAutocompleteOption | null>();

  const handleSearchInput = (e: any, { action }: { action: any }) => {
    if (["menu-close", "set-value"].includes(action) && e.length > 0) {
      setSearchValue(e);
    } else if (action === "input-change") {
      setSearchValue(e);
      if (e.length === 0) {
        setSearchSelection(null);
      }
    }
  };

  const handleSearchSelection = (value: any, { action }: { action: string }) => {
    if (action === "clear") {
      setSearchSelection(null);
      setSearchValue("");
      return;
    }

    onSelect(value);
    setSearchSelection(value);
    setSearchValue(value.label);
  };

  const breakpoint = useBreakpointValue({ base: "base", lg: "lg" }, { ssr: false });

  return (
    <Box width={width}>
      <AsyncSelect
        colorScheme="primary"
        name="autocomplete"
        placeholder="🔍 Search..."
        variant="filled"
        isClearable
        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
        closeMenuOnSelect={false}
        inputValue={searchValue}
        onInputChange={(e, action) => handleSearchInput(e, action)}
        loadOptions={fetchSuggestions}
        onFocus={() => {
          // if on mobile, close the solar info card when the user focuses on the search bar
          if (breakpoint === "base") {
            onClose();
          }
        }}
        value={searchSelection}
        onChange={(e, action) => handleSearchSelection(e as any, action)}
      />
    </Box>
  );
};

export default forwardRef(GooglePlacesAutocomplete);
