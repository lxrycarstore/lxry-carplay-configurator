import type { Request, Response } from 'express';
import { calculateQuote, getConfiguratorData } from '../services/configurator.js';

export const getOptions = async (_req: Request, res: Response) => {
  const data = await getConfiguratorData();
  res.status(200).json(data);
};

export const postQuote = async (req: Request, res: Response) => {
  const selection = req.body;
  const data = await getConfiguratorData();
  const quote = calculateQuote(data.options, selection);

  res.status(200).json({
    quote,
    generatedAt: new Date().toISOString()
  });
};
