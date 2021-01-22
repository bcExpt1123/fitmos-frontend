const once = func => {
  let done = false;
  return (...args) => {
    if (!done) {
      done = true;
      func(...args);
    }
  };
};
export {once};