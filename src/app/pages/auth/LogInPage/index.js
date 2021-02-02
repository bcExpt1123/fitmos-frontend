import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import LogInPage, { mapStateToProps, mapDispatchToProps } from "./LogInPage";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(LogInPage));
