/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React,{useEffect} from "react";
import { useSelector } from "react-redux";
import KTOffcanvas from "../../../../../../_metronic/_assets/js/offcanvas";

const ChatToggler = ()=>{
  useEffect(()=>{
    // eslint-disable-next-line
    const panel = document.getElementById("fitemos_chat_panel");

    // eslint-disable-next-line
    const offCanvas = new KTOffcanvas(panel, {
      overlay: true,
      baseClass: "fitemos-chat-panel",
      closeBy: "kt_quick_panel_toggler_btn",
      toggleBy: "fitemos_chat_panel_toggler_btn"
    });
    
  });
  const notifications = useSelector(({notification})=>notification.notifications);
  const lastId = useSelector(({notification})=>notification.notificationViewLastId);
  return (
    <>
      <span
        className="kt-header__topbar-icon"
        id="fitemos_chat_panel_toggler_btn"
      >
        <i className="fal fa-comment-lines" />
      </span>
      {notifications.length > 0 && lastId != notifications[0].id &&
        <span className="number">&nbsp;</span>
      }
    </>
  );
}
export default ChatToggler;