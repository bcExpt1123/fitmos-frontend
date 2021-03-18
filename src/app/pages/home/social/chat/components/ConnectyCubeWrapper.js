import React,{useState, useEffect} from "react";
import ConnectyCube from 'connectycube';
import ChatService from '../../../services/chat-service';

const ConnectyCubeWrapper = ({children})=>{
  const service = ConnectyCube.service;
  let token;
  if(service && service.sdkInstance.session){
    token = service.sdkInstance.session.token;
  }
  useEffect(()=>{
    if(token){
      ChatService.setUpListeners();
    }else{
      ChatService.autologin();
    }
  },[token]);
  return (
    <>
      {children }
    </>    
  )
}
export default ConnectyCubeWrapper;