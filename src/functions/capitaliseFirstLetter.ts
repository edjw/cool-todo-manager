// Capitalise the first letter of a string

export const capitaliseFirstLetter = (str: string): string => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }

  if (str === undefined || str === null || str.length === 0) {
    return str;
  }

  const firstLetter = str[0];

  if (firstLetter === undefined) {
    return str;
  }

  const firstLetterCapitalised = firstLetter.toUpperCase();

  const restOfString = str.slice(1);

  const stringCapitalised = firstLetterCapitalised + restOfString;

  return stringCapitalised;
};
