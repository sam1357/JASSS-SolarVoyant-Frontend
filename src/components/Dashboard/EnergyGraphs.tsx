import { CardBody } from "@chakra-ui/react";
import { AreaChart } from "@saas-ui/charts";

interface EnergyGraphProps {
  data: { date: string; production: number; consumption: number }[];
}

const EnergyGraph: React.FC<EnergyGraphProps> = ({ data }) => {
  return (
    <>
      <CardBody>
        <AreaChart
          data={data}
          yAxisWidth={80}
          height="300px"
          categories={["production", "consumption"]}
          colors={["blue", "orange"]}
          stack
        />
      </CardBody>
    </>
  );
};

export default EnergyGraph;
