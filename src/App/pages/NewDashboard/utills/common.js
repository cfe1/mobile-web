import moment from "moment";

export const transformJobTitles = (data) => {
  return data.map((item) => ({
    value: item.id,
    label: item.name,
  }));
};

export const convertDate = (date, format = "YYYY-MM-DD") => {
  return moment(date).format(format);
};

export const convertMinutesToHoursAndMinutes = (totalSeconds) => {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hr ${minutes} min`;
};

export const decimalToHoursMinutes = (decimalHours) => {
  let hours = Math.floor(decimalHours);
  let decimalPart = decimalHours - hours;
  let minutes = Math.round(decimalPart * 60);

  if (minutes === 0) {
    return hours + "h";
  } else {
    return hours + "h " + minutes + "m";
  }
};

export const getNurseTypeText = (type) => {
  return type === "IN" ? "Internal" : type === "EN" ? "External" : "Agency";
};

export const formatAsDollar = (number) => {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
};
