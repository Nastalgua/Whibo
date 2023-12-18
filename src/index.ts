import express from "express";
import http from 'http';
import chalk from 'chalk';

import { startSocketServer } from "./utils/socket.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = startSocketServer(server);

app.get("/", (_req, res) => {
  return res.send("Hello world!");
});

server.listen(PORT, () => {
  console.log(chalk.green(`🚀 Server is running on port ${PORT}.`));
});