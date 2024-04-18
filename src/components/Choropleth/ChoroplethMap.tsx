import React, { useCallback, useEffect, useState } from "react";
import { Box, Card, HStack, Slide, useColorMode, useDisclosure } from "@chakra-ui/react";
import { DEFAULT_MAP_ZOOM, SYDNEY_CENTER } from "@src/constants";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Api } from "@utils/Api";
import { colors } from "@styles/colours";
import store, { setChoroplethMapping, setLastClickedFeature, setSuburbsData } from "@src/store";
import { State } from "@interfaces/state";
import { useSelector } from "react-redux";
import Autocomplete from "@components/Choropleth/Autocomplete";
import {
  ConditionsSelectorData,
  GooglePlacesAutocompleteOption,
  SuburbData,
} from "@src/interfaces";
import ResponsiveSolarInfoCard from "@components/Choropleth/SolarInfoCard";
import {
  fetchData,
  generateChoroplethColourValueMappings,
  getLatLngObject,
  getOptions,
} from "@components/Choropleth/utils";
import { getChoroplethCondition } from "@utils/utils";
import {
  CHOROPLETH_AVAILABLE_CONDITIONS,
  ConditionSelector,
} from "@components/Choropleth/ConditionSelector";

let featureLayer: google.maps.FeatureLayer;
let mapGlobal: google.maps.Map;
let globalStyles: Record<string, object> = {};

/**
 * Applies the style to the feature layer for full reloads. Stores the style in the store
 * @param featureStyleFunctionOptions the feature layer of maps
 * @returns the style of the feature layer
 */
function applyStyle(featureStyleFunctionOptions: any) {
  const placeFeature = featureStyleFunctionOptions.feature as google.maps.PlaceFeature;

  // separately initialising instead of destructuring to prevent duplication of objects
  const solarRadiation = store.getState().suburbsData[placeFeature.placeId] as any;
  const choroplethMapping = store.getState().choroplethMapping;

  let fillColor = colors.gray[500];
  for (const mapping of choroplethMapping) {
    if (solarRadiation < mapping.boundaryValue) {
      if (mapping.label.includes("%")) {
        fillColor = colors.choroplethInverse[mapping.colour]; // use inverse on % as lower is better
      } else {
        fillColor = colors.choropleth[mapping.colour];
      }
      break;
    }
  }

  const colourObj = {
    fillColor: fillColor,
    fillOpacity: 0.6,
    strokeColor: colors.gray[400],
    strokeWeight: 0.5,
  };

  globalStyles[placeFeature.placeId] = colourObj;
  return colourObj;
}

/**
 *  Applies the style to the feature layer for mouse events
 * @param featureStyleFunctionOptions  the feature layer of maps
 * @returns  the style of the feature layer
 */
function applyStyleMouseEvents(featureStyleFunctionOptions: any) {
  const placeFeature = featureStyleFunctionOptions.feature as google.maps.PlaceFeature;
  const lastClickedFeature = store.getState().lastClickedFeature;

  return {
    ...globalStyles[placeFeature.placeId],
    fillOpacity: lastClickedFeature.placeId === placeFeature.placeId ? 1 : 0.6,
  };
}

async function handleClick(e: any) {
  const place = await e.features[0].fetchPlace();
  store.dispatch(
    setLastClickedFeature({
      displayName: place.displayName,
      placeId: e.features[0].placeId,
      latLng: getLatLngObject(e.latLng),
    })
  );

  featureLayer.style = applyStyleMouseEvents;
}

const createChoroplethMapComponent = (isLightMode: boolean) => {
  // use a memoized component to prevent re-renders
  return React.memo(function ChoroplethMap({
    setMainLoading,
  }: {
    // eslint-disable-next-line
    setMainLoading: (loading: boolean) => void;
  }) {
    const [infoWindowContent, setInfoWindowContent] = useState<string>("");
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [data, setData] = useState<SuburbData[]>([]);
    const [isLoading, setLoading] = useState(false);
    const { colorMode } = useColorMode();
    const [selectedPlace, setSelectedPlace] = useState<GooglePlacesAutocompleteOption>();
    const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);
    const [showMarker, setShowMarker] = useState(false);
    const [average, setAverage] = useState<number>(0);
    const [suburbToSearch, setSuburbToSearch] = useState("");
    const [condition, setCondition] = useState<string>("shortwave_radiation");
    const lastClickedFeature = useSelector((state: State) => state.lastClickedFeature);
    const [firstLoad, setFirstLoad] = useState(true);

    // if a suburb is clicked or a new address has been searched, show the marker and pan to it
    useEffect(() => {
      if (mapGlobal && Object.keys(lastClickedFeature).length > 0) {
        setShowMarker(true);
        mapGlobal.panTo(lastClickedFeature.latLng as google.maps.LatLngLiteral);
        setZoom(14);
      }
      // eslint-disable-next-line
    }, [data]);

    useEffect(() => {
      if (firstLoad) return; // prevent fetching data on first load as it's already fetched elsewhere
      setLoading(true);
      updateSolarCard();
      refetchFullData();
      // eslint-disable-next-line
    }, [condition]);

    // close the solar info card on a colour mode change
    useEffect(() => {
      onClose();
    }, [colorMode, onClose]);

    useEffect(() => {
      const fetchDataAndSetContent = async () => {
        if (Object.keys(lastClickedFeature).length > 0 || selectedPlace) {
          setZoom(12);
          setLoading(true);
          onOpen();

          // if selectedPlace (i.e. searched address) is present, use that instead
          const suburbToSearchLocal = selectedPlace
            ? selectedPlace.value.description
            : (lastClickedFeature.displayName as string);
          setSuburbToSearch(suburbToSearchLocal);

          // set title of popup window
          setInfoWindowContent(suburbToSearchLocal);

          if (selectedPlace) {
            // grab the latitude and longitude of the given address
            const res = await Api.getLatLong(selectedPlace.value.description);

            // set the last clicked feature to the selected place, mainly needed for latlng
            store.dispatch(
              setLastClickedFeature({
                latLng: { lat: res.lat, lng: res.lng },
                displayName: suburbToSearchLocal,
              })
            );
            setSelectedPlace(undefined);
          }
        }
      };
      fetchDataAndSetContent();
      // eslint-disable-next-line
    }, [lastClickedFeature, selectedPlace]);

    useEffect(() => {
      if (suburbToSearch && infoWindowContent && !firstLoad) {
        updateSolarCard();
      }
      // eslint-disable-next-line
    }, [suburbToSearch, infoWindowContent]);

    const updateSolarCard = async () => {
      setData(await Api.getHistoricalDetailedData(suburbToSearch, condition));
      setLoading(false);
    };

    // refetch the full data when the condition changes, and clear all existing selections etc.
    const refetchFullData = async () => {
      setMainLoading(true);
      store.dispatch(setLastClickedFeature({}));
      onClose();

      const suburbsData = await fetchData(condition);
      const { unit } = getChoroplethCondition(condition) as ConditionsSelectorData;

      store.dispatch(setSuburbsData(suburbsData));
      setAverage(suburbsData["mean"]);

      store.dispatch(
        setChoroplethMapping(
          generateChoroplethColourValueMappings(Object.values(suburbsData), unit)
        )
      );
      if (featureLayer) {
        featureLayer.style = applyStyle;
      }
      setMainLoading(false);
    };

    // when the map is loaded, set up the feature layer and add event listeners
    const onLoad = useCallback(async function callback(map: any) {
      setFirstLoad(true);
      mapGlobal = map;
      const existingData = store.getState().suburbsData;
      let suburbsData: Record<string, number> = {};
      const { unit } = getChoroplethCondition(condition) as ConditionsSelectorData;

      // use cached data if it exists
      if (Object.keys(existingData).length === 0) {
        suburbsData = await fetchData(condition);
        store.dispatch(setSuburbsData(suburbsData));
      } else {
        suburbsData = existingData;
      }

      setAverage(suburbsData["mean"]);
      store.dispatch(
        setChoroplethMapping(
          generateChoroplethColourValueMappings(Object.values(suburbsData), unit)
        )
      );

      // event listeners to handle mouse events
      featureLayer = map.getFeatureLayer(google.maps.FeatureType.LOCALITY);
      featureLayer.addListener("click", handleClick);

      featureLayer.style = applyStyle;
      setFirstLoad(false);
      // eslint-disable-next-line
    }, []);

    return (
      <>
        <GoogleMap
          center={SYDNEY_CENTER}
          options={getOptions(isLightMode, zoom)}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={onLoad}
        >
          {/* search bar and marker */}
          <Box width={{ base: "100%", lg: "50%" }} position="absolute">
            <HStack margin={6}>
              <Card
                opacity={0.95}
                borderRadius="md"
                backgroundColor={colorMode === "light" ? "white" : colors.gray[800]}
                width="70%"
              >
                <Autocomplete
                  onSelect={(place: any) => setSelectedPlace(place)}
                  onClose={onClose}
                />
              </Card>
              <Card
                opacity={0.95}
                borderRadius="md"
                backgroundColor={colorMode === "light" ? "white" : colors.gray[800]}
                width="30%"
              >
                <ConditionSelector
                  selectedCondition={condition}
                  setSelectedCondition={setCondition}
                  onClose={onClose}
                  schema={CHOROPLETH_AVAILABLE_CONDITIONS}
                />
              </Card>
            </HStack>
            {showMarker && (
              <Marker position={lastClickedFeature.latLng as google.maps.LatLngLiteral} />
            )}
          </Box>
        </GoogleMap>
        <Slide in={isOpen} style={{ zIndex: 10, height: "1px" }}>
          <ResponsiveSolarInfoCard
            {...{
              infoWindowContent,
              isLoading,
              onClose,
              setShowMarker,
              data,
              condition,
              sydneyAverage: average,
            }}
          />
        </Slide>
      </>
    );
  });
};

// create the light and dark mode components
// the map id changes depending on the color mode
const ChoroplethMapLight = createChoroplethMapComponent(true);
const ChoroplethMapDark = createChoroplethMapComponent(false);

export { ChoroplethMapLight, ChoroplethMapDark };
