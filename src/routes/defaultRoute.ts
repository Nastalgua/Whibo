import { Router } from 'express';
import { Request, Response } from 'express';

export const defaultRoute = Router();

defaultRoute.get('/', (req: Request, res: Response) => {
  res.send("Hello from Whibo!");
});