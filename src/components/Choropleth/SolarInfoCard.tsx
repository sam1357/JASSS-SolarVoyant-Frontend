import React from "react";
import {
  Card,
  CardHeader,
  IconButton,
  Center,
  Heading,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Show,
  Tooltip,
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import store, { setLastClickedFeature } from "@src/store";
import { LoadingSpinner } from "@saas-ui/react";
import { AreaChart } from "@saas-ui/charts";
import { NAVBAR_HEIGHT } from "@src/constants";
import { ConditionsSelectorData, SuburbData } from "@src/interfaces";
import { getChoroplethCondition } from "@src/utils/utils";

interface SolarInfoCardProps {
  infoWindowContent: string;
  isLoading: boolean;
  onClose: () => void;
  // eslint-disable-next-line
  setShowMarker: (value: boolean) => void;
  data: SuburbData[];
  sydneyAverage: number;
  condition: string;
}

const SolarInfoCard: React.FC<SolarInfoCardProps> = ({
  infoWindowContent,
  isLoading,
  onClose,
  setShowMarker,
  data,
  sydneyAverage,
  condition,
}) => {
  const { label, unit } = getChoroplethCondition(condition) as ConditionsSelectorData;
  const key = `${label} ${unit}`;

  // Calculate average for the suburb
  const suburbAverage =
    data.reduce((accumulator, currentValue) => accumulator + (currentValue[key] as number), 0) /
    data.length;

  let percentageDifference: number;
  // if percentage already, just subtract
  if (unit === "%") {
    percentageDifference = suburbAverage - sydneyAverage;
  } else {
    percentageDifference = ((suburbAverage - sydneyAverage) / sydneyAverage) * 100;
  }

  return (
    <Card p={4} variant="solid" opacity={0.95}>
      <CardHeader py="6">
        <Heading as="h4" size="md" textAlign="center">
          {label} history for {infoWindowContent}
        </Heading>
        {data.length > 0 && (
          <Heading as="h6" size="xs" textAlign="center" fontWeight={400} pt={2}>
            {`${data[0]["date"]} - ${data[data.length - 1]["date"]}`}
          </Heading>
        )}
      </CardHeader>
      <IconButton
        position="absolute"
        top="10px"
        right="10px"
        icon={<AiOutlineClose />}
        aria-label="Close info window"
        onClick={() => {
          onClose();
          setShowMarker(false);
          store.dispatch(setLastClickedFeature({}));
        }}
        variant="ghost"
        size="sm"
      />
      {isLoading ? (
        <Center pb={4}>
          <LoadingSpinner />
        </Center>
      ) : data.length === 0 ? (
        <Center pb={4}>
          <Heading as="h4" fontWeight="300" color="gray" size="md">
            No data available
          </Heading>
        </Center>
      ) : (
        <Box padding={1}>
          <Stat marginLeft={4}>
            <StatLabel>Average</StatLabel>
            <StatNumber>
              {suburbAverage.toFixed(2)} {unit}
            </StatNumber>
            <Tooltip label={`Sydney Average: ${sydneyAverage.toFixed(2)} ${unit}`}>
              <StatHelpText>
                <StatArrow type={percentageDifference < 0 ? "decrease" : "increase"} />
                {Math.abs(percentageDifference).toFixed(2)}% from Sydney average
              </StatHelpText>
            </Tooltip>
          </Stat>

          <AreaChart data={data} height={{ base: "100px", md: "150px" }} categories={[key]} />
        </Box>
      )}
    </Card>
  );
};

const ResponsiveSolarInfoCard: React.FC<SolarInfoCardProps> = ({
  infoWindowContent,
  isLoading,
  onClose,
  setShowMarker,
  data,
  sydneyAverage,
  condition,
}) => {
  return (
    <>
      <Show below="lg">
        <Card
          left="50%"
          transform="translateX(-50%)"
          top={`calc(${NAVBAR_HEIGHT}px + 80px)`}
          maxWidth="90%"
          variant="solid"
          opacity={0.95}
        >
          <SolarInfoCard
            {...{
              infoWindowContent,
              isLoading,
              onClose,
              setShowMarker,
              data,
              sydneyAverage,
              condition,
            }}
          />
        </Card>
      </Show>
      <Show above="lg">
        <Card
          position="absolute"
          top={`calc(${NAVBAR_HEIGHT}px + 10px)`}
          right={2}
          m={4}
          maxWidth="400px"
          variant="solid"
          opacity={0.95}
        >
          <SolarInfoCard
            {...{
              infoWindowContent,
              isLoading,
              onClose,
              setShowMarker,
              data,
              sydneyAverage,
              condition,
            }}
          />
        </Card>
      </Show>
    </>
  );
};

export default ResponsiveSolarInfoCard;
