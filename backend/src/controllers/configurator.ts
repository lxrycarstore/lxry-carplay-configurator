import type { Request, Response } from 'express';
import {
  calculateQuote,
  getConfiguratorData,
  getConfiguratorModels
} from '../services/configurator';

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

export const getModels = async (req: Request, res: Response) => {
  const { merk, bouwjaar } = req.query;

  const parsedYear =
    typeof bouwjaar === 'string' ? parseInt(bouwjaar, 10) : undefined;

  const models = await getConfiguratorModels(
    typeof merk === 'string' ? merk : undefined,
    parsedYear
  );

  res.status(200).json({
    models,
    generatedAt: new Date().toISOString()
  });
};