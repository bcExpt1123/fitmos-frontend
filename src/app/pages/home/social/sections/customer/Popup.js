import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import Avatar from "../../../components/Avatar";
import { findPopupCustomer } from "../../../redux/people/actions";
import { setItemValue } from "../../../redux/post/actions";
import DropDown from "../../../components/DropDown";

const PopupProfile = ({id, display})=>{
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
  // const globalDropdown = useSelector(({post}) => post.dropdown);
  // useEffect(()=>{
  //   if(globalDropdown && !self){
  //     if(show)setShow(false);
  //   }
  // },[globalDropdown])
  // const [show, setShow] = useState(false);
  // const [self, setSelf] = useState(false);
  // const toggleHandle = ()=>{
  //   setShow(!show);
  //   setSelf(true);
  //   setTimeout(()=>setSelf(false),100);
  //   dispatch(setItemValue({name:"dropdown",value:true}));
  //   setTimeout(()=>dispatch(setItemValue({name:"dropdown",value:false})),100);
  // }
  return (
    <>
      {popupCustomer?
      <>
        <DropDown >
          {({show,toggleHandle})=>(
            <span className=" dropdown">
              <span className={"font-weight-bold cursor-pointer dropbtn"} onClick={toggleHandle}>
                {popupCustomer.first_name} {popupCustomer.last_name}
              </span>
              <div className={classnames("dropdown-menu popup",{show})}>
                <div>
                  <div className="avatar">
                    <Avatar pictureUrls={popupCustomer.avatarUrls} size="xs" />
                  </div>
                  <div className="info">
                    <div>{popupCustomer.first_name} {popupCustomer.last_name}</div>
                  </div>
                </div>
                <button className="btn btn-custom-secondary">Message</button>
              </div>
            </span>
          )}
        </DropDown>
      </>
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
export default PopupProfile;