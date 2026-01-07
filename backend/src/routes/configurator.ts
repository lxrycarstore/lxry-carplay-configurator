import { Router } from 'express';
import { getOptions, postQuote } from '../controllers/configurator';

export const configuratorRouter = Router();

configuratorRouter.get('/options', getOptions);
configuratorRouter.post('/quote', postQuote);
