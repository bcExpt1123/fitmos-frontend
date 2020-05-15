import { connect } from "react-redux";

import PasswordResetForm, {
  mapStateToProps,
  mapDispatchToProps
} from "./PasswordResetForm";

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetForm);
