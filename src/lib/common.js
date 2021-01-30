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

export {once, colonsToUnicode};