import { connect } from "react-redux";
import Alert, { mapStateToProps, mapDispatchToProps } from "./Alert";

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
