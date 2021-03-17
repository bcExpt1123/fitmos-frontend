/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React,{useEffect} from "react";
import { useSelector } from "react-redux";
import KTOffcanvas from "../../../../../../_metronic/_assets/js/offcanvas";

const NotificationToggler = ()=>{
  useEffect(()=>{
    // eslint-disable-next-line
    const panel = document.getElementById("kt_quick_panel");

    // eslint-disable-next-line
    const offCanvas = new KTOffcanvas(panel, {
      overlay: true,
      baseClass: "kt-quick-panel",
      closeBy: "kt_quick_panel_close_btn",
      toggleBy: "kt_quick_panel_toggler_btn"
    });
  });
  const notifications = useSelector(({notification})=>notification.notifications);
  const lastId = useSelector(({notification})=>notification.notificationViewLastId);
  return (
    <>
      <span
        className="kt-header__topbar-icon"
        id="kt_quick_panel_toggler_btn"
      >
        <i className="fal fa-bell" />
      </span>
      {notifications.length > 0 && lastId != notifications[0].id &&
        <span className="number">&nbsp;</span>
      }
    </>
  );
}
export default NotificationToggler;