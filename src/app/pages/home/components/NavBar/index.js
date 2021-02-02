import { connect } from "react-redux";
import NavBar, { mapStateToProps, mapDispatchToProps } from "./NavBar";

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
