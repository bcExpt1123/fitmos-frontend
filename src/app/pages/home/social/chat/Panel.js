/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React,{ useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import ListDialog from "./ListDialog";
// import NewPrivateDialog from "./NewPrivateDialog";
import NewGroupDialog from "./NewGroupDialog";
import AddUsers from "./AddUsers";
import Channel from "./Channel";
// import ChatService from "../../services/chat-service";

const ChatPanel = ({show})=> {
  const dispatch = useDispatch();
  const route = useSelector(({dialog})=>dialog.route);
  return (
    <Modal
      show={show}
      animation={true}
      className="fitemos-chat-panel"
      backdrop={false}
      // dialogAs
    >
      <Modal.Body>
        <div id="fitemos_chat_panel" className="fitemos-chat-panel">
          <a
            href="#"
            className="fitemos-chat-panel__close"
            id="fitemos_chat_panel_close_btn"
          >
            <i className="flaticon2-delete" />
          </a>
          <div className="notification-title">
            Chat
          </div>
          <div className="fitemos-chat-panel__content">
            {route==='list'&&<ListDialog />}
            {/* {route==='new'&&<NewPrivateDialog />} */}
            {route==='newGroup'&&<NewGroupDialog />}
            {route==='addUsers'&&<AddUsers />}
            {route==='channel'&&<Channel />}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default ChatPanel;