import { Router } from 'express';
import { getOptions, postQuote, getModels } from '../controllers/configurator';

export const configuratorRouter = Router();

configuratorRouter.get('/options', getOptions);
configuratorRouter.get('/models', getModels);
configuratorRouter.post('/quote', postQuote);
