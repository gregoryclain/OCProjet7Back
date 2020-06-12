const http = require("http");
require("dotenv").config();
const app = require("./app");

// const normalizePort = (val) => {
//   const port = parseInt(val, 10);

//   if (isNaN(port)) {
//     return val;
//   }
//   if (port >= 0) {
//     return port;
//   }
//   return false;
// };

const db = require("./models");
// const PORT = normalizePort(process.env.PORT || "3000");
const PORT = process.env.PORT || "3000";
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Listening on : http://localhost:3000");
  });
});

const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);
// app.set("port", port);

// const errorHandler = (error) => {
//   if (error.syscall !== "listen") {
//     throw error;
//   }
//   const address = server.address();
//   const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " requires elevated privileges.");
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(bind + " is already in use.");
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// };

// const server = http.createServer(app);

// server.on("error", errorHandler);
// server.on("listening", () => {
//   const address = server.address();
//   const bind = typeof address === "string" ? "pipe " + address : "port " + port;
//   console.log("Listening on " + bind);
// });

// server.listen(port);
