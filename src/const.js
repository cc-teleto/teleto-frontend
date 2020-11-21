import path from "path";

export const  CURRENT_VIEW = {
  START_FORM: "START_FORM",
  RANDOM_GENERATE: "RANDOM_GENERATE"
}

export const API_URL = "https://ttnxcty7yc.execute-api.us-east-2.amazonaws.com/";
export const STAGE = "stage";
export const getURL = (...args) => {
  return path.join(API_URL, STAGE, ...args)
}