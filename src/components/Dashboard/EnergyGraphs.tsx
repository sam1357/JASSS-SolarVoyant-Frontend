import { CardBody, Flex } from "@chakra-ui/react";
import { AreaChart } from "@saas-ui/charts";

interface EnergyGraphProps {
  data: { date: string; production: number; consumption: number }[];
}

const EnergyGraph: React.FC<EnergyGraphProps> = ({ data }) => {
  return (
    <>
      <CardBody>
        {/* <Flex justifyContent="center" alignItems="center" height="100%"> */}
          <AreaChart
            data={data}
            yAxisWidth={80}
            height="90%"
            categories={["production", "consumption"]}
            colors={["blue", "orange"]}
            stack
          />
        {/* </Flex> */}
      </CardBody>
    </>
  );
};

export default EnergyGraph;
