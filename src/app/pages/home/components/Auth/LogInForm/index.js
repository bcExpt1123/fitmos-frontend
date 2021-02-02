import { connect } from "react-redux";

import LogInForm from "./LogInForm";
import { logInWithPassword } from "../../../redux/logIn/actions";

const mapStateToProps = state => state.logIn;

const mapDispatchToProps = {
  logInWithPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);
