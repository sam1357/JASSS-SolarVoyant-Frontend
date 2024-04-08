/**
 * Checks if a string is a parse-able JSON object
 * @param s the string to check
 * @returns if the string is JSON parse-able
 */
export const testJSON = (s: string): boolean => {
  if (typeof s !== "string") {
    return false;
  }
  try {
    JSON.parse(s);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
