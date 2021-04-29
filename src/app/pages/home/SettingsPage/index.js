import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import SettingsPage, {
  mapStateToProps,
  mapDispatchToProps
} from "./SettingsPage";
import "../assets/scss/theme/style.scss";
import "../assets/scss/theme/mbr-additional.css";
import "../assets/scss/dropdown/style.css";
import "../assets/scss/theme/common.scss";
import "../assets/scss/theme/login.scss";
import "../assets/scss/theme/signup.scss";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SettingsPage));
