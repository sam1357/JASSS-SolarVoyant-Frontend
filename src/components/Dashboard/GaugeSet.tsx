"use client";

import { Conditions, Units } from "@src/interfaces";
import GaugeCard from "@components/Dashboard/GaugeCard";
import { Stack } from "@chakra-ui/layout";

interface GaugeSetProps {
  data: Conditions & { units: Units };
}

const GaugeSet: React.FC<GaugeSetProps> = ({ data }) => {
  return (
      <Stack spacing={4}>
        <GaugeCard
          data={data}
          attribute="shortwave_radiation"
          inverse
          labels={{
            low: { limit: 90, label: "Poor" },
            medium: { label: "Moderate" },
            high: { limit: 170, label: "Excellent" },
            minimum: 0,
            maximum: 250,
          }}
        />
        <GaugeCard
          data={data}
          attribute="daylight_hours"
          inverse
          labels={{
            low: { limit: 10, label: "Poor" },
            medium: { label: "Moderate" },
            high: { limit: 13, label: "Excellent" },
            minimum: 5,
            maximum: 18,
          }}
        />
        <GaugeCard
          data={data}
          attribute="sunshine_hours"
          inverse
          labels={{
            low: { limit: 10, label: "Poor" },
            medium: { label: "Moderate" },
            high: { limit: 13, label: "Excellent" },
            minimum: 0,
            maximum: 18,
          }}
        />
        <GaugeCard
          data={data}
          attribute="cloud_cover"
          labels={{
            low: { limit: 40, label: "Excellent" },
            medium: { label: "Moderate" },
            high: { limit: 65, label: "Poor" },
            minimum: 0,
            maximum: 100,
          }}
        />
        <GaugeCard
          data={data}
          attribute="temperature_2m"
          labels={{
            low: { limit: 25, label: "Excellent" },
            medium: { label: "Moderate" },
            high: { limit: 35, label: "Poor" },
            minimum: 0,
            maximum: 45,
          }}
        />
      </Stack>
    
  );
};

export default GaugeSet;
