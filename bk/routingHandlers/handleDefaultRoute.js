'use strict'

export const handleDefaultRoute = (req, res) => {
  if (req.method === "GET" || req.method === "POST") {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Not found 404!" }));
  }
}