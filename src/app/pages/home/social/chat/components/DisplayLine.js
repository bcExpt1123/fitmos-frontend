import React,{useState, useEffect} from "react";
import PostWord from "./PostWord";
import EventoWord from "./EventoWord";

const DisplayLine = ({line, messageId})=>{
  const [words, setWords] = useState([]);
  useEffect(()=>{
    if (line !== "" && line!==undefined && line!==null) {
      const regexp = /(@\[.+?\]\([0-9]+\))/g;
      // const mentionPattern = "(@\[.+?\]\([0-9]+\))";
      const postPattern = `(${window.location.origin}/posts/[0-9]+)`;
      // const postPattern = `http:\/\/localhost:3000\/posts\/[0-9]+`;
      // const regexp = /(@\[.+?\]\([0-9]+\))|http:\/\/localhost:3000\/posts\/[0-9]+/g;
      const eventoPattern = `(${window.location.origin}/eventos/[0-9]+)`;
      const regexpPostPattern = new RegExp(postPattern + '|' + eventoPattern, 'g');
      const mentionReg = /@\[(.+?)\]\(([0-9]+)\)/g;
      const postReg = /(http|https):\/\/(localhost:[0-9]+|www\.fitemos\.com|dev\.fitemos\.com)\/posts\/([0-9]+)/g;
      const eventoReg = /(http|https):\/\/(localhost:[0-9]+|www\.fitemos\.com|dev\.fitemos\.com)\/eventos\/([0-9]+)/g;
      let content = line;
      let newWords;
      if(content.search(mentionReg)>-1){
        newWords = content.split(regexp);
      }else if(content.search(regexpPostPattern)>-1){
        newWords = content.split(regexpPostPattern);
      }else{
        newWords = [content];
      }
      let jsonWords = [];
      // console.log(newWords, line, postPattern);return;
      for(let i = 0; i < newWords.length; i++){
        let word;
        if(newWords[i]!=="" && newWords[i]!==undefined){
          const matches = [...newWords[i].matchAll(mentionReg)];
          if(matches.length>0){
            word = {
              type:"customer",
              word:newWords[i],
              id:matches[0][2],
              display:matches[0][1]
            }
          }else{
            const matches1 = [...newWords[i].matchAll(postReg)];
            if(matches1.length>0){
              word = {
                type:"post",
                word:newWords[i],
                id:matches1[0][3]
              }
            }else{
              const matches2 = [...newWords[i].matchAll(eventoReg)];
              if(matches2.length>0){
                word = {
                  type:"evento",
                  word:newWords[i],
                  id:matches2[0][3]
                }
              }else{
                word = {
                  type:"p",
                  word:newWords[i]
                }
              }
            }
          }
          jsonWords[i] = word;
        }
      }
      setWords(jsonWords);
    }
  },[line]);
  return (
    <>
      {words.map((word, index)=>
        <span key={index}>
          {word.type=="p"&&<>{word.word}</>}
          {word.type=="customer"&&<b>@{word.display}</b>}
          {word.type=="post"&&<PostWord id={word.id} messageId={messageId}/>}
          {word.type=="evento"&&<EventoWord id={word.id} messageId={messageId}/>}
        </span>
      )}
    </>    
  )
}
export default DisplayLine;