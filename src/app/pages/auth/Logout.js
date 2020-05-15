import React, { Component } from "react";
import { logOut as logOutAction } from "../home/redux/auth/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";

class Logout extends Component {
  componentDidMount() {
    this.props.logOut();
  }

  render() {
    const { hasAuthToken } = this.props;

    return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/" />;
  }
}

export default connect(null, { logOut: logOutAction })(Logout);
