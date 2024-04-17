import { Box, Slider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react"
import getSliderLabelByValue from "@src/utils/getSliderLabelByValue"
import { useState } from "react"

function CustomSlider() {
    const [sliderValue, setSliderValue] = useState(50)
  
    const labelStyles = {
      mt: '2',
      ml: '-6',
      fontSize: 'sm',
    }
  
    return (
      <Box width={"100%"} p={4} pt={6}>
        <Slider step={50} aria-label='slider-ex-6' onChange={(val) => setSliderValue(val)}>
          <SliderMark value={0} {...labelStyles}>
            Small
          </SliderMark>
          <SliderMark value={50} {...labelStyles}>
            Average
          </SliderMark>
          <SliderMark value={100} {...labelStyles}>
            Large
          </SliderMark>
          <SliderMark
            value={sliderValue}
            textAlign='center'
            bg='blue.500'
            color='white'
            mt='-10'
            ml='-5'
            w='12'
          >
            {getSliderLabelByValue(sliderValue)}m²
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    )
  }

export default CustomSlider;