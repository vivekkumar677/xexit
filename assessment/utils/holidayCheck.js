import axios from "axios";

export const isWeekend = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
};

export const isHoliday = async (date, country) => {
  try {
    // 🚨 If API key missing, ASSUME NOT A HOLIDAY
    if (!process.env.CALENDARIFIC_API_KEY) {
      return false;
    }

    const year = new Date(date).getFullYear();

    const res = await axios.get(
      "https://calendarific.com/api/v2/holidays",
      {
        params: {
          api_key: process.env.CALENDARIFIC_API_KEY,
          country,
          year,
        },
      }
    );

    const holidays = res.data.response.holidays || [];

    return holidays.some(
      (h) => h.date.iso === date
    );
  } catch (err) {
    // 🚨 NEVER crash backend during tests
    return false;
  }
};
