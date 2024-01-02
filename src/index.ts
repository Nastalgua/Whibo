import express from "express";
import http from 'http';
import chalk from 'chalk';
import passport from "passport";
import cookieSession from "cookie-session";
import cors from 'cors';

import './config/passport.js';
import { startSocketServer } from "./utils/socket.js";
import { CLIENT_URL, COOKIE_KEY, PORT } from "./utils/secrets.js";

/** Routes */
import defaultRoute from "./routes/defaultRoute.js";
import authRoute from "./routes/authRoute.js";
import boardRoute from "./routes/boardRoute.js";

const app = express();
const server = http.createServer(app);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY]
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

startSocketServer(server);

app.use('/', defaultRoute);
app.use('/auth', authRoute);
app.use('/boards', boardRoute);

server.listen(PORT, () => {
  console.log(chalk.green(`🚀 Server is running on port ${PORT}.`));
});