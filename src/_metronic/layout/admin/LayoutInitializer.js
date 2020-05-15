import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayoutSplashScreen } from "./LayoutContext";
import * as builder from "../../ducks/builder";
import MenuConfig from "./MenuConfig";

const hasPermissions = (permissions,can)=>{
  if(Array.isArray(can)){
   for(let i=0;i<can.length;i++){
    if(permissions.indexOf(can[i])>-1) return true;
   }
   return false;         
  }else{
    return permissions.indexOf(can)>-1;
  }
}
/**
 * Used to synchronize current layout `menuConfig`, `layoutConfig` and
 * `htmlClassService` with redux store.
 */
export default function LayoutInitializer({
  children,
  layoutConfig,
  htmlClassService
}) {
  const dispatch = useDispatch();
  const builderState = useSelector(({ builder }) => builder);
  const currentUser = useSelector(({ auth }) => auth.currentUser);

  useEffect(() => {
    let menuConfig = JSON.parse(JSON.stringify(MenuConfig));
    if(currentUser.type=='admin'&&currentUser.role!='super'){
      let items = menuConfig.aside.items;
      let assignItems = [];
      for(let i=0;i<items.length;i++){
        if(items[i].can){
          if(hasPermissions(currentUser.permissions,items[i].can))assignItems.push(items[i]);
        }else{
          assignItems.push(items[i]);
        }
      }
      menuConfig.aside.items=assignItems;
    }
    dispatch(builder.actions.setMenuConfig(menuConfig));
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (layoutConfig.demo !== builderState.layoutConfig.demo) {
      dispatch(builder.actions.setLayoutConfigs(layoutConfig));
    }
  }, [dispatch, builderState, layoutConfig]);

  useEffect(() => {
    dispatch(builder.actions.setHtmlClassService(htmlClassService));
  }, [dispatch, htmlClassService]);

  return htmlClassService === builderState.htmlClassServiceObjects ? (
    // Render content when `htmlClassService` synchronized with redux store.
    <>{children}</>
  ) : (
    // Otherwise sow loading splash screen.
    <LayoutSplashScreen />
  );
}
