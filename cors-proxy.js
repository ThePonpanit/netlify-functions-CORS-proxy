const axios = require("axios");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const targetURL = event.queryStringParameters.url;

  if (!targetURL) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "url query param is required" }),
    };
  }

  try {
    const response = await axios.get(targetURL);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from target URL" }),
    };
  }
};
