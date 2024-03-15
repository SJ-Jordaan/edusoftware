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

export function extractStudentNumber(email: string | null): string | null {
  if (!email) {
    return null;
  }
  // Define the regex pattern to match a student number that starts with 'u' followed by digits
  const pattern = /^u\d+/;
  const match = email.match(pattern);

  // Check if there is a match and return the student number; otherwise, return null
  if (match) {
    return match[0];
  } else {
    return null;
  }
}
