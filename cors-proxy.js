const axios = require("axios");

exports.handler = async function (event, context) {
  // Handle the preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      },
      body: "CORS preflight successful",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }

  const targetURL = event.queryStringParameters.url;

  if (!targetURL) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "url query param is required" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }

  try {
    const response = await axios.get(targetURL);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from target URL" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }
};
