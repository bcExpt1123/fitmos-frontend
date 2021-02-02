import React from "react";
import UserProfile from "../../../../app/partials/layout/UserProfile";

export default class Topbar extends React.Component {
  render() {
    return (
      <div className="kt-header__topbar">
        <UserProfile showAvatar={false} showHi={true} showBadge={false} />
      </div>
    );
  }
}
