import { ChoroplethColourValueMapping, NextWeekHourlyData } from ".";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface LastClickedFeature {
  displayName?: string;
  placeId?: string;
  latLng?: LatLng;
}

export interface LastInteractedFeature {
  placeId?: string;
  latLng?: LatLng;
}

export interface State {
  lastClickedFeature: LastClickedFeature;
  suburbsData: { [key: string]: number };
  choroplethMapping: ChoroplethColourValueMapping[];
  insightData: NextWeekHourlyData | {};
}
