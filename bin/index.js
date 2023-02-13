#!/usr/bin/env node

import { Command } from "commander";
const program = new Command();
import { Swagger2PostmanX } from "../src/swagger-2-postman-x.js";

program.name("Swagger2PostmanX").version("0.0.1");

program
  .command("convert")
  .description(
    "convert a list of swagger specifications into a single postman collection with support for environment variables"
  )
  .option("-i, --input <files...>", "specify a list of input files")
  .option("-o, --output <output>", "specify output file", "output.json")
  .action(({ output, input }) => {
    const swagger2PostmanX = new Swagger2PostmanX(input, output);
    swagger2PostmanX.convert();
  });

program.parse();
