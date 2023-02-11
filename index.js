import { Swagger2PostmanX } from "./src/swagger-2-postman-x.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const inputDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "./specifications-input"
);
const input = fs
  .readdirSync(inputDirectory)
  .map((file) => path.join(inputDirectory, file));

const output = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "./specifications-output/output.json"
);

const swagger2Postman = new Swagger2PostmanX(input, output);

swagger2Postman.convert();
