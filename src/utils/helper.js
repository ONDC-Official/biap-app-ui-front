import moment from "moment";

export const removeNullValues = (object) => {
  Object.entries(object).forEach(([k, v]) => {
    if (v && typeof v === "object") removeNullValues(v);
    if (
      (v && typeof v === "object" && !Object.keys(v).length) ||
      v === null ||
      v === undefined ||
      v.length === 0
    ) {
      if (Array.isArray(object)) object.splice(k, 1);
      else if (!(v instanceof Date)) delete object[k];
    }
  });
  return object;
};


export const compareDateWithDuration = (duration, dateStr) => {
  const currentDate = new Date();
  const providedDate = new Date(dateStr);
  // Parse the duration
  const durationInMilliseconds = parseDuration(duration);
  // Add the duration to the provided date
  const newDate = new Date(providedDate.getTime() + durationInMilliseconds);
  // Compare the new date with the current date
  return currentDate.getTime() > newDate.getTime();
}

// Parse ISO 8601 duration format (PT1H, PT30S, etc.)
export function parseDuration(duration) {
  return moment.duration(duration).asMilliseconds();
}



