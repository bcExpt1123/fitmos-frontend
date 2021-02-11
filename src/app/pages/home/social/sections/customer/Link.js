import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { findPopupCustomer } from "../../../redux/people/actions";
import { NavLink } from "react-router-dom";

const LinkProfile = ({id, display})=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const popupCustomers = useSelector(({ people })=> people.popupCustomers);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!popupCustomer){
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
          className={"link-profile follower-button"}
        >
          {popupCustomer.first_name} {popupCustomer.last_name}
        </NavLink>    
      :
      <>
        <span className="">
          {display}
        </span>
      </>
      }
    </>    
  )
}
export default LinkProfile;