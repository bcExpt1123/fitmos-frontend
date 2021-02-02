import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import DashboardPage, {
  mapStateToProps,
  mapDispatchToProps
} from "./DashboardPage";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(DashboardPage));
