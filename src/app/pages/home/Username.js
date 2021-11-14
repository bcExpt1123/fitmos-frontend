import React, { useState, useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import OneColumn from "./layouts/One";
import { useHistory } from "react-router-dom";
import {findUsername, setItemValue} from "./redux/people/actions";
import Company from "./ShopPage/Company";
import Customer from "./Customer";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const UsernamePage = ({match}) => {
  const dispatch = useDispatch();
  const username = useSelector(({people})=>people.username);
  const history = useHistory();
  useEffect(()=>{
    dispatch(findUsername(match.params.username))
  },[match]);
  if(!username){
    history.push("/");
  }
  useEffect(()=>{
    return ()=>{
      // dispatch(setItemValue({name:'username',value:'username'}));
    }  
  },[])
  return (<>
      {username?<>
        {username.type === 'company'&&(
          <OneColumn>          
            <Company id={username.id}/>
          </OneColumn>
        )}
        {username.type === 'customer'&&(
          <Customer id={username.id} upath={match.params.username}/>
        )}
      </>:
      <>
        <OneColumn>
          Error
        </OneColumn>  
      </>}
  </>
)};

export default UsernamePage;
