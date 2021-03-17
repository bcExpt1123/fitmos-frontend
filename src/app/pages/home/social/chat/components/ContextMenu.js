import React, { useEffect, useState, useCallback } from 'react'

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

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    wrapper.current.addEventListener("click", handleClick);
    wrapper.current.addEventListener("contextmenu", handleContextMenu);
    return () => {
      wrapper.current.addEventListener("click", handleClick);
      wrapper.current.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu };
};
const ContextMenu = ({ children, wrapper }) => {
  const { xPos, yPos, showMenu } = useContextMenu(wrapper);
  let top=0, left=0;
  if(wrapper.current){
    top = yPos-wrapper.current.getClientRects()[0].top + wrapper.current.getClientRects()[0].height;
    left = xPos-wrapper.current.getClientRects()[0].left;
    console.log(top, left, wrapper.current.getClientRects()[0]);
  }
  return (
    <div
      style={{ opacity: !showMenu ? 0 : 1 }}
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