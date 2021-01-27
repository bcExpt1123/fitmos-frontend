/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, {useState} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector, useDispatch } from "react-redux";
import { accept, reject } from "../../pages/home/redux/notification/actions";

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
const QuickPanel = ()=> {
  const followRequests = useSelector(({notification})=>notification.follows);
  const [expand, setExpand] = useState(false);
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
            {/* <a href="#" className="kt-notification-v2__item">
              <div className="kt-notification-v2__item-icon">
                <i className="flaticon2-hangouts-logo kt-font-warning" />
              </div>
              <div className="kt-notification-v2__itek-wrapper">
                <div className="kt-notification-v2__item-title">
                  4.5h-avarage response time
                </div>
                <div className="kt-notification-v2__item-desc">
                  Fostest is Barry
                </div>
              </div>
            </a> */}
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  );
}
export default QuickPanel;