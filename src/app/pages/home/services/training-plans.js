/* eslint import/prefer-default-export: off */

import { http } from "./api";

export function all({
  birthday,
  gender,
  goal,
  level,
  limit,
  locale,
  recommended,
  recommendedPlanSlug
}) {
  const params = [
    ["birthday", birthday],
    ["fitness_level", level],
    ["gender", gender],
    ["goal", goal],
    ["recommended", recommended],
    ["locale", locale],
    ["limit", limit],
    ["recommended_slug", recommendedPlanSlug]
  ]
    .filter(pair => typeof pair[1] !== "undefined")
    .map(pair => pair.map(encodeURIComponent).join("="))
    .join("&");
  return http({
    app: "bodyweight",
    path: `/v5/coach/training_plans?${params}`
  }).then(response => response.data.training_plans);
}
