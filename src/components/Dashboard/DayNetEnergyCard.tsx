// "use client";
// import { Card, CardBody, Box, Heading, Text, Image, Center } from "@chakra-ui/react";
// import { WeekWeatherCodes, energyDataObj, energyWithTimeStamp } from "@interfaces/index";
// import { getDayOfWeek } from "./utils";
// import { useEffect, useState } from "react";

// interface DayNetEnergyCardProps {
//     dailyEnergyData: energyDataObj;
//     dayIndex: number;
// }

// // type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// const DayEnergyCard: React.FC<DayNetEnergyCardProps> = ({ dailyEnergyData, dayIndex }) => {
//   const [rawVal, setRawVal] = useState(0);
//   const [percVal, setPercVal] = useState(0);

//   useEffect(() => {
//     let rawVal = 0;
//     const getRawVal = () => {

//       let rawVal = (dailyEnergyData.netRaw as energyWithTimeStamp[])[dayIndex].value;
//       setRawVal(rawVal);
//     };
//     getRawVal();

//     const getPercVal = () => {
//       let percVal = (dailyEnergyData.net as energyWithTimeStamp[])[dayIndex].value;
//       setPercVal(percVal);
//     };
//     getPercVal();

//   }, []); // eslint-disable-line

//   return (
//     <Card borderRadius="3xl" _hover={{ bg: "#0095e6" }}>
//       <CardBody>
//         <Heading fontSize="xl" textAlign="center">
//           {dataName}
//         </Heading>
//         <Box>
//           <Text fontSize="md" textAlign="center">
//             {val.toFixed(2)} W
//           </Text>
//         </Box>
//       </CardBody>
//     </Card>
//   );
// };
// export default DayNetEnergyCardProps;
