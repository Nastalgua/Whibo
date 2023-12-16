import express from "express";
import http from 'http';
import chalk from 'chalk';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.get("/", (_req, res) => {
  return res.send("Hello world!");
});

server.listen(PORT, () => {
  console.log(chalk.green(`🚀 Server is running on port ${PORT}.`));
});