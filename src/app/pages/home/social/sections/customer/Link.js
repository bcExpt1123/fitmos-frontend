import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { findPopupCustomer } from "../../../redux/people/actions";
import { NavLink } from "react-router-dom";

const LinkProfile = ({id, display, username})=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const popupCustomers = useSelector(({ people })=> people.popupCustomers);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!popupCustomer && username == undefined){
      const customer = popupCustomers.find(item=>item.id == id);
      if(customer){
        setPopupCustomer(customer);
      }else{
        dispatch(findPopupCustomer(id));
      }
    }
  },[id, popupCustomers]);
  return (
    <>
      {popupCustomer?
        <NavLink
          to={"/"+popupCustomer.username}
          className={"link-profile follower-button font-weight-bold"}
        >
          {popupCustomer.first_name} {popupCustomer.last_name}
        </NavLink>    
      :
      <>
        {username?
          <NavLink
            to={"/"+username}
            className={"link-profile follower-button font-weight-bold"}
          >
            {display}
          </NavLink>
        :
          <span className="">
            {display}
          </span>
        }
      </>
      }
    </>    
  )
}
export default LinkProfile;