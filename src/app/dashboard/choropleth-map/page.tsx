"use client";

import { Box, useColorMode } from "@chakra-ui/react";
import { LoadScriptNext } from "@react-google-maps/api";
import { ChoroplethMapLight, ChoroplethMapDark } from "@components/Choropleth/ChoroplethMap";
import HeatmapColourBar from "@components/Choropleth/HeatmapColourBar";
import ChoroplethLoadingUI from "@components/Choropleth/LoadingUI";
import { GOOGLE_MAP_LIGHT_ID, GOOGLE_MAP_DARK_ID } from "@src/constants";
import { State } from "@src/interfaces/state";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const libraries = ["places"];

export default function ChoroplethMapPage() {
  const { colorMode } = useColorMode();
  const [isLoading, setLoading] = useState(true);

  const suburbsData = useSelector((state: State) => state.suburbsData);

  useEffect(() => {
    if (Object.keys(suburbsData).length > 0 && isLoading) {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [suburbsData]);

  return (
    <>
      <Box display={isLoading ? "none" : "block"} height="100%">
        <LoadScriptNext
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
          libraries={libraries as any}
          mapIds={[GOOGLE_MAP_LIGHT_ID, GOOGLE_MAP_DARK_ID]}
        >
          {colorMode === "light" ? (
            <ChoroplethMapLight setMainLoading={setLoading} />
          ) : (
            <ChoroplethMapDark setMainLoading={setLoading} />
          )}
        </LoadScriptNext>
        {!isLoading && (
          <>
            <HeatmapColourBar position="fixed" bottom="5" left="50%" transform="translateX(-50%)" />
          </>
        )}
      </Box>
      {isLoading && <ChoroplethLoadingUI />}
    </>
  );
}
