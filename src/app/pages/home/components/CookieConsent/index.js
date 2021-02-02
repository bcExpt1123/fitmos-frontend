import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import CookieConsent, {
  mapStateToProps,
  mapDispatchToProps
} from "./CookieConsent";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CookieConsent));
