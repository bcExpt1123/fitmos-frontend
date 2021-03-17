import React,{useState} from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import IdleTimer from 'react-idle-timer';
import Alert from "../../../app/pages/home/components/Alert";
import {sessionIn,sessionOut} from "../../../app/pages/home/redux/auth/actions";

function Layout({ children, selfLayout }) {
  // scroll to top after location changes
  // window.scrollTo(0, 0);
  const [idleTimer,setIdleTimer] = useState(null);
  const [idle,setIdle] = useState(false);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const onActive = (e)=>{
    if(idle){
      setIdle(false);
      dispatch(sessionIn());
    }
    console.log('user is active', e);
    if(idleTimer)console.log('time remaining', idleTimer.getRemainingTime());
  }
  const dispatch = useDispatch();
  const onIdle = (e)=>{
    console.log('user is idle', e)
    if(!idle){
      setIdle(true);
      dispatch(sessionOut());
    }
    if(idleTimer)console.log('last active', idleTimer.getRemainingTime())    
  }
  const onAction = (e)=>{
    /*
      dispatch(sessionIn());
    }*/
    //console.log('user did something', e)
  }
  return selfLayout !== "blank" ? (
    <>
      <Helmet>
        {/* <script src="https://app.wabi-app.com/widget/js/wabi.js?phone_number=+5078327558&lang=es&position=bottom"></script>         */}
        <script>{
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-54DTQLS');`
        }</script>
        {/* <!-- End Google Tag Manager --> */}

        <script>
        {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2657666124456803');
          fbq('track', 'PageView');
          `}
        </script>
        <script type="text/javascript" src="https://downloads.mailchimp.com/js/signup-forms/popup/unique-methods/embed.js" data-dojo-config="usePlainJson: true, isDebug: false"></script>
        {(process.env.NODE_ENV !== 'development') &&(
          <script>
          {`
            window.dojoRequire(["mojo/signup-forms/Loader"], function(L) {
              L.start({"baseUrl":"mc.us19.list-manage.com","uuid":"7f225e22438d8a37f81a90eae","lid":"102c38967a","uniqueMethods":true
            }) })
          `}
          </script>
        )}
      </Helmet>
      <Alert />
      {currentUser&&(
        <IdleTimer
          ref={ref => { setIdleTimer(ref) }}
          element={document}
          onActive={onActive}
          onIdle={onIdle}
          onAction={onAction}
          debounce={250}
          timeout={1000 * 60 * 30} />
      )}
      {children}
    </>
  ) : (
    // BLANK LAYOUT
    <div className="kt-grid kt-grid--ver kt-grid--root">Blank Layout</div>
  );
}

const mapStateToProps = ({ builder: { layoutConfig } }) => ({});

export default connect(mapStateToProps)(Layout);
