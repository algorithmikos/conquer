// @ts-ignore
import bidiFactory from "bidi-js";

const bidi = bidiFactory();

export const textDirection = (string: string) => {
  if (string) {
    const bidiType = bidi.getBidiCharTypeName(string[0]);

    switch (bidiType) {
      case "L":
        return "left";
      case "AL":
        return "right";
      default:
        return "left";
    }
  }
};
