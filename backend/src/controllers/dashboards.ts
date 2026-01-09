import type { Request, Response } from 'express';
import { getDashboardsForModel } from '../services/dashboards';

export const getDashboards = async (req: Request, res: Response) => {
  const modelId = req.query.modelId as string;

  if (!modelId) {
    return res.status(400).json({ dashboards: [] });
  }

  const dashboards = await getDashboardsForModel(modelId);

  res.json({ dashboards });
};
