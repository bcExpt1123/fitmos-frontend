import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import SettingsPage, {
  mapStateToProps,
  mapDispatchToProps
} from "./SettingsPage";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SettingsPage));
