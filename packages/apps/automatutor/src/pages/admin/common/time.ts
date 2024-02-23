export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

type DateParts = {
  year?: string;
  month?: string;
  day?: string;
  hour?: string;
  minute?: string;
};

export const formatDateForInput = (isoString: string) => {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const locale = navigator.language;
  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(date);

  const dateParts = parts.reduce<DateParts>((acc, part) => {
    if (
      part.type === 'year' ||
      part.type === 'month' ||
      part.type === 'day' ||
      part.type === 'hour' ||
      part.type === 'minute'
    ) {
      acc[part.type] = part.value;
    }

    return acc;
  }, {});

  const { year = '', month = '', day = '', hour = '', minute = '' } = dateParts;
  return `${year}-${month}-${day}T${hour}:${minute}`;
};
