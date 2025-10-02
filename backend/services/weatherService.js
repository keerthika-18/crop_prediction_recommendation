// services/weatherService.js
const axios = require("axios");
const twilio = require("twilio");
require("dotenv").config();

const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

async function sendWeatherAlert(location, phone) {
  try {
    // WeatherAPI call
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${location}&days=2`;
    const response = await axios.get(url);

    const forecast = response.data.forecast.forecastday;
    let rainyDays = 0;

    forecast.forEach(day => {
      if (day.day.condition.text.toLowerCase().includes("rain")) rainyDays++;
    });

    const messageBody =
      rainyDays > 0
        ? `🌧 Rain expected for ${rainyDays} days in ${location}. Take precautions for your crops.`
        : `☀ No rain expected in ${location} for the next 2 days.`;

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: messageBody,
      from: TWILIO_FROM,
      to: phone,
    });

    return { alert: messageBody, sid: message.sid };
  } catch (err) {
    console.error("sendWeatherAlert Error:", err.response?.data || err.message);
    throw err; // propagate to route
  }
}

module.exports = { sendWeatherAlert }; // ✅ correct export
