import React,{useState, useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { http } from "../../../services/api";
import { addPostMessageIds, updateRenderWordsCount } from "../../../redux/dialogs/actions";
import { CUSTOM_POST_TYPES } from "../../../../../../lib/social";

const EventoWord = ({messageId, id})=>{
  const dispatch = useDispatch();
  const [evento, setEvento] = useState(false);
  const convert=(content)=>{
    if(content!="" && content!=null && content!=undefined){
      const regexp = /(@\[.+?\]\([0-9]+\))/g;
      const singleReg = /@\[(.+?)\]\(([0-9]+)\)/g;
      let newWords = content.split(regexp);    
      let convertWords = [];
      for(let i = 0; i < newWords.length; i++){
        let word;
        const matches = [...newWords[i].matchAll(singleReg)];
        if(matches.length>0){
          word = matches[0][1];
        }else{
          word = newWords[i];
        }
        convertWords[i] = word;
      }
      content = convertWords.join(" "); 
      let words = content.split(" ");
      if(words.length>3){
        words = words.slice(0,3);
        return words.join(" ")+'...';
      }
      return words.join(" ");
    }
  }
  useEffect(()=>{
    async function loadPost(){
      const res = await http({
        path:"eventos/"+id
      });
      setEvento(res.data);
    }
    if(evento===null || evento===undefined || evento.id!=id){
      if(id)loadPost();
    }else{
      
    }
  },[id]);
  useEffect(()=>{
    if(messageId!=undefined){
      dispatch(addPostMessageIds(messageId));
    }
  },[])
  const convertChatUrl = (url, postType)=>{
    const object = new URL(url);
    if(object.protocol == 'blob:' )return url;
    if(CUSTOM_POST_TYPES.includes(postType))return url;
    let filename = object.pathname.split('/').reverse()[0];
    const ext = filename.split('.')[1]; 
    let replaceFileName = filename.split('.')[0] + '-500.'+ext;
    return url.replace(filename, replaceFileName);
  }
  const getDimension = (file)=>{
    const width = parseFloat(file.width);
    const height = parseFloat(file.height);
    let currentWidth = 300;
    let currentHeight = 300;
    if(width>height){
      currentHeight = currentWidth/width*height;
    }else{
      currentWidth = currentHeight/height*width;
    }
    return {
      width:currentWidth+"px",
      height:currentHeight+"px",
    }
  }
  const mediaRef = useRef();
  const wordRef = useRef();
  useEffect(()=>{
    if(mediaRef.current){
      dispatch(updateRenderWordsCount());
    }
    if(wordRef.current){
      wordRef.current.parentElement.parentElement.parentElement.className = wordRef.current.parentElement.parentElement.parentElement.className + " fitemos-article";
    }
  },[evento]);
  return (
    <>{evento&&(
        <NavLink
          to={"/eventos/"+evento.id}
          className="article-links"
          ref={wordRef}
        >
          {evento.title?
            <>{evento.title}</>
            :
            <>
            {convert(evento.description)}
            </>    
          }
          {
            evento.images.length>0&&(
              <>
                {evento.images[0].type=="video"&&<video controls src={evento.images[0].url} className="chat-post-video" style={getDimension(evento.images[0])} ref={mediaRef}/>}
                {evento.images[0].type=="image"&&<img src={convertChatUrl(evento.images[0].url,evento.type)} className="chat-post-image" style={getDimension(evento.images[0])} ref={mediaRef}/>}
              </>
            )
          }
        </NavLink>
      )
    }</>
  )
}
export default EventoWord;