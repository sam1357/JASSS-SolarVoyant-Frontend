"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useColorMode } from "@chakra-ui/color-mode";
import { Box, Heading, HStack, SimpleGrid } from "@chakra-ui/layout";
import {
  Card,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  Text,
  StatNumber,
  Tooltip,
} from "@chakra-ui/react";
import { format } from "date-fns-tz";
import LoadingUI from "@src/components/LoadingUI";
import { Sparkline } from "@saas-ui/charts";
import { subDays } from "date-fns";
import { MdTrendingUp, MdTrendingDown, MdReportProblem } from "react-icons/md";

am4core.useTheme(am4themes_animated);

interface DataPoint {
  "Settlement Date": Date;
  "Spot Price ($/MWh)": number;
  "Scheduled Demand (MW)": number;
  "Type": string;
  "dash"?: string;
  "Predicted Excess Energy (MW)"?: number;
}

interface SummaryData {
  curPrice: string;
  curDemand: string;
  forPrice: string;
  forDemand: string;
}

interface ExcessEnergyData {
  date: string;
  excessEnergy: number;
}

const EXCESS_ENERGY_THRESHOLD = 1500;

export const EnergyInsightsClient: React.FC<{ energyData: ExcessEnergyData[] }> = ({
  energyData,
}) => {
  const chartRef = useRef<any>(null);
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [priceString, setPriceString] = useState<string>("");
  const [demandString, setDemandString] = useState<string>("");
  const [adviceString, setAdviceString] = useState<string>("");
  const [excessEnergyString, setExcessEnergyString] = useState<string>("");
  const [summaryData, setSummaryData] = useState<SummaryData>();
  const [insightCardColour, setInsightCardColour] = useState<string>("");

  const priceIcon = priceString.includes("up") ? MdTrendingUp : MdTrendingDown;
  const demandIcon = demandString.includes("up") ? MdTrendingUp : MdTrendingDown;
  const adviceIcon = MdReportProblem;

  const colourMode = useColorMode();

  const generateRandomDataForSparkline = (numDays = 30, strictlyIncreasing = false) => {
    const data = [];
    let lastValue = 0;

    for (let i = 0; i < numDays; i++) {
      const date = subDays(new Date(), numDays - i);
      let value;

      if (strictlyIncreasing) {
        // Ensure that each value is greater than the previous value
        value = lastValue + Math.random() * 10;
      } else {
        // Random value between 0 and 100
        value = Math.random() * 100;
      }

      value = parseFloat(value.toFixed(2));
      lastValue = value;

      data.push({
        date: format(date, "yyyy-MM-dd"),
        value,
      });
    }

    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/energy-prices/detailed");
      const data = await response.json();

      const filteredData = data.filter((item: any) => item.REGIONID === "NSW1");
      const processedData = filteredData.map((item: any) => ({
        "Settlement Date": new Date(item["SETTLEMENTDATE"]),
        "Spot Price ($/MWh)": item["RRP"],
        "Scheduled Demand (MW)": item["TOTALDEMAND"],
        "Type": item["PERIODTYPE"],
      }));

      const price = processedData[processedData.length - 1]["Spot Price ($/MWh)"];
      const demand = processedData[processedData.length - 1]["Scheduled Demand (MW)"];
      const priceStringTmp = price < 120 ? "low" : price > 180 ? "high" : "normal";
      const demandStringTmp = demand < 6000 ? "low" : demand > 7000 ? "high" : "normal";
      setPriceString(priceStringTmp);
      setDemandString(demandStringTmp);

      const excessEnergy = energyData.filter(
        (item) =>
          new Date(item.date).getTime() > new Date().getTime() &&
          item.excessEnergy > EXCESS_ENERGY_THRESHOLD
      );
      setExcessEnergyString(
        excessEnergy.length >= 2 ? "have excess energy" : "not have excess energy"
      );
      setData(processedData);

      if (priceStringTmp === "high" && excessEnergy.length >= 2) {
        setAdviceString("sell your energy to the grid to maximise your profits.");
        setInsightCardColour("green.400");
      } else if (priceStringTmp === "low" && excessEnergy.length >= 2) {
        setAdviceString("buy energy from the grid to maximise your savings.");
        setInsightCardColour("red.400");
      } else {
        setAdviceString("conserve energy to reduce your costs.");
        setInsightCardColour("orange.500");
      }

      const currentData = processedData.filter((item: any) => item.Type === "ACTUAL");
      const forecastData = processedData.filter((item: any) => item.Type === "FORECAST");
      setSummaryData({
        curPrice: currentData[currentData.length - 1]["Spot Price ($/MWh)"].toFixed(2),
        curDemand: currentData[currentData.length - 1]["Scheduled Demand (MW)"].toFixed(2),
        forPrice: forecastData[0]["Spot Price ($/MWh)"].toFixed(2),
        forDemand: forecastData[0]["Scheduled Demand (MW)"].toFixed(2),
      });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const createChart = (isDarkMode: boolean) => {
      let newChart = am4core.create(chartRef.current, am4charts.XYChart);
      newChart.paddingRight = 20;

      const processedData = data.map((item) => {
        const predicted = energyData.find(
          (pred) => new Date(pred.date).getTime() === item["Settlement Date"].getTime()
        );

        return {
          ...item,
          dash: item.Type === "FORECAST" ? "3,3" : "",
          "Predicted Excess Energy (MW)": predicted ? predicted.excessEnergy : null,
        };
      });
      newChart.data = processedData;

      // Create date axis
      let dateAxis = newChart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.labels.template.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");
      dateAxis.renderer.grid.template.stroke = am4core.color(isDarkMode ? "#ffffff" : "#000000");

      // Create value axis for Scheduled Demand
      let demandAxis = newChart.yAxes.push(new am4charts.ValueAxis());
      demandAxis.title.text = "Scheduled Demand (MW)";
      demandAxis.title.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");
      demandAxis.renderer.opposite = true;
      demandAxis.renderer.labels.template.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");
      demandAxis.renderer.grid.template.stroke = am4core.color(isDarkMode ? "#ffffff" : "#000000");

      // Create value axis for Spot Price
      let priceAxis = newChart.yAxes.push(new am4charts.ValueAxis());
      priceAxis.title.text = "Spot Price ($/MWh)";
      priceAxis.title.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");
      priceAxis.renderer.labels.template.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");
      priceAxis.renderer.grid.template.stroke = am4core.color(isDarkMode ? "#ffffff" : "#000000");

      let demandSeries = newChart.series.push(new am4charts.LineSeries());
      demandSeries.dataFields.dateX = "Settlement Date";
      demandSeries.dataFields.valueY = "Scheduled Demand (MW)";
      demandSeries.name = "Scheduled Demand (MW)";
      demandSeries.yAxis = demandAxis;
      demandSeries.strokeWidth = 4;
      demandSeries.stroke = am4core.color("#487fce");
      demandSeries.propertyFields.strokeDasharray = "dash";

      let gradient = new am4core.LinearGradient();
      gradient.addColor(am4core.color("#487fce").lighten(0)); // Fully opaque at the top
      gradient.addColor(am4core.color("#487fce").lighten(-1)); // Fully transparent at the bottom
      gradient.rotation = 90;

      demandSeries.fill = gradient;
      demandSeries.fillOpacity = 0.4; // Ensure fillOpacity is set to 1 to see the gradient effect

      demandSeries.tooltipText = "Demand: [bold]{valueY}[/] MW";
      if (demandSeries.tooltip) {
        demandSeries.tooltip.getFillFromObject = false;
        demandSeries.tooltip.background.fill = am4core.color(isDarkMode ? "#000000" : "#ffffff");
        demandSeries.tooltip.label.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");
      }

      // Create series for Spot Price with gradient
      let priceSeries = newChart.series.push(new am4charts.LineSeries());
      priceSeries.dataFields.dateX = "Settlement Date";
      priceSeries.dataFields.valueY = "Spot Price ($/MWh)";
      priceSeries.name = "Spot Price ($/MWh)";
      priceSeries.yAxis = priceAxis;
      priceSeries.strokeWidth = 4;
      priceSeries.stroke = am4core.color("#a57229");
      priceSeries.propertyFields.strokeDasharray = "dash";
      priceSeries.tooltipText = "Price: [bold]{valueY}[/] $/MWh";
      if (priceSeries.tooltip) {
        priceSeries.tooltip.getFillFromObject = false;
        priceSeries.tooltip.background.fill = am4core.color(isDarkMode ? "#000000" : "#ffffff");
        priceSeries.tooltip.label.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");
      }

      // Highlight regions where predicted excess energy exceeds a threshold
      const threshold = 50;
      processedData.forEach((item) => {
        if (
          item["Predicted Excess Energy (MW)"] &&
          item["Predicted Excess Energy (MW)"] > threshold
        ) {
          let range = dateAxis.axisRanges.create();
          range.date = item["Settlement Date"];
          range.endDate = new Date(item["Settlement Date"].getTime() + 60 * 60 * 1000);
          range.axisFill.fill = am4core.color("#29a55a");
          range.axisFill.fillOpacity = 0.5;
        }
      });

      // Add a dotted line to denote the current time
      const currentTime = new Date();
      let range = dateAxis.axisRanges.create();
      range.date = currentTime;
      range.grid.stroke = am4core.color("#FF0000");
      range.grid.strokeWidth = 2;
      range.label.text = `[bold]Current Time: ${format(currentTime, "MMM dd HH:mm")}`;
      range.label.inside = true;
      range.label.fontSize = 14;
      range.label.opacity = 0.8;
      range.grid.strokeOpacity = 0.6;
      range.grid.strokeDasharray = "4,4";

      let range2 = dateAxis.axisRanges.create();
      range2.date = new Date(currentTime.getTime() + 1000 * 60 * 60 * 4);
      range2.label.text = `[bold]FORECAST`;
      range2.label.inside = true;
      range2.label.fontSize = 14;
      range2.label.valign = "top";
      range2.label.opacity = 0.5;

      newChart.legend = new am4charts.Legend();
      newChart.legend.labels.template.fill = am4core.color(isDarkMode ? "#ffffff" : "#000000");

      newChart.cursor = new am4charts.XYCursor();
      return newChart;
    };

    if (chart) {
      chart.dispose(); // Dispose the previous chart
    }

    const newChart = createChart(colourMode.colorMode === "dark");
    setChart(newChart);

    return () => {
      newChart.dispose(); // Dispose the chart when component unmounts
    };
  }, [data, colourMode.colorMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return !data.length || !summaryData ? (
    <LoadingUI />
  ) : (
    <Box width="100%" maxW="100%" p={6}>
      <Heading as="h2" size="lg" mb={4}>
        Energy Insights
      </Heading>
      <Card borderRadius="3xl" p={6} mb={4} boxShadow="lg">
        <Heading as="h3" size="md" mb={4}>
          <Box as={priceIcon} display="inline" mr={2} />
          Currently, energy prices are{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={priceString === "high" ? "green.400" : "red.400"}
          >
            {priceString}
          </Text>
          ,
        </Heading>
        <Heading as="h3" size="md" mb={4}>
          <Box as={demandIcon} display="inline" mr={2} />
          demand is{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={demandString === "high" ? "green.400" : "red.400"}
          >
            {demandString}
          </Text>
          ,
        </Heading>
        <Heading as="h3" size="md">
          <Box as={adviceIcon} display="inline" mr={2} />
          and you are forecast to{" "}
          <Text as="span" fontWeight="bold">
            {excessEnergyString}
          </Text>
          . Thus, it is advisable to{" "}
          <Text as="span" fontWeight="bold" color={insightCardColour}>
            {adviceString}
          </Text>
        </Heading>
      </Card>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} width="100%" mb={4}>
        <Card borderRadius="3xl" p={6} boxShadow="lg">
          <Stat>
            <StatLabel>Current Profit</StatLabel>
            <StatNumber>${(Math.random() * 1000).toFixed(2)}</StatNumber>
            <Sparkline data={generateRandomDataForSparkline()} height="60px" mx="-4" />
          </Stat>
        </Card>
        <Card borderRadius="3xl" p={6} boxShadow="lg">
          <Stat>
            <StatLabel>Imported Energy Costs</StatLabel>
            <StatNumber>${(Math.random() * 500).toFixed(2)}</StatNumber>
            <Sparkline data={generateRandomDataForSparkline(30, true)} height="60px" mx="-4" />
          </Stat>
        </Card>
        <Card borderRadius="3xl" p={6} boxShadow="lg">
          <Stat>
            <StatLabel>Export Energy Total</StatLabel>
            <StatNumber>{(Math.random() * 2000).toFixed(2)} kWh</StatNumber>
            <Sparkline data={generateRandomDataForSparkline(30, true)} height="60px" mx="-4" />
          </Stat>
        </Card>
      </SimpleGrid>
      <Card borderRadius="3xl" gap={4} p={6} boxShadow="lg" overflow="hidden" maxW="100%">
        <Heading as="h2" size="lg" mb={4}>
          Live Energy Prices
        </Heading>
        <StatGroup>
          <Stat>
            <StatLabel>Current Spot Price</StatLabel>
            <StatNumber display="flex" py={1}>
              <Box bg="#a57229" width="0.3em" borderRadius="full" mr={2} />${summaryData.curPrice}
            </StatNumber>
            <StatHelpText>(/MWh)</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Current Demand</StatLabel>
            <StatNumber display="flex" py={1}>
              <Box bg="#487fce" width="0.3em" borderRadius="full" mr={2} />
              {summaryData.curDemand}
            </StatNumber>
            <StatHelpText>(MW)</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Forecast Price (Next 30min)</StatLabel>
            <StatNumber display="flex" my={1}>
              <Box borderRight="0.25em dotted #a57229" width="0.3em" mr={2} />$
              {summaryData.forPrice}
            </StatNumber>
            <StatHelpText>
              <Tooltip
                title={`On a ${
                  summaryData.forPrice > summaryData.curPrice ? "upward" : "downward"
                } trend.`}
              >
                <StatArrow
                  type={summaryData.forPrice > summaryData.curPrice ? "increase" : "decrease"}
                />
              </Tooltip>
              (/MWh)
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Forecast Demand (Next 30min)</StatLabel>
            <StatNumber display="flex" my={1}>
              <Box borderRight="0.25em dotted #487fce" width="0.3em" mr={2} />
              {summaryData.forDemand}
            </StatNumber>
            <StatHelpText>
              <Tooltip
                title={`On a ${
                  summaryData.forDemand > summaryData.curDemand ? "upward" : "downward"
                } trend.`}
              >
                <StatArrow
                  type={summaryData.forDemand > summaryData.curDemand ? "increase" : "decrease"}
                />
              </Tooltip>
              (MW)
            </StatHelpText>
          </Stat>
        </StatGroup>
        <HStack>
          <Box w="20px" h="20px" borderRadius="md" bgColor="green.500" />
          <Text>Indicates periods of forecast high excess energy.</Text>
        </HStack>
        <Box w="100%" overflowX="scroll">
          <Box ref={chartRef} w="100%" height="500px" minWidth="600px" />
        </Box>
      </Card>
    </Box>
  );
};
