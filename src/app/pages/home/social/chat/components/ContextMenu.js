import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { deleteGroupDialog, setItemValue, editGroupDialog, leaveGroupDialog } from "../../../redux/dialogs/actions"; 
const useContextMenu = (wrapper) => {
  const [xPos, setXPos] = useState("0");
  const [yPos, setYPos] = useState("0");
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      setXPos(e.clientX);
      setYPos(e.clientY);
      setShowMenu(true);
    },
    [setXPos, setYPos]
  );
  const dispatch = useDispatch();
  const editGroupDialogAction = ()=>{
    console.log('editGroupDialog');
    dispatch(editGroupDialog({route:'editGroup',backRouteEditDialog:'list'}));
  }
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const leaveGroupDialogAction = ()=>{
    console.log('leaveGroupDialog');
    dispatch(deleteGroupDialog({id:currentUser.chat_id}));
  }
  const deleteGroupDialogAction = ()=>{
    dispatch(deleteGroupDialog({id:currentUser.chat_id}));
  }

  const handleClick = useCallback((e) => {
    showMenu && setShowMenu(false);
    if(e.target.tagName == "LI"){
      switch(e.target.dataset.action){
        case "editGroupDialogAction":
          editGroupDialogAction();
          break;
        case "leaveGroupDialogAction":
          leaveGroupDialogAction();
          break;
        case "deleteGroupDialogAction":
          deleteGroupDialogAction();  
        }
      
    }
  }, [showMenu]);

  useEffect(() => {
    if(wrapper && wrapper.current){
      wrapper.current.addEventListener("click", handleClick);
      wrapper.current.addEventListener("contextmenu", handleContextMenu);
    }
    return () => {
      if(wrapper && wrapper.current){
        wrapper.current.addEventListener("click", handleClick);
        wrapper.current.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  });

  return { xPos, yPos, showMenu };
};
const ContextMenu = ({ children, wrapper }) => {
  const { xPos, yPos, showMenu } = useContextMenu(wrapper);
  let top=0, left=0;
  if(wrapper.current){
    top = yPos;
    left = xPos-wrapper.current.getClientRects()[0].left;
  }
  const menuRef = useRef();
  useEffect(()=>{
    if(menuRef.current.style.opacity === '0')menuRef.current.style.opacity = 1;
  },[xPos,xPos]);
  return (
    <div
      className="chat-content-menu"
      style={{ opacity: !showMenu ? 0 : 1 }}
      ref={menuRef}
    >
      {showMenu ? (
        <div
          className="menu-container"
          style={{
            top: top+"px",
            left: left+"px",
          }}
        >
          {children}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ContextMenu;