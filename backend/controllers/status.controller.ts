import { Request, Response } from "express";

/**
 * Get Server status
 */
const getStatus = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
};

export default {
  getStatus,
};
