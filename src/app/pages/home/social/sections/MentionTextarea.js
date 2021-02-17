import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mention, MentionsInput } from "react-mentions";
import { StylesViaJss } from "substyle-jss";
import classnames from "classnames";
// import CommentParagraph from "./CommentParagraph";
import { NimblePicker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import data from "emoji-mart/data/google.json";
import Avatar from "../../components/Avatar";
import { isMobile } from '../../../../../_metronic/utils/utils';

export default function MentionTextarea({content, setContent, submit,commentForm}) {
  const [comment, setComment] = useState(content);
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiPicker = useRef(null);
  const filterPeople=(search, callback)=>{
    if(search.length>1){
      const filteredPeople = users.filter((customer)=>customer.display.toLowerCase().includes(search));
      callback(filteredPeople.slice(0, 20));
    }else{
      callback(users.slice(0, 20));
    }
  }
  const users = useSelector(({people})=>people.people);  
  const handleSelectEmoji = emoji => {
    setShowEmojis(false);
    setComment(`${comment} ${emoji.native}`);
    setContent(`${comment} ${emoji.native}`);
  };
  const handleChange = event => {
    let text = colonsToUnicode(event.target.value);
    setComment(text);
    setContent(text);
  };

  const colonsToUnicode = text => {
    const colonsRegex = new RegExp("(^|\\s):([)|D|(|P|O|o])+", "g");
    let newText = text;

    let match = colonsRegex.exec(text);

    if (match !== null) {
      let colons = match[2];
      let offset = match.index + match[1].length;

      newText =
        newText.slice(0, offset) + getEmoji(colons) + newText.slice(offset + 2);
    }
    return newText;
  };

  const getEmoji = emoji => {
    let emoj;
    switch (emoji) {
      case "D":
        emoj = emojiIndex.search(":)")[1].native;
        break;
      case ")":
        emoj = emojiIndex.search(":)")[0].native;
        break;
      case "(":
        emoj = emojiIndex.search(":(")[0].native;
        break;
      case "P":
        emoj = emojiIndex.search(":P")[0].native;
        break;
      case "o":
        emoj = emojiIndex.search("Hushed")[0].native;
        break;
      case "O":
        emoj = emojiIndex.search("Hushed")[0].native;
        break;
      default:
        emoj = "";
    }
    return emoj;
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPicker.current && !emojiPicker.current.contains(event.target)) {
        setShowEmojis(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPicker]);
  useEffect(() => {
    if(content == "")setComment("")
  }, [content]);
  const renderPeopleSuggestion = (entry, search, highlightedDisplay, index, focused)=>{
    return <div className={classnames("mention-customers",{focused:focused})}>
      <div className="avatar">
        <Avatar
          pictureUrls={entry.avatarUrls}
          size="xs"
          className={"userAvatar"}
        />
      </div>
      <div className="info">
        <div>{
          Array.isArray(highlightedDisplay.props.children)?
          <>{
            highlightedDisplay.props.children.map((child, index)=><span key={index}>
              {child}
            </span>)
          }
          </>
          :
          <>
            {highlightedDisplay.props.children}
          </>
          }</div>
        <div className="username">{entry.username}</div>
      </div>
      
    </div>
  }
  const handleEnterPress = event =>{
    if(event.keyCode == 13 ) {
      if(event.shiftKey == false){
        event.preventDefault();
        commentForm(event);
      }
    }
  }
  return (
    <StylesViaJss>
      <div className="col-12 py-3">
        <div
          className="comment-input-container px-0 row col-12 mx-auto"
          style={comment ? { border: "1px solid #71cee3" } : {}}
        >
          <div className="col-11 px-0">
            <MentionsInput
              value={comment}
              onChange={handleChange}
              onKeyDown={handleEnterPress}
              className="mentions"
              placeholder="Leave a comment..."
              allowSuggestionsAboveCursor={true}
            >
              <Mention data={filterPeople} renderSuggestion={renderPeopleSuggestion}/>
            </MentionsInput>
            {isMobile()===false&&<>
              {showEmojis ? (
                <span className={"emoji__picker"}  ref={emojiPicker}>
                  <NimblePicker
                    onSelect={handleSelectEmoji}
                    showSkinTones={false}
                    emojiTooltip={false}
                    showPreview={false}
                    sheetSize={32}
                    data={data}
                  />
                </span>
              ) : (
                <button
                  className={"emoji__button"}
                  onClick={() => setShowEmojis(true)}
                >
                  {String.fromCodePoint(0x1f60a)}
                </button>
              )}                
            </>}
          </div>
          <div className="col-1">
            {
              submit&&
                <>
                  <button
                    className="send-text"
                    style={comment ? { color: "#3B5E66" } : {}}
                    type="submit"
                    // onClick={() => {
                    //   // setComments([...comments, comment]);
                    //   setComment("");
                    // }}
                  >
                    POST
                  </button>
                </>
            }
          </div>
        </div>
      </div>
    </StylesViaJss>
  );
}