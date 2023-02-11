import pino from "pino";
import fs from "fs";
import Converter from "openapi-to-postmanv2";

export class Swagger2PostmanX {
  constructor(input, output) {
    this.input = input;
    this.output = output;

    this.loggger = pino({
      transport: {
        target: "pino-pretty",
      },
    });
  }

  convert() {
    const data = []
    this.input.forEach((file) => {
      Converter.convert(
        { type: "file", data: file },
        { folderStrategy: "Tags" },
        (err, conversionResult) => {
          if (err) {
            throw err;
          }

          if (!conversionResult.result) {
            throw conversionResult.reason;
          }

          this.fixPostmanCollection(conversionResult.output[0].data);
          fs.writeFileSync(
            this.output,
            JSON.stringify(conversionResult.output[0].data, null, 2),
            "utf8"
          );
        }
      );
    });
  }

  fixPostmanCollection(collection) {
    if (collection.item) {
      collection.item.forEach((item) => {
        this.fixPostmanCollection(item);
      });
    } else if (collection.request) {
      this.fixPostmanRequest(collection.request);
    }
  }

  fixPostmanRequest(request) {
    request.url.path = this.convertPathVariablesToEnv(request.url.path);
    request.url.path = this.renamePathVariables(request.url.path);
    request.header = this.addHeaders(request.header);
    request.url.raw = this.generateRawUrl(request);
  }

  convertPathVariablesToEnv(path) {
    return path.map((item) => {
      if (item.startsWith(":")) {
        return `{{${item.substr(1)}}}`;
      } else {
        return item;
      }
    });
  }

  renamePathVariables(path) {
    const newPath = [];
    for (let i = 0; i < path.length; i++) {
      const element = path[i];
      if (element.startsWith("{{") && element.endsWith("}}")) {
        let entity = path[i - 1].toLowerCase();
        if (entity.endsWith("s")) {
          entity = entity.substr(0, entity.length - 1);
        }
        const newId = `{{${entity}Id}}`;
        newPath.push(newId);
      } else {
        newPath.push(element);
      }
    }
    return newPath;
  }

  addHeaders(headers) {
    if (!headers) {
      headers = [];
    }
    headers.push({
      key: "Authorization",
      value: "{{integrationToken}}",
      disabled: true,
    });
    return headers;
  }

  generateRawUrl(request) {
    const pathUrl = request.url.host + '/' + request.url.path.join("/");
    if (request.url.query.length === 0) {
      return pathUrl;
    }

    const query = request.url.query.map((item) => `${item.key}=${item.value}`);
    const queryString = `?${query.join("&")}`
    return pathUrl + queryString;
  }
}
