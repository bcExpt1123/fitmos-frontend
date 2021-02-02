import { analytics } from "@freeletics/web-package-tracking";

const ensureSlash = string =>
  string.indexOf("/", string.length - 1) !== -1 ? string : `${string}/`;

export default function trackVirtualPageImpression(virtualPath, search) {
  const pathname = virtualPath
    ? `${ensureSlash(window.location.pathname)}${virtualPath}/`
    : window.location.pathname;

  analytics.trackPageImpression({ pathname, search });
}
