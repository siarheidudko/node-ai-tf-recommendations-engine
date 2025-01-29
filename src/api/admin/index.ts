import { Router } from "express";
import {
  TensorFlow,
  tensorFlow,
  tensorFlowInit,
} from "../../services/tensorflow/index.ts";
import { logger } from "../../services/logger/index.ts";

export const admin = Router();

admin.put("/p", async (req, res) => {
  try {
    if (req.headers["x-api-key"] !== process.env.SERVER_TOKEN) {
      res.status(403).json({ success: false, error: `Access is restricted` });
      return;
    }
    const data = req.body;
    if (
      !Array.isArray(data) ||
      data?.length === 0 ||
      data.filter(
        (e) =>
          typeof e !== "object" ||
          typeof e?.id !== "string" ||
          typeof e?.description !== "string"
      ).length
    ) {
      res.status(400).json({ success: false, error: `Invalid request body` });
      return;
    }
    const mtx: Parameters<TensorFlow["setEmbeddings"]>[0] = data;
    await tensorFlowInit;
    await tensorFlow.setEmbeddings(mtx);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    logger.log(err);
    res.status(500).json({ success: false, error: `${err}` });
  }
  process.exit(0);
});
