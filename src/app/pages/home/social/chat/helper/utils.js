import { LayoutProvider } from "recyclerlistview/web";
import ConnectyCube from 'connectycube';
import store from '../../../../../store/store';

export class DialogLayoutUtil {
  static getDialogLayoutProvider(width) {
    return new LayoutProvider(
      () => {
        return "type";
      },
      (type, dim) => {
        dim.width = width;
        dim.height = 75;
      }
    );
  }
}


export class ChatLayoutUtil {
  static getChatLayoutProvider(props) {
    const { width, dialogId, currentUserId } = props
    const fontSize = 16
    const lineHeight = 1.5
    const delta = 20
    const margin = 30
    const maxWidth = new GetMaxWidthMsg(width)
    let footer = 15

    return new LayoutProvider(
      (arr) => {
        return arr;
      },
      (type, dim, index) => {
        if (store.getState().message[dialogId][index] == undefined) return;
        if (store.getState().message[dialogId][index].attachment) {
          // if send messages as attachment
          dim.width = width
          dim.height = 300
          return
        } else {
          // if send messages as string
          let maxWidthMsg
          if (store.getState().message[dialogId][index].sender_id === currentUserId) {
            maxWidthMsg = maxWidth.currentSender
          } else {
            maxWidthMsg = maxWidth.otherSender
          }

          var fakeElem = document.createElement("canvas")
          var ctx = fakeElem.getContext("2d")
          ctx.font = `${fontSize}px 'Open Sans', sans-serif`
          var txt = store.getState().message[dialogId][index].body

          const calcWidth = ctx.measureText(txt).width
          const lines = Math.ceil(calcWidth / (maxWidthMsg - delta))

          dim.width = width
          dim.height = lines * lineHeight * fontSize + margin + footer
        }
      }
    )
  }
}

export class GetMaxWidthMsg {
  constructor(maxScrollWidth) {
    if (maxScrollWidth < 550) {
      this.currentSender = 330
      this.otherSender = 330
    }
    if (maxScrollWidth > 550 && maxScrollWidth < 768) {
      this.currentSender = 500
      this.otherSender = 500
    }
    if (maxScrollWidth > 768 && maxScrollWidth < 960) {
      this.currentSender = 530
      this.otherSender = 530
    }
    if (maxScrollWidth > 960) {
      this.currentSender = 630
      this.otherSender = 630
    }
  }
}

export function getImageLinkFromUID(uid) {
  if (!uid) {
    return null
  }
  try{
    if(ConnectyCube && ConnectyCube.storage)return ConnectyCube.storage.privateUrl(uid);
  }catch(error){
    console.log(error);
  }
  return null;
}


export function preparationAttachment(file) {
  return {
    size: file.size,
    uid: file.uid,
    type: file.content_type,
    name: file.name,
    width: 400,
    height: 400
  }
}
