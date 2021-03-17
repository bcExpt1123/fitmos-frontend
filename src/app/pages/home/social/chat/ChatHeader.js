import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setItemValue } from "../../redux/dialogs/actions"; 

export default function ChatHeader({path,title, children}) {
  const dispatch = useDispatch();
  function goToList() {
    dispatch(setItemValue({name:'route',value:path?path:'list'}));
  }
  return (
    <div className="create-dialog-header">
      <button onClick={goToList}>
        <i className="far fa-chevron-left" />
      </button>
      {title&&<h3>{title}</h3>}
      {children}
    </div>
  )
}