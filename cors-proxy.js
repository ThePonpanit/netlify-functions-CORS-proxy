const axios = require("axios");

const ALLOWED_ORIGINS = [
  "https://eloquent-hotteok-54d269.netlify.app",
  "http://localhost:3000",
  "https://eloquent-hotteok-54d269.netlify.app/",
  "http://localhost:5173",
];

const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function getOriginForResponse(headers) {
  const origin = headers.origin || headers.Origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  // Default to wildcard if no matched origin
  return "*";
}

exports.handler = async function (event, context) {
  const currentOrigin = getOriginForResponse(event.headers);

  // Handle the preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...CORS_HEADERS,
        "Access-Control-Allow-Origin": currentOrigin,
      },
      body: "",
    };
  }

  // Ensure it's a GET request
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: {
        "Access-Control-Allow-Origin": currentOrigin,
      },
    };
  }

  // Extract target URL from query parameters
  const targetURL = event.queryStringParameters.url;
  if (!targetURL) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "url query param is required" }),
      headers: {
        "Access-Control-Allow-Origin": currentOrigin,
      },
    };
  }

  // Attempt to fetch data from the target URL
  try {
    const response = await axios.get(targetURL);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": currentOrigin,
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": currentOrigin,
      },
      body: JSON.stringify({ error: "Failed to fetch from target URL" }),
    };
  }
};
