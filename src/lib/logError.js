export function logError(error, meta = {}) {
  if (window.TrackJS) {
    window.TrackJS.track({ message: error, meta });
  }
}
