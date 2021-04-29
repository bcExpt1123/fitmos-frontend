import ConnectyCube from 'connectycube';
import store from '../../../store/store';
import { http } from './api';

class AuthService {
  static CURRENT_USER_SESSION_KEY = 'CURRENT_USER_SESSION_KEY'
  static DEVICE_TOKEN_KEY = 'DEVICE_TOKEN_KEY'

  async init() {
    const config = [
      {
        appId: process.env.REACT_APP_CONNECTY_CUBE_APP_ID,
        authKey: process.env.REACT_APP_CONNECTY_CUBE_AUTH_KEY,
        authSecret: process.env.REACT_APP_CONNECTY_CUBE_AUTH_SECRET,
      },
      { chat: {
        streamManagement: {
          enable: true
        }
      },
        debug: {
          mode: 0
        } 
      }
    ];    
    await ConnectyCube.init(...config)
    // return authService.autologin()
  }

  // async autologin() {
  //   // const checkUserSessionFromStore = await authService.getUserSession()
  //   // if (checkUserSessionFromStore) {
  //     //const data = JSON.parse(checkUserSessionFromStore)
  //     const auth = store.getState().auth;
  //     await authService.signIn({ login: auth.currentUser.id, password: auth.accessToken })
  //   //   return 'home'
  //   // } else { return 'auth' }
  // }

  async signIn(params, user) {
    try {
      const session = await ConnectyCube.createSession(params)
      if(user && (user.chat_id===null || user.chat_id===undefined)){
        await http({
          path: "chat/user-id",
          method: "POST",
          data: {
            chat_id:session.user_id
          }
        });      
      }
      authService.setUserSession(session)
      await authService.connect(session.user_id, session.token)
    }catch(e){
      console.log('error', e)
      if(e.status == 401){
        console.log(params)
        console.log(e);
      }
    }
  }

  async signUp(params) {
    await ConnectyCube.createSession()
    await ConnectyCube.users.signup(params)
    return authService.signIn(params)
  }

  async connect(userId) {
    const token = ConnectyCube.service.sdkInstance.session.token;
    await ConnectyCube.chat.connect({ userId, password:token })
  }

  setUserSession(userSession) {
    return localStorage.setItem(AuthService.CURRENT_USER_SESSION_KEY, JSON.stringify(userSession))
  }

  getUserSession() {
    return localStorage.getItem(AuthService.CURRENT_USER_SESSION_KEY)
  }

  async logout() {
    const service = ConnectyCube.service;
    if(service && service.sdkInstance.session){
      const token = ConnectyCube.service.sdkInstance.session.token;
      if(token)await ConnectyCube.logout()
    }
  }


}

const authService = new AuthService()

Object.freeze(authService)

export default authService