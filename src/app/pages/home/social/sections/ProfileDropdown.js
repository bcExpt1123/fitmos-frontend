import React,{useState} from "react";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "../../components/DropDown";
import ReportModal from "./ReportModal";
import { block, unblock, mute, unmute } from "../../redux/notification/actions";

const ProfileDropdown = ()=>{
  const customer = useSelector(({people})=>people.username);
  const blockDisabled = useSelector(({ notification }) => notification.blockDisabled);
  const muteDisabled = useSelector(({ notification }) => notification.muteDisabled);
  const dispatch = useDispatch();
  const handleUnblock = ()=>{
    dispatch(unblock(customer.id));
    setRefresh(refresh + 1);
  }
  const handleBlock = ()=>{
    dispatch(block(customer.id));
    setRefresh(refresh + 1);
  }
  const handleUnmute = ()=>{
    dispatch(unmute(customer.id));
    setRefresh(refresh + 1);
  }
  const handleMute = ()=>{
    dispatch(mute(customer.id));
    setRefresh(refresh + 1);
  }
  const [refresh, setRefresh] = useState(false);
  const handleReport=()=>{
    setShowReportModal(true);
    setRefresh(refresh + 1);
  }  
  const [showReportModal, setShowReportModal] = useState(false);
  const onReportModalClose = ()=>{
    setShowReportModal(false);
  }  
  return (
    <>
      <DropDown refresh={refresh}>
        {({show,toggleHandle,setShow})=>(
          <div className=" dropdown">
            <button type="button" className={"btn btn-custom-secondary dropbtn"} onClick={toggleHandle}>
              <i className="fal fa-ellipsis-h dropbtn" />
            </button>
            <div className={classnames("dropdown-menu",{show})}>
              {customer.relation === 'blocked'?
                <a className={"dropdown-item"} onClick={()=>{handleUnblock();setShow(false)}} disabled={blockDisabled}>Unblock</a>
                :
                <>
                  <a className={"dropdown-item"} onClick={()=>{handleBlock();setShow(false)}} disabled={blockDisabled}>Block</a>
                  {customer.relation === 'muted'?
                    <a className={"dropdown-item"} onClick={()=>{handleUnmute();setShow(false)}} disabled={muteDisabled}>Unmute</a>
                  :
                    <a className={"dropdown-item"} onClick={()=>{handleMute();setShow(false)}} disabled={muteDisabled}>Mute</a>
                  }
                </>
              }
              <a className={"dropdown-item"} onClick={handleReport}>Report</a>
            </div>
          </div>    
        )}
      </DropDown>
      <ReportModal type={"profile"} customer={customer} show={showReportModal} onClose={onReportModalClose}/>
    </>
  )
}
export default ProfileDropdown;