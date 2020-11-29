import path from "path";

export const CURRENT_VIEW = {
  START_FORM: "START_FORM",
  RANDOM_GENERATE: "RANDOM_GENERATE",
  ROULETTE: "ROULETTE",
};
export const DEFAULT_CATEGORY = "友人・同僚";

export const API_URL =
  // "https://ttnxcty7yc.execute-api.us-east-2.amazonaws.com/";
  "https://whwe83zc8g.execute-api.us-east-1.amazonaws.com/"
// export const STAGE = "stage";
export const STAGE = "prod";
export const getURL = (...args) => {
  return path.join(API_URL, STAGE, ...args);
};
