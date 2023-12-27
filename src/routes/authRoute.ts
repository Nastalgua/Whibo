// import { Router } from 'express';
// import passport from '../config/passport.js';
// import { CLIENT_URL } from '../utils/secrets.js';
// import { GetAuthRequest } from '../types/requests.js';

// export const authRoute = Router();

// authRoute.get('/check-auth', (req: GetAuthRequest<{ user: any }>, res, _next) => {
//   return res.status(200).send({ user: req.session.user });
// });

// authRoute.get('/google',
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// authRoute.get('/google/callback',
//   passport.authenticate("google"),
//   (req: GetAuthRequest<{ user: any }>, res) => {
//     req.session.user = (req as any).user;
//     res.redirect(CLIENT_URL);
//   }
// )