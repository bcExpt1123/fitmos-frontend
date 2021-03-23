import React,{ useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import CustomerInfo from "../../profile/components/CustomerInfo";
import { setItemValue } from "../../redux/post/actions";
import { fetchDialogs } from "../../redux/dialogs/actions";
import { sharePost } from "../../redux/messages/actions";
import { getRandomSubarray } from "../../../../../lib/common";

const SharingPostPopup = ()=>{
  const people = useSelector(({people})=>people.people);
  const privateProfiles = useSelector(({people})=>people.privateProfiles);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const [usersWithChat, setUsersWithChat] = useState(()=>people.filter(customer=>customer.chat_id>0 && currentUser.chat_id!=customer.chat_id && !currentUser.customer.blockedChatIds.includes(customer.chat_id)));
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(()=>{
    if(usersWithChat.length>5)return getRandomSubarray(usersWithChat, 5);
    return usersWithChat;
  });
  const postId = useSelector(({post})=>post.selectedPostId);
  const open = useSelector(({post})=>post.openShareCustomers);
  const dispatch = useDispatch();
  const dialogs = useSelector(({dialog})=>dialog.dialogs);
  const [count, setCount] = useState(0);
  useEffect(()=>{
    if(dialogs.length === 0 ){
      if(count<2){
        dispatch(fetchDialogs());
        setCount(count+1);
      }
    }else{
      let userIds = [];
      dialogs.forEach(dialog=>{
        dialog.occupants_ids.forEach(id=>{
          if(currentUser.chat_id!=id && !currentUser.customer.blockedChatIds.includes(id)){
            userIds.push(id);
          }
        })
      });
      userIds = userIds.filter((v, i, a) => a.indexOf(v) === i);  
      const privateUsers = privateProfiles.filter(customer=>customer.chat_id && userIds.includes(customer.chat_id) && !currentUser.customer.blockedChatIds.includes(customer.chat_id))
          .filter(customer=>usersWithChat.findIndex(user=>user.id === customer.id)==-1);
      const items = [...usersWithChat,...privateUsers ];
      setUsersWithChat(items);
      if(items.length>5){
        setCustomers(getRandomSubarray(items, 5));
      }else{
        setCustomers(items);
      }
    }
  },[dialogs]);
  const handleClose=()=>{
    dispatch(setItemValue({name:'openShareCustomers', value:false}));
  }
  const selectCustomer = (customer)=> ()=>{
    dispatch(sharePost({customer,postId}));
    dispatch(setItemValue({name:'openShareCustomers', value:false}));
  }
  const handleChange=(event)=>{
    setSearch(event.target.value);
    if(event.target.value !=''){
      const filteredCustomers = usersWithChat.filter(customer=>customer.display.toLowerCase().includes(event.target.value.toLowerCase()) || customer.username.toLowerCase().includes(event.target.value.toLowerCase()));
      if(filteredCustomers.length>5){
        const items = filteredCustomers.slice(0,5);
        setCustomers(items);
      }
      else setCustomers(filteredCustomers);
    }else{
      setCustomers(getRandomSubarray(usersWithChat, 5));
    }
  }
  return (
    <Modal
      dialogClassName="sharing-post-popup"
      show={open}
      onHide={handleClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Share
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="search-field">
          <i className="far fa-search"/>
          <input placeholder="Buscar...." autoComplete="off" type="text" className="search" value={search} onChange={handleChange}/>
        </div>
        <div className="filtered-customers">
          {
            customers.map(customer=><div key={customer.id} className="cursor-pointer" onClick={selectCustomer(customer)}>
              <CustomerInfo customer={customer} />
              </div>
            )
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default SharingPostPopup;