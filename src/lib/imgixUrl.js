const defaultOptions = {
  auto: "format,compress"
};

const imgixUrl = (src = "", options = {}) => {
  const mergedOptions = Object.assign({}, defaultOptions, options);
  const query = new URLSearchParams(mergedOptions).toString();

  return `${src}?${query}`;
};

export { imgixUrl };
