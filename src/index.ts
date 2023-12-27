import express from "express";
import http from 'http';
import chalk from 'chalk';

import './config/passport.js';
import { startSocketServer } from "./utils/socket.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

startSocketServer(server);

/** Routes */
import { defaultRoute } from "./routes/defaultRoute.js";

app.use('/', defaultRoute);

server.listen(PORT, () => {
  console.log(chalk.green(`🚀 Server is running on port ${PORT}.`));
});