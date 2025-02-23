import moment from "moment";

const hasDayPassed = (date) => {
  console.log( moment(date, "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD")))
  return moment(date, "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD"));
};
export { hasDayPassed };
