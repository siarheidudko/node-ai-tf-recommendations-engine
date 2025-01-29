import { Router } from "express";
import { tensorFlow, tensorFlowInit } from "../../services/tensorflow/index.ts";
import { logger } from "../../services/logger/index.ts";

export const user = Router();

user.post("/p", async (req, res) => {
  try {
    if (req.headers["x-api-key"] !== process.env.CLIENT_TOKEN) {
      res.status(403).json({ success: false, error: `Access is restricted` });
      return;
    }
    const data = req.body;
    if (typeof data !== "object" || typeof data["input"] !== "string") {
      res.status(400).json({ success: false, error: `Invalid request body` });
      return;
    }
    await tensorFlowInit;
    const inp: string = data["input"];
    const top: number | undefined =
      typeof data["top"] === "number" ? data["top"] : undefined;
    const result = await tensorFlow.getSimilar(inp, top);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    logger.log(err);
    res.status(500).json({ success: false, error: `${err}` });
  }
});
