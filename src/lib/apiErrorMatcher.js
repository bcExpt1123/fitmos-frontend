import cond from "lodash/cond";
import conforms from "lodash/conforms";
import constant from "lodash/constant";
import curryRight from "lodash/curryRight";
import identity from "lodash/identity";
import isFunction from "lodash/isFunction";
import find from "lodash/find";
import flow from "lodash/flow";
import matches from "lodash/matches";
import overEvery from "lodash/overEvery";
import property from "lodash/property";
import some from "lodash/some";
import stubTrue from "lodash/stubTrue";

const containsError = error => curryRight(some, 2)({ error });

// Construct matcher which can be used to return error message depending on errors from backend (rails)
// Example:
// * api response:
//   ```
//   {
//     errors: {
//       base: [
//         { error: "account_not_confirmed" }
//       ],
//       password: [
//         { error: "invalid" }
//       ],
//       age: [
//         { error: "greater_than", value: "10", count: 18 }
//       ]
//     }
//   }
//   ```

// * call:
//   ```
//   const mapApiErrors = apiErrorMatcher(
//     [
//       // for field with error return given message
//       { field: 'base', error: 'account_not_confirmed', message: 'account-not-confirmed' },
//       // for any error on field return given message
//       { field: 'password', message: 'password-invalid' },
//       // for field with error call function passing found error to construct message
//       { field: 'age', error: 'greater_than', message: (error) => { id: 'age', min: error.count } }
//     ],
//     // default error message when none above matches
//     'error',
//   );
//   const msg = mapApiErrors(response.data.errors)
//   ```
const apiErrorMatcher = (errorConfig, defaultMsg = null) => {
  // map errorConfig to _.cond predicates and functions
  const conditions = errorConfig.map(
    ({ field, error, predicate = stubTrue, message }) => [
      // predicate
      overEvery([
        conforms({ [field]: error ? containsError(error) : stubTrue }),
        conforms({ [field]: predicate })
      ]),

      // function to call
      isFunction(message)
        ? // if it's a function find error object from given property, and call function with that object
          // (or whole list of validation errors if no `error` specified)
          // useful for when error contains additional validation hints
          flow(
            property(field),
            error ? curryRight(find, 2)(matches({ error })) : identity,
            message
          )
        : // if it's string return the string itself
          constant(message)
    ]
  );

  // add default matcher if configured
  if (defaultMsg) {
    conditions.push([stubTrue, constant(defaultMsg)]);
  }
  return cond(conditions);
};

export default apiErrorMatcher;
