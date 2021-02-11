import React,{useState, useEffect} from "react";
import Line from "./DisplayMentionLine";

const SHOW_LESS_TEXT = 'Show Less';
const SHOW_MORE_TEXT = 'Read More';
const DisplayMentionContent = ({content})=>{
  const [lines, setLines] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(()=>{
    if (content !== "") {
      const newLines = content.split("\n");
      setLines(newLines);
    }
  },[content]);
  const toggleReadMore = ()=>{
    setShow(!show);
  }
  return (
    <>
      {lines.length>2?<>
        {show?<>
          {lines.map((line, index)=>
            (index<lines.length-1)?
              <div key={index}><Line line={line} /></div>
              :
              <div key={index}><Line line={line} />
                <button 
                  onClick={toggleReadMore}
                  className="read-more__button"
                >
                  {SHOW_LESS_TEXT}
                </button>              
              </div>
          )}
        </>:<>
          <div><Line line={lines[0]} /></div>
          <div><Line line={lines[1]} /><span>…</span>
            <button 
              onClick={toggleReadMore}
              className="read-more__button"
            >
              {SHOW_MORE_TEXT}
            </button>          
          </div>
        </>
        }
      </>:<>
        {lines.map((line, index)=>
          <div key={index}><Line line={line} /></div>
        )}      
      </>}
    </>    
  )
}
export default DisplayMentionContent;