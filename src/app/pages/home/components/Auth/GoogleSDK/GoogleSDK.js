import React from "react";
import Google from "../../../../../../lib/Google";

class GoogleSDK extends React.Component {
  state = {
    isSdkLoaded: false
  };

  componentDidMount() {
    Google.load().then(
      () => this.sdkLoaded(),
      () => {
        /* catch initialization problem */
      }
    );
  }

  sdkLoaded() {
    this.setState({ isSdkLoaded: true });
  }

  render() {
    const { isSdkLoaded } = this.state;

    return this.props.children(isSdkLoaded);
  }
}

export default GoogleSDK;
