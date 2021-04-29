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
    var options = { weekday: 'long', month: 'short', day: 'numeric',hour:'numeric',minute:'2-digit',hour12:true };    
    return other.toLocaleDateString('es-ES', options);
      // return Math.round(diffTime/3600/24)+"d";
  }else if(diffTime<3600*24*365){
    var options = { year:'numeric',weekday: 'long', month: 'short', day: 'numeric',hour:'numeric',minute:'2-digit',hour12:true };    
    return other.toLocaleDateString('es-ES', options);
    // return (now.getFullYear() - other.getFullYear()) + "y";
  }
}
const convertTimeSeconds = (diffTime)=>{
  const now = new Date();
  const other =  now.setTime(now.getTime() - diffTime * 1000);
  if(diffTime<1800){
    return "en línea";
  }else if(diffTime<3600){
    return "Podemos borrar esto "+Math.round(diffTime/60)+"m ";
  }else if(diffTime<3600*24){
    return "Podemos borrar esto "+Math.round(diffTime/3600)+"h ";
  }else if(diffTime<3600*24*30){
    return "Podemos borrar esto "+Math.round(diffTime/3600/24)+"d ";
  }else if(diffTime<3600*24*365){
    let months;
    months = (now.getFullYear() - other.getFullYear()) * 12;
    months -= other.getMonth();
    months += now.getMonth();    
    return "Podemos borrar esto "+months+"M ";
  }else{
    return (now.getFullYear() - other.getFullYear()) + "y ";
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
export function getSpanishDate(dateSent) {
  const date = dateSent ? new Date(dateSent * 1000) : new Date()
  var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };    
  const today = (new Date()).toLocaleDateString('es-ES', options);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toLocaleDateString('es-ES', options);
  const dateString = date.toLocaleDateString('es-ES', options);
  if(today === dateString) return "hoy";
  if(yesterdayString === dateString) return "ayer";
  return dateString;
}

export function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
  while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
const resizeImage = (settings)=>{
  const file = settings.file;
  const maxSize = settings.maxSize;
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement('canvas');
  const dataURItoBlob = function (dataURI) {
      const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
          atob(dataURI.split(',')[1]) :
          unescape(dataURI.split(',')[1]);
      const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);
      for (var i = 0; i < max; i++)
          ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], { type: mime });
  };
  const resize = function () {
      let width = image.width;
      let height = image.height;
      console.log(width, height);
      if (width > height) {
          if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
          }
      } else {
          if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
          }
      }
      console.log(width, height);
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      return dataURItoBlob(dataUrl);
  };
  return new Promise(function (ok, no) {
      if (!file.type.match(/image.*/)) {
          no(new Error("Not an image"));
          return;
      }
      reader.onload = function (readerEvent) {
          image.onload = function () { return ok(resize()); };
          image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
  });
}
const getImageMeta = (url, callback)=>{   
  var img = new Image();
  img.addEventListener("load", function(){
    if(callback)callback(this.naturalWidth, this.naturalHeight)
  });
  img.src = url;
}
export {once, colonsToUnicode, convertTime,convertTimeSeconds, can, lastDate, resizeImage, getImageMeta};