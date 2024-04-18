import {
  Box,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import getSliderLabelByValue from "@src/utils/getSliderLabelByValue";

function CustomSlider({ value, onChange }) {
  const labelStyles = {
    mt: "2",
    ml: "-6",
    fontSize: "sm",
  };

  return (
    <Box width={"100%"} p={4} pt={6}>
      <Slider step={25} aria-label="slider-ex-6" value={value} onChange={onChange}>
        <SliderMark value={0} {...labelStyles}>
          Smallest
        </SliderMark>
        <SliderMark value={25} {...labelStyles}>
          Smaller
        </SliderMark>
        <SliderMark value={50} {...labelStyles}>
          Average
        </SliderMark>
        <SliderMark value={75} {...labelStyles}>
          Larger
        </SliderMark>
        <SliderMark value={100} {...labelStyles}>
          Large
        </SliderMark>
        <SliderMark
          value={value}
          textAlign="center"
          bg="blue.500"
          color="white"
          mt="-10"
          ml="-5"
          w="15"
        >
          {getSliderLabelByValue(value)}m²
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}

export default CustomSlider;
