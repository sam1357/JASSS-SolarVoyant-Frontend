import { CardBody } from "@chakra-ui/react";
import { AreaChart } from "@saas-ui/charts";

interface EnergyGraphProps {
  data: { date: string; value: number }[];
}

const EnergyGraph: React.FC<EnergyGraphProps> = ({ data }) => {
  return (
    <>
      <CardBody>
        <AreaChart
          data={data}
          yAxisWidth={80}
          height="300px"
          categories={["generation", "consumption"]}
        />
      </CardBody>
    </>
  );
};

export default EnergyGraph;
