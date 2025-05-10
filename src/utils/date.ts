export const formatDate = (date?: string | Date) => {
  if (!date) {
    return "-";
  }
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const timestampToDate = (timestamp?: string) => {
  if (!timestamp) return null;

  const seconds = parseInt(timestamp, 10);
  if (isNaN(seconds)) return null;

  return new Date(seconds * 1000);
};

export const formatTimestampToDate = (timestamp?: string) => {
  const date = timestampToDate(timestamp);
  if (!date) return "-";
  return formatDate(date);
};
