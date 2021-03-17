import { emojiIndex } from "emoji-mart";
const once = func => {
  let done = false;
  return (...args) => {
    if (!done) {
      done = true;
      func(...args);
    }
  };
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
const convertTime = (timeString)=>{
  const now = new Date();
  const other = new Date(timeString+" GMT-5");
  const diffTime = (now.getTime() - other.getTime())/1000;
  if(diffTime<60){
    return "1m";
  }else if(diffTime<3600){
    return Math.round(diffTime/60)+"m";
  }else if(diffTime<3600*24){
    return Math.round(diffTime/3600)+"h";
  }else if(diffTime<3600*24*30){
    return Math.round(diffTime/3600/24)+"d";
  }else if(diffTime<3600*24*365){
    let months;
    months = (now.getFullYear() - other.getFullYear()) * 12;
    months -= other.getMonth();
    months += now.getMonth();    
    return months+"M";
  }else{
    return (now.getFullYear() - other.getFullYear()) + "y";
  }
}
const can = (currentUser,permission)=>{
  if(currentUser.type==='admin'&&currentUser.role!=='super'){
    return currentUser.permissions.indexOf(permission)>-1;
  }
  else if(currentUser.type==='admin'&&currentUser.role==='super'){
    return true;
  }
}
export default function lastDate({ lastDate, lastMessage, updatedDate }) {
  const monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const msgLastDate = lastMessage ? new Date(lastDate * 1000) : new Date(updatedDate)
  const msgYear = msgLastDate.getFullYear()
  const msgMonth = msgLastDate.getMonth()
  const msgDate = msgLastDate.getDate()
  const msgDay = msgLastDate.getDay()
  const msgHours = msgLastDate.getHours()
  const msgMinutes = msgLastDate.getMinutes()
  const LastDate = new Date()
  const curYear = LastDate.getFullYear()
  const curMonth = LastDate.getMonth()
  const curDate = LastDate.getDate()
  const curDay = LastDate.getDay()

  if (curYear > msgYear) {
    return `${monthes[msgMonth]} ${msgDate}, ${msgYear}`
  } else if (curMonth > msgMonth) {
    return `${monthes[msgMonth]} ${msgDate}`
  } else if (curDate > (msgDate + 6)) {
    return `${monthes[msgMonth]} ${msgDate}`
  } else if (curDay > msgDay) {
    return `${days[msgDay]}`
  } else {
    return `${(msgHours > 9) ? msgHours : ('0' + msgHours)}:${(msgMinutes > 9) ? msgMinutes : ('0' + msgMinutes)}`
  }
}
export function getTime(dateSent) {
  const date = dateSent ? new Date(dateSent * 1000) : new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${(hours > 9) ? hours : ('0' + hours)}:${(minutes > 9) ? minutes : ('0' + minutes)}`
}

export {once, colonsToUnicode, convertTime, can, lastDate};