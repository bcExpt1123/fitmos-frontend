import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItemValue } from "../../redux/post/actions";

const Dropdown = ({children})=>{
  const globalDropdown = useSelector(({post}) => post.dropdown);
  useEffect(()=>{
    if(globalDropdown && !self){
      if(show)setShow(false);
    }
  },[globalDropdown])
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [self, setSelf] = useState(false);
  const toggleHandle = ()=>{
    setShow(!show);
    setSelf(true);
    setTimeout(()=>setSelf(false),100);
    dispatch(setItemValue({name:"dropdown",value:true}));
    setTimeout(()=>dispatch(setItemValue({name:"dropdown",value:false})),100);
  }
  return (
    <>
      {children({show,toggleHandle, setShow}) }
    </>    
  )
}
export default Dropdown;