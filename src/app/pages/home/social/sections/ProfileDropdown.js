import React,{useState} from "react";
import classnames from "classnames";
import DropDown from "../../components/DropDown";

const ProfileDropdown = ()=>{
  return (
    <DropDown>
      {({show,toggleHandle,setShow})=>(
        <div className=" dropdown">
          <button type="button" className={"btn btn-custom-secondary dropbtn"} onClick={toggleHandle}>
            <i className="fas fa-ellipsis-h dropbtn" />
          </button>
          <div className={classnames("dropdown-menu",{show})}>
            <a className={"dropdown-item"}>Block</a>
            <a className={"dropdown-item"}>Mute</a>
            <a className={"dropdown-item"}>Report</a>
            <a className={"dropdown-item"} onClick={()=>setShow(false)}>Cancel</a>
          </div>
        </div>    
      )}
    </DropDown>
  )
}
export default ProfileDropdown;