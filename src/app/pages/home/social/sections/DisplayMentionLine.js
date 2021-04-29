import React,{useState, useEffect} from "react";
import LinkProfile from "./customer/Link";

const DisplayMentionLine = ({line, link})=>{
  const [words, setWords] = useState([]);
  useEffect(()=>{
    if (line !== "") {
      // const regexp = /@\[(.+?)\]\(([0-9]+)\)/g;
      const regexp = /(@\[.+?\]\([0-9]+\))/g;
      const singleReg = /@\[(.+?)\]\(([0-9]+)\)/g;
      let content = line;
      let newWords = content.split(regexp);    
      let jsonWords = [];
      for(let i = 0; i < newWords.length; i++){
        let word;
        const matches = [...newWords[i].matchAll(singleReg)];
        if(matches.length>0){
          word = {
            type:"customer",
            word:newWords[i],
            id:matches[0][2],
            display:matches[0][1]
          }
        }else{
          word = {
            type:"p",
            word:newWords[i]
          }
        }
        jsonWords[i] = word;
      }
      setWords(jsonWords);
    }
  },[line]);
  return (
    <>
      {words.map((word, index)=>
        <span key={index}>
          {word.type=="p"&&<>{word.word}</>}
          {word.type=="customer"&&<LinkProfile id={word.id} display={word.display} link={link}/>}
        </span>
      )}
    </>    
  )
}
export default DisplayMentionLine;