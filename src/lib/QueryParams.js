class QueryParams {
  static keyToParts(name) {
    return name.split(/[-_]+|(?=[A-Z])/).map(part => part.toLowerCase());
  }

  static keyToDashCase(name) {
    // don't convert capitalized parameters
    if (/^[A-Z_-]+$/.test(name)) {
      return [name];
    }

    const parts = QueryParams.keyToParts(name);
    return parts.join("-");
  }

  searchParams = undefined;

  constructor(initParams) {
    const params = Object.keys(initParams).reduce(
      (result, key) => ({
        ...result,
        [QueryParams.keyToDashCase(key)]: initParams[key]
      }),
      {}
    );
    this.searchParams = new URLSearchParams(params);
  }

  get(name) {
    return this.searchParams.has(name)
      ? this.searchParams.get(name)
      : undefined;
  }

  toString() {
    return this.searchParams.toString();
  }
}

export default QueryParams;
