import { Router } from 'express';
import { getOptions, postQuote, getModels, getSolutions } from '../controllers/configurator';
import { getDashboards } from '../controllers/dashboards';

export const configuratorRouter = Router();

configuratorRouter.get('/options', getOptions);
configuratorRouter.get('/models', getModels);
configuratorRouter.post('/quote', postQuote);
configuratorRouter.get('/dashboards', getDashboards);
configuratorRouter.get('/solutions', getSolutions);