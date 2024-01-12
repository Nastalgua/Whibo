import { NextFunction, Router, Request, Response } from 'express';
import passport from "passport";

import { GetAuthRequest } from '../types/requests.js';
import { CLIENT_URL } from '../utils/secrets.js';
import { IUser } from '../types/user.js';

const router = Router();

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ user: null });
  } else {
    next();
  }
}

router.get("/", checkAuth, (req, res) => {
  const user = req.user as IUser;
  const filteredUserInfo = {
    createdAt: user.created_at,
    username: user.username,
    email: user.email,
    id: user.id,
    googleId: user.google_id
  }

  res.status(200).send({ user: filteredUserInfo });
});

router.get("/login", (req, res) => {
  if (req.user) {
    // already logged in
    return res.status(200).json({
      user: req.user
    });
  }

  // unauthorized
  res.status(404).json({
    user: null
  });
});

router.get('/logout', (req, res) => {
  req.logout(() => {});
  res.status(200).json({ logoutSuccess: true });
});

router.get('/google',
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get('/google/redirect',
  passport.authenticate("google"), (req: GetAuthRequest<{ user: any }>, res) => {
    res.redirect(CLIENT_URL);
  }
);

export default router;