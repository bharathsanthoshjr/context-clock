// Context Clock — time context generator
// Pure functions only: no page access, no storage, no network.

const CONTEXT_PREFIX = "[Sent:";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Turns 7 into "07" so times always look like 09:07, not 9:7.
function padTwo(number) {
  return String(number).padStart(2, "0");
}

// Returns the offset from UTC, e.g. "UTC+05:30" or "UTC-04:00".
function formatUtcOffset(date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  return `UTC${sign}${padTwo(hours)}:${padTwo(minutes)}`;
}

// Returns the IANA time zone name, e.g. "Asia/Calcutta".
function getTimeZoneName() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown time zone";
  } catch (error) {
    return "Unknown time zone";
  }
}

// Builds the full context line from a date (defaults to right now).
function buildTimeContext(date = new Date()) {
  const weekday = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const time = `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}`;

  return `${CONTEXT_PREFIX} ${weekday} ${day} ${month} ${year}, ${time} (${getTimeZoneName()}, ${formatUtcOffset(date)})]`;
}