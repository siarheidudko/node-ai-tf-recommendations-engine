import express from "express";
import morgan from "morgan";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { admin, user } from "./api/index.ts";
import { logger } from "./services/logger/index.ts";
import "./env.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();

server.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )
);
server.use(express.static(join(__dirname, "..", "public")));
server.use(express.json({ type: "*/*", limit: "512mb" }));

server.use("/a", admin);
server.use("/u", user);

server.use((req, res) => {
  res.status(404).json({ success: false, error: `Not Found` });
});

const port = process.env.PORT ?? "8013";

server.listen(port, (err) => {
  if (err) throw err;
  logger.log(`The server is running on port ${port}.`);
});
