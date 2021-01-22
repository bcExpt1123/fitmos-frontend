import React,{useState} from "react";
import classnames from "classnames";

const ProfileDropdown = ()=>{
  const [show, setShow] = useState(false);
  const toggleHandle = ()=>{
    setShow(!show);
  }
  return (
    <div className=" dropdown">
      <button type="button" className={"btn btn-custom-secondary dropbtn"} onClick={toggleHandle}>
        <i className="fas fa-ellipsis-h" />
      </button>
      <div className={classnames("dropdown-menu",{show})}>
        <a className={"dropdown-item"}>Block</a>
        <a className={"dropdown-item"}>Mute</a>
        <a className={"dropdown-item"}>Report</a>
        <a className={"dropdown-item"} onClick={()=>setShow(false)}>Cancel</a>
      </div>
    </div>    
  )
}
export default ProfileDropdown;