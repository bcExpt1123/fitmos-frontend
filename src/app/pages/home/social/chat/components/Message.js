import React, { useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getTime } from '../../../../../../lib/common';
import MessageSendState from './MessageStatus';
import Avatar from '../../../components/Avatar';
import { GetMaxWidthMsg } from '../helper/utils';
import Line from './DisplayLine';
import { setItemValue } from "../../../redux/dialogs/actions";

function Message({message, whoIsSender, widthScroll}) {
  // 1 - current & 2 - other
  const [isModal, setIsModal] = useState(false);

  const [selectedImg, setSelectedImg] = useState(null);

  let  people = useSelector(({people})=>people.people);
  const privateProfiles = useSelector(({people})=>people.privateProfiles);
  people = [...people,...privateProfiles];
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);
  const sender = people.find(customer=>customer.chat_id == message.sender_id);
  const dispatch = useDispatch();
  const selectMessage=()=>{
    dispatch(setItemValue({name:'selectedMessageId', value:message.id}));
    dispatch(setItemValue({name:'openDropdownMenu', value:true}));
    dispatch(setItemValue({name:'selectedMessageTop', value:rightMenuRef.current.getClientRects()[0].top + rightMenuRef.current.getClientRects()[0].height}));
  }
  const rightMenuRef  = useRef();
  const _renderAsStr = (whoIsSender) => {
    if (whoIsSender === 1) {
      return (
        <>
          <span style={{ wordWrap: 'break-word' }}>
            <Line line={message.body} />
            <i className="fal fa-ellipsis-v dropbtn"  ref={rightMenuRef} onClick={selectMessage}/>
          </span>
          <span className="chat-message-right-footer">
            <span>
              <>
                {getTime(message.date_sent)}
              </>
              <>
                {<MessageSendState send_state={message.send_state} />}
              </>
            </span>
          </span>
        </>
      )
    } else {
      return (
        <>
          <span style={{ wordWrap: 'break-word' }}><Line line={message.body} messageId={message.id}/></span>
          <span className="chat-message-left-footer">
            <span>{getTime(message.date_sent)}</span>
          </span>
        </>
      )
    }
  }

  const renderZoomImg = (event, message) => {
    event.preventDefault()
    setSelectedImg(message.attachment[0]);
    setIsModal(false);
  }

  const handleCloseModal = () => setIsModal(false);

  const _renderAsAttachment = () => {
    return (
      <>
        <div className="chat-message-container-attachment">
          <div style={{
            backgroundImage: `url(${message.attachment[0].url})`,
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            border: '1px solid #cbcbcb',
            cursor: 'pointer'
          }}
            onClick={(e) => renderZoomImg(e, message)}
          />
        </div>
        {whoIsSender === 1 ?
          <div className="chat-message-right-footer">
            <span>
              <>
                {getTime(message.date_sent)}
              </>
              <>
                {<MessageSendState send_state={message.send_state} />}
              </>
            </span>
          </div> :
          <div className="chat-message-left-footer">
            <span>{getTime(message.date_sent)}</span>
          </div>
        }
      </>
    )
  }
  const withMsg = new GetMaxWidthMsg(widthScroll)

  return (
    <>
      {isModal &&
        <Modal
          isOpen={isModal}
          onRequestClose={handleCloseModal}
          ariaHideApp={false}
          overlayClassName="overlay-chat-attachment"
        >
          <div className="active-window-modal-attachment">
            <i className="fa fa-times-circle"  color={'white'} onClick={handleCloseModal}/>
            <img
              src={selectedImg.url}
              width={selectedImg.width}
              height={selectedImg.height}
              alt="zoomImg"
            />
          </div>
        </Modal>
      }
      <div className="chat-message-layout">
        {whoIsSender === 0 ?<div className="chat-date">
            {message.body}
          </div>:
          whoIsSender === 1 ?
            <div className="chat-message-wrap chat-message-wrap-right">
              <div style={{ maxWidth: `${withMsg.currentSender}px` }} className="chat-message-container-position-right">
                {message.attachment ?
                  _renderAsAttachment(1) :
                  _renderAsStr(1)
                }
              </div>
            </div> :
            <div className="chat-message-wrap chat-message-wrap-left">
              {selectedDialog.type===2&&
                <div className="chat-message-avatar">
                  <Avatar pictureUrls={sender.avatarUrls} size="xs" />
                </div>
              }
              <div style={{ maxWidth: `${message.attachment ? withMsg.otherSender + 60 : withMsg.otherSender}px` }} className="chat-message-container-position-left">
                {selectedDialog.type===2&&
                  <div>
                    <NavLink
                      to={"/"+sender.username}
                      className={"link-profile"}
                    >
                      <span className="username">@{sender.username}</span>&nbsp;<span className="fullname">{sender.first_name} {sender.last_name}</span>
                    </NavLink>
                  </div>
                }                
                {message.attachment ?
                  _renderAsAttachment(2) :
                  _renderAsStr(2)
                }
              </div>
            </div>
        }
      </div>
    </>
  )
}
export default Message;
// export default React.memo(Message, (props, nextProps) => {
//   return false;
//   // if(!nextProps.extendedState.ids.includes(nextProps.message.id))return true;
// });
