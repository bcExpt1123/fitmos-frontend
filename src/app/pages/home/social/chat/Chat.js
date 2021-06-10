import React, { PureComponent } from 'react'
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import ChatInput from './components/ChatInput';
import { connect } from 'react-redux'
import ChatService from '../../services/chat-service';
import { RecyclerListView, DataProvider } from "recyclerlistview/web"
import { ChatLayoutUtil } from './helper/utils';
import store from '../../../../store/store';
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import Message from './components/Message';


class Chat extends PureComponent {
  scrollWidth = 400
  scrollHeight = 400
  listenerWindowSize = null
  timer = null
  isFetchingMsg = false
  messagesListRef = null
  listenerLazyLoad = false
  needToGetMoreMessage = null


  recycler_Y = 0
  contentHeight = 0
  contentNewOffset = 0

  constructor(props) {
    super(props)
    this.state = {
      isAlredy: true,
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2 || r1.send_state !== r2.send_state
      }),
      layoutProvider: []
    }
    this.currentUserInfo = store.getState().auth.currentUser;
  }


  lazyLoadMessages = (elem, y) => {
    this.recycler_Y = y
    this.contentHeight = elem.nativeEvent.contentSize.height
    if (this.listenerLazyLoad && this.needToGetMoreMessage && y < 2000) {
      this.listenerLazyLoad = false
      ChatService.getMoreMessages(this.props.selectedDialog)
        .then(amountMessages => {
          amountMessages === 21 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
          this.listenerLazyLoad = true
        })
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    if(document.getElementById('chat-body').clientWidth){
      this.scrollWidth = document.getElementById('chat-body').clientWidth
    }else{
      setTimeout(()=>{
        this.scrollWidth = document.getElementById('chat-body').clientWidth
        this.scrollHeight = document.getElementById('chat-body').clientHeight
      },10)
    }
    if(document.getElementById('chat-body').clientHeight){
      this.scrollHeight = document.getElementById('chat-body').clientHeight
    }
    this.getDialogInfo();
  }
  getDialogInfo = async () => {
    ChatService.getMessages(this.props.selectedDialog)
      .catch(e => alert(`Error.\n\n${JSON.stringify(e)}`))
      .then(amountMessages => {
        console.log('amountMessages',amountMessages)
        amountMessages > 20 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
        this.setState({
          isFetchingMsg: true,
          layoutProvider: ChatLayoutUtil.getChatLayoutProvider({
            width: this.scrollWidth,
            dialogId: this.props.selectedDialog._id,
            currentUserId: this.currentUserInfo.id
          }),
          dataProvider: this.state.dataProvider.cloneWithRows(this.props.messages[this.props.selectedDialog._id])
        })
        this.scrollToBottom()
        this.listenerLazyLoad = true
      })
  }

  componentDidUpdate(prewProps) {
    const dialog = {...this.props.selectedDialog}

    if (prewProps.messages[dialog._id] &&
      prewProps.messages[dialog._id] !== this.props.messages[dialog._id]
    ) {
      console.log('{chat} prew props', prewProps.messages[dialog._id])
      console.log('{chat} this props', this.props.messages[dialog._id])

      if (this.props.messages[dialog._id].length) {
        this.setState({
          dataProvider: this.state.dataProvider.cloneWithRows(this.props.messages[dialog._id])
        }, () => { this.updateScrollPosition() }
        )
      }
    }
  }

  updateScrollPosition = () => {
    setTimeout(() => {
      const chatBody = document.getElementById('chat-body');
      if(chatBody && chatBody.children.length>0 && chatBody.children[0].children.length && chatBody.children[0].children[0].children.length>0){
        const getElement = document.getElementById('chat-body').children[0].children[0].children[0].style.height;
        const fullScrollHeight = getElement.slice(0, getElement.length - 2)
        const newOffset = this.recycler_Y + (fullScrollHeight - this.contentHeight)
        this.messagesListRef.scrollToOffset(0, newOffset)
      }
    }, 100)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.scrollWidth = document.getElementById('chat-body').clientWidth
    this.scrollHeight = document.getElementById('chat-body').clientHeight
    if (!this.timer) {
      const dialog = ChatService.getDialogById(this.props.selectedDialog.id)
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
        this.setState({
          isAlredy: true,
          layoutProvider: ChatLayoutUtil.getChatLayoutProvider({
            width: this.scrollWidth,
            dialogId: dialog.id,
            currentUserId: this.currentUserInfo.chat_id
          })
        })
      }, 500)
    }
  }

  sendMessageCallback = async (messageText, img) => {
    const dialog = {...this.props.selectedDialog};
    if (messageText.length <= 0 && !img) return
    // if(editMessageState) {
    //   dispatch(updateMessageBody(messageText));
    // }
    else await ChatService.sendMessage(dialog, messageText, img, this.scrollToBottom)
  }

  _renderMessage = (type, item) => {
    // 1 - current sender & 2 - other sender
    let whoIsSender = this.currentUserInfo.chat_id == item.sender_id ? 1 : 2;
    if(item.sender_id === -1)whoIsSender = 0;
    let notRenderAvatar = null

    if (type > 0 && whoIsSender !== 1 &&
      +this.state.dataProvider._data[type - 1].sender_id !== +item.sender_id) {
      notRenderAvatar = true
    }

    return (
      <Message
        whoIsSender={whoIsSender}
        message={item}
        notRenderAvatar={notRenderAvatar}
        widthScroll={this.scrollWidth}
      />
    )
  }

  getDialogById = () => {
    return ChatService.getDialogById(this.props.selectedDialog.id)
  }

  scrollToBottom = () => {
    if (this.messagesListRef) {
      this.messagesListRef.scrollToIndex(this.state.dataProvider._data.length - 1, false)
    }
  }

  render() {
    const { dataProvider, layoutProvider, isAlredy, isFetchingMsg } = this.state
    const { selectedDialog } = this.props
    let currentDialog

    if (selectedDialog) {
      currentDialog = this.getDialogById()
    }

    return (
      <ConnectyCubeWrapper>
        <div className="chat-container" >
          <div className="chat-body" id="chat-body">
            {isAlredy && isFetchingMsg ?
              dataProvider._data.length > 0 &&
              <>
                <RecyclerListView
                  style={{
                    width: this.scrollWidth,
                    height: this.scrollHeight,
                  }}
                  ref={ref => this.messagesListRef = ref}
                  dataProvider={dataProvider}
                  layoutProvider={layoutProvider}
                  rowRenderer={this._renderMessage}
                  onScroll={(elem, x, y) => {
                    this.lazyLoadMessages(elem, y)
                  }}
                />
              </> : <div className="dialog-loader vh-centered">
              <img src={toAbsoluteUrl("/media/loading/transparent-loading.gif")} alt="loading..." />
            </div>

            }
          </div>
          {/* <ChatInput sendMessageCallback={this.sendMessageCallback} /> */}
        </div>
      </ConnectyCubeWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  selectedDialog:state.dialog.selectedDialog,
  messages:state.message,
})

export default connect(mapStateToProps)(Chat)