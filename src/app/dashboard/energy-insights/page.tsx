import React from "react";
import { EnergyInsightsClient } from "./page-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { Api } from "@src/utils/Api";

const EnergyInsights: React.FC = async () => {
  const session = await getServerSession(authOptions);
  const energyData = await Api.getEnergyDataOfWeek(session?.user?.id, "hour");

  const excessEnergy = [];

  for (let i = 0; i < (energyData.production as any).length; i++) {
    excessEnergy.push({
      date: (energyData.production as any)[i].timeStamp,
      excessEnergy:
        (energyData.production as any)[i].value - (energyData.consumption as any)[i].value,
    });
  }

  return <EnergyInsightsClient energyData={excessEnergy} />;
};

export default EnergyInsights;
