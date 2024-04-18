export default function getSliderLabelByValue(value: number) {
  switch (value) {
    case 0:
      return "25";
    case 25:
      return "50";
    case 50:
      return "100";
    case 75:
      return "125";
    case 100:
      return "150";
  }
}
