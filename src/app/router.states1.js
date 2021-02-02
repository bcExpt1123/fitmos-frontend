import { compile, parse } from "path-to-regexp";
import omit from "lodash/omit";
import pick from "lodash/pick";
import pickBy from "lodash/pickBy";

import QueryParams from "../lib/QueryParams";

let prefixUsed = false;
let prefix = ""; // make it safe for test env

export const setPrefix = newPrefix => {
  if (prefixUsed) {
    throw new Error("Tried to set prefix after creating states");
  }
  prefix = newPrefix;
};

const ensureTrailingSlash = path => (path.endsWith("/") ? path : `${path}/`);

const createState = path => {
  const fn = (params = {}) => {
    prefixUsed = true;
    const prefixedPath = `${prefix}${path}`;
    const pathKeys = parse(prefixedPath)
      .filter(key => typeof key.name !== "undefined")
      .map(key => key.name);
    const availableParams = pickBy(
      params,
      value => typeof value !== "undefined"
    );
    const pathParams = pick(availableParams, pathKeys);
    const queryParams = omit(availableParams, pathKeys);
    const compiledPath = ensureTrailingSlash(compile(prefixedPath)(pathParams));
    const queryString = new QueryParams(queryParams).toString();

    return queryString ? `${compiledPath}?${queryString}` : compiledPath;
  };

  fn.toString = () => path;

  return fn;
};

const states = {
  home: createState("/"),
  athleteAssessment: createState("/athlete-assessment"),
  privacy: createState("/privacy"), // Redirects to /pages/privacy
  training: createState("/training"),
  nutrition: createState("/nutrition"),
  buyCoachTraining: createState("/training/coach/get"),
  buyCoachTrainingCampaign: createState("/training/coach/get/:cid/:gender"),
  buyCoachBodyMind: createState("/body-mind/coach/get"),
  buyCoachBodyMindCampaign: createState("/body-mind/coach/get/:cid/:gender"),
  external: createState("/external"),
  shop: {
    redirect: createState("/shop"),
    login: createState("/shop/login")
  },
  zendesk: {
    redirect: createState("/zendesk"),
    login: createState("/zendesk/login")
  },
  auth: {
    accountDeleted: createState("/auth/account-deleted"),
    login: createState("/auth/login"),
    passwordReset: createState("/auth/forgot-password"),
    registration: createState("/auth/registration"),
    resendConfirmation: createState("/auth/resend-confirmation"),
    setTokens: createState("/auth/set-tokens")
  },
  settings: {
    profile: createState("/settings/profile"),
    account: createState("/settings/account"),
    privacy: createState("/settings/privacy"),
    subscriptions: createState("/settings/subscriptions")
  },
  emailPreferences: createState("/email/update-preferences"),
  checkout: {
    index: createState("/checkout/:brand"),
    congratulations: createState("/checkout/congratulations/:brand"),
    finalize: createState("/checkout/finalize/:brand")
  },
  pages: {
    motivation: createState("/pages/motivation"),
    privacy: createState("/pages/privacy"),
    terms: createState("/pages/terms"),
    imprint: createState("/pages/imprint"),
    inviteTerms: createState("/pages/terms-invite"),
    download: createState("/pages/download")
  },
  targeting: {
    realResults: createState("/targeting/real-results-1")
  },
  career: {
    index: createState("/corporate"),
    jobs: createState("/corporate/jobs"),
    position: createState("/corporate/jobs/:id")
  },
  partnership: {
    reebok: {
      unexpected: {
        index: createState("/unexpected"),
        redirect: createState("/unexpected/redirect")
      }
    },
    pampers: {
      index: createState("/pampers"),
      redirect: createState("/pampers/redirect")
    },
    wonderboy: createState("/wonderboy"),
    marcAndre: createState("/marc-andre")
  }
};

export default states;
