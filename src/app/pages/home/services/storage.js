import Cookies from "js-cookie";

const PRESERVED = ["country_code"];
const { get, set, remove } = Cookies;

function clear() {
  Object.keys(get()).forEach(name => {
    if (!PRESERVED.includes(name)) {
      remove(name);
    }
  });
}

export { get, set, remove, clear };
