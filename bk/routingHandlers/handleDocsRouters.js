const DocsControler = require("../controllers/Docs/DocsControler");
const { handleDefaultRoute } = require("../routingHandlers/handleDefaultRoute");
const { protectRouteTkPl } = require("../utils/protectRouteTkPl");


const routeHandlers = {
  "/docs/test": DocsControler.testDocData,
  "/docs/testToPDF": DocsControler.testToPDF,
}

const handleDocsRoutes = async(req, res) => {
  const { url, method } = req;
  try {
    if (url.startsWith("/docs")) {
      if (method === "POST") {
        const routeHandler = routeHandlers[url];
        if (routeHandler) {
          await protectRouteTkPl(routeHandler)(req, res);
        } else {
          handleDefaultRoute(req, res);
        }
      } else {
        handleDefaultRoute(req, res);
      }
    } else {
      handleDefaultRoute(req, res);
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "handleDocsRouters - ERROR" }));
  }
}

module.exports = {
  handleDocsRoutes
};