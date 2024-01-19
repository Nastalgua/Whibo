import passport from 'passport';
import chalk from 'chalk';
import { generateUsername } from 'unique-username-generator';

import pool from './db';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../utils/secrets.js';

import UserQueries from '../config/queries/userQueries.js';

interface IUser extends Express.User {
  id: string
}

/**
 * Serializes user into a format that can be stored
 * in the session.
 */
passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

/**
 * This code deserializes a user from a session, 
 * using the user's unique identifier (id) to query 
 * the database and retrieve their data.
 */
passport.deserializeUser(async (id: string, done) => {
  const currentUser = (await pool.query(UserQueries.getUserById, [id])).rows[0];
  done(null, currentUser);
});

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const user = (await pool.query(UserQueries.getUserByGoogleId, [profile.id])).rows[0];

        if (!user) {
          const newUser = (await pool.query(
            UserQueries.addUserFromGoogle, 
            [
              profile.id, 
              generateUsername(),
              profile.emails?.[0].value
            ]
          )).rows[0];

          if (newUser) { done(null, newUser); }
        } else {
          done(null, user);
        }
      }
    )
  );
} else {
  let msg = "The following ENV variables are missing: ";

  if (!GOOGLE_CLIENT_ID) { msg += "CLIENT_ID " };
  if (!GOOGLE_CLIENT_SECRET) { msg += "CLIENT_SECRET " }

  console.log(chalk.red("Could not start Google Passport. Missing ENVs: " + msg));
}