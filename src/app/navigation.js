import { createBrowserNavigation } from "navi";

let navigation;

export const getNavigation = () => {
  if (typeof navigation === "undefined") {
    throw new Error("Navigation not created");
  }
  return navigation;
};
