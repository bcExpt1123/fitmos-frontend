import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import Avatar from "../../components/Avatar";
import Line from "./DisplayMentionLine";

const DisplayMentionContent = ({content})=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [lines, setLines] = useState([]);
  useEffect(()=>{
    if (content !== "") {
      const newLines = content.split("\n");
      setLines(newLines);
    }
  },[content]);
  return (
    <>
      {lines.map((line, index)=>
        <div key={index}><Line line={line} /></div>
        )}
    </>    
  )
}
export default DisplayMentionContent;