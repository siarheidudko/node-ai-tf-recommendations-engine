import {
  load as loadModel,
  UniversalSentenceEncoder,
} from "@tensorflow-models/universal-sentence-encoder";
import { matMul, Rank, Tensor, tensor2d } from "@tensorflow/tfjs-node";
import { writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../logger/index.ts";

export interface TensorMtxItem {
  description: string;
  id: string;
}

type TensorMtx = TensorMtxItem[];

export class TensorFlow {
  private model: UniversalSentenceEncoder;

  private mtx: TensorMtx = [];

  private embeddings: Tensor<Rank.R2> | null = null;

  private mtxFilePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../",
    "tmp/matrix_tensor.json"
  );

  private gc() {
    if (typeof global?.gc === "function") global.gc();
  }

  public async save() {
    if (!this.embeddings || this.mtx.length === 0) {
      logger.log("No embeddings to save!");
      return;
    }

    const embeddingsArray = await this.embeddings.array();
    const data = {
      embeddings: embeddingsArray,
      mtx: this.mtx,
    };
    await writeFile(this.mtxFilePath, JSON.stringify(data), {
      encoding: "utf8",
      flag: "w",
    });
  }

  public async load() {
    const data = await readFile(this.mtxFilePath, {
      encoding: "utf8",
      flag: "r",
    })
      .then(async (e) => JSON.parse(e))
      .catch(() => ({}));
    const { embeddings, mtx } = data;

    if (!Array.isArray(embeddings) || !Array.isArray(mtx)) {
      logger.log("Invalid data format in the embeddings file.");
      return;
    }
    if (this.embeddings) {
      this.embeddings?.dispose();
      this.gc();
    }
    this.mtx = mtx;
    this.embeddings = tensor2d(embeddings);
  }

  public async setEmbeddings(mtx: TensorMtx) {
    if (!this.model) throw new Error("TensorFlow isn't initialized!");
    this.embeddings?.dispose();
    this.mtx = mtx.sort((a, b) => (a.id > b.id ? 1 : -1));
    const descriptions = this.mtx.map((e) => e.description);
    this.embeddings = null;
    this.gc();
    this.embeddings = (await this.model.embed(
      descriptions
    )) as unknown as Tensor<Rank.R2>;
    await this.save();
  }

  public async getSimilar(input: string, topN: number = 5) {
    if (!this.model) throw new Error("TensorFlow isn't initialized!");
    if (!this.embeddings) throw new Error("Embeddings are not set!");

    const inputEmbedding = (await this.model.embed([
      input,
    ])) as unknown as Tensor<Rank.R2>;
    const transposedEmbeddings = this.embeddings.transpose();
    const similarity = matMul(inputEmbedding, transposedEmbeddings);
    inputEmbedding.dispose();
    transposedEmbeddings.dispose();
    const similarityArray = await similarity.array();
    similarity.dispose();

    const sortedIndices = similarityArray[0]
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
      .map((item) => item.index);

    this.gc();

    return sortedIndices.map((index) => this.mtx[index]);
  }

  public static async init(): Promise<TensorFlow> {
    const tf = new TensorFlow();
    tf.model = await loadModel();
    await tf.load();
    return tf;
  }
}

export let tensorFlow: TensorFlow;

export const tensorFlowInit = TensorFlow.init().then((tf) => {
  tensorFlow = tf;
});
