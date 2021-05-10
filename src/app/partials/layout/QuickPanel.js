/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, {useState, useEffect} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { useHistory } from "react-router-dom";
import { accept, reject, setItemValue } from "../../pages/home/redux/notification/actions";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import { convertTime } from "../../../lib/common";
import ViewableMonitor from '../../pages/home/components/ViewableMonitor';

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
};
const FollowItem = ({request})=>{
  const dispatch = useDispatch();
  const handleReject = ()=>{
    dispatch(reject(request.id));
  }
  const handleAccept = ()=>{
    dispatch(accept(request.id));
  }
  return (
    <span className="kt-notification-v2__item">
      <div className="kt-notification-v2__item-icon">
        <img src={request.customer.avatarUrls['small']} alt={request.customer.first_name +' '+ request.customer.last_name}/>
      </div>
      <div className="kt-notification-v2__itek-wrapper">
        <div className="kt-notification-v2__item-title">
          {request.customer.first_name +' '+ request.customer.last_name}
        </div>
        <div className="kt-notification-v2__item-desc">
          {request.customer.username}
        </div>
        <div className="actions">
          <button className="btn btn-custom-secondary" onClick={handleReject}>Reject</button>
          <button className="btn btn-custom-third" onClick={handleAccept}>Accept</button>
        </div>
      </div>
    </span>    
  )
}
const convertContent = (content)=>{
  const regexp = /(<b>.+?<\/b>)/g;
  const singleReg = /(<b>(.+?)<\/b>)/g;
  let newWords = content.split(regexp);  
  const jsonWords = newWords.map(newWord=>{
    let word;
    const matches = [...newWord.matchAll(singleReg)];    
    if(matches.length>0){
      word = {
        type:"bold",
        word:matches[0][2]
      }
    }else{
      word = {
        type:"span",
        word:newWord
      }
    }
    return word;
  })
  return <>
    {
      jsonWords.map((word, index)=><span key={index} className={classnames({"font-weight-bold":word.type=="bold"})}>
        {word.word}
      </span>)
    }
  </>
}
const QuickPanel = ()=> {
  const followRequests = useSelector(({notification})=>notification.follows);
  const [expand, setExpand] = useState(false);
  const notifications = useSelector(({notification})=>notification.notifications);
  const dispatch = useDispatch();
  const changeNotificationViewLastId = ()=>{
    let lastId = 0;
    if(notifications.length>0){
      lastId = notifications[0].id;
    }
    dispatch(setItemValue({name:"notificationViewLastId",value:lastId}));
  }
  const [visible, setVisible] = useState(false);
  const visibleChange = (status)=>{
    setVisible(status);
    if(status){
      changeNotificationViewLastId();
    }
  }
  useEffect(()=>{
    if(visible){
      changeNotificationViewLastId();
    }
  }, [notifications.length]);
  const history = useHistory();
  const clickNotification = (notification)=>{
    if(notification.action_type === "customer"){
      if(notification.object_type === 'post'){
        history.push("/posts/"+ notification.object_id);
      }else{
        history.push("/"+ notification.action.username);
      }
    }else if(notification.action_type === "fitemos"){
      if(notification.type === "payment_renewal"){
        history.push("/settings/subscriptions");
      }
    }
  }
  return (
    <div id="kt_quick_panel" className="kt-quick-panel">
      <a
        href="#"
        className="kt-quick-panel__close"
        id="kt_quick_panel_close_btn"
      >
        <i className="flaticon2-delete" />
      </a>
      <div className="notification-title">
        Notificaciones
      </div>
      <div className="kt-quick-panel__content">
        <PerfectScrollbar
          options={perfectScrollbarOptions}
          style={{
            maxHeight: "calc(100vh - 100px)",
            position: "relative"
          }}
        >
          <div className="kt-notification-v2">
          { (notifications.length === 0 && followRequests.length ===0 )?
            <div className="notification-title">
              No Notificaciones
            </div>              
            :
            <>
            {followRequests.length>0&&(followRequests.length==1?<>
                <FollowItem request={followRequests[0]} />
              </>:
                expand?
                  followRequests.map(request=>
                    <FollowItem request={request} key={request.id}/>
                    )
                  :
                  <span className="kt-notification-v2__item cursor-pointer" onClick={()=>setExpand(true)}>
                    <div className="kt-notification-v2__item-icon">
                      <img src={followRequests[0].customer.avatarUrls['small']} alt={followRequests[0].customer.first_name +' '+ followRequests[0].customer.last_name}/>
                    </div>
                    <div className="kt-notification-v2__itek-wrapper">
                      <div className="kt-notification-v2__item-title">
                        Follow Request
                      </div>
                      <div className="kt-notification-v2__item-desc">
                        Approve or ignore requests
                      </div>
                    </div>
                  </span>
            )}
            <ViewableMonitor visibleChange = {visibleChange}>
            {isViewable =>
              <span>&nbsp;</span>
            }
            </ViewableMonitor>
            
              {notifications.map(notification=>
                <span className="kt-notification-v2__item cursor-pointer" key={notification.id} onClick={()=>clickNotification(notification)}>
                  <div className="kt-notification-v2__item-icon">
                    {notification.action_type === "fitemos"?
                      <img src={toAbsoluteUrl('/media/logos/logo-mini-md.png')} />
                      :
                      <img src={notification.action.avatarUrls['small']} alt={notification.action.first_name +' '+ notification.action.last_name}/>
                    }                  
                  </div>
                  <div className="kt-notification-v2__itek-wrapper">
                    <div className="kt-notification-v2__item-desc" style={{color:"#0C2A49"}}>
                      {convertContent(notification.content)}
                      <span style={{color:"#707C89",display:"block",marginLeft:'-5px'}}>&nbsp;&nbsp;{convertTime(notification.created_at)}</span>
                    </div>
                  </div>
                </span>
              )}            
            </>
            }
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  );
}
export default QuickPanel;