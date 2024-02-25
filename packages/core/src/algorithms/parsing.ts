export const parseOrReturn = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const parseOrNull = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};
