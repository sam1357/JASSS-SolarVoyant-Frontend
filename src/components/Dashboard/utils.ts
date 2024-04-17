export function getDayOfWeek(index: number) {
  if (index === 0) {
    return "Today";
  }
  const today: Date = new Date();
  today.setDate(today.getDate() + index);
  const dayOfWeek: number = today.getDay();
  const days: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
}
export function getCurrentHour() {
  const now: Date = new Date();
  const hour: number = now.getHours();
  return hour;
}
export function getFormattedDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  return `${day} ${month}, ${year}`;
}
export function getAttributeName(attribute: string) {
  switch (attribute) {
    case "shortwave_radiation":
      return "Solar Irradiance";
    case "temperature_2m":
      return "Temperature";
    case "daylight_hours":
      return "Daylight Hours";
    case "sunshine_hours":
      return "Sunshine Hours";
    case "cloud_cover":
      return "Cloud Cover";
    default:
      return "Unknown Attribute";
  }
}
export function parseAttributesArray(aggregate: string): string[] {
  // potentially add validity checking later
  return aggregate.split(",").map((value) => value.trim());
}
