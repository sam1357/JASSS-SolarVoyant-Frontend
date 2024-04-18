import { CardBody } from "@chakra-ui/react";
import { AreaChart } from "@saas-ui/charts";

interface WeatherGraphProps {
  data: { date: string; value: number }[];
}

const WeatherGraph: React.FC<WeatherGraphProps> = ({ data }) => {
  return (
    <>
      <CardBody>
        <AreaChart
          showLegend={false}
          data={data}
          yAxisWidth={80}
          height="300px"
          categories={["value"]}
          colors={["blue"]}
        />
      </CardBody>
    </>
  );
};

export default WeatherGraph;
