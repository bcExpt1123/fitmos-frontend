import { connect } from "react-redux";

import RegistrationForm, {
  mapStateToProps,
  mapDispatchToProps
} from "./RegistrationForm";

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
