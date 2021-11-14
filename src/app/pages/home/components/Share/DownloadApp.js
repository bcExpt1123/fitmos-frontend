import React, { useState } from "react";
import { reactLocalStorage } from 'reactjs-localstorage';
import { Modal } from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import Button from "../Button";
import { isMobile, isIOS } from "../../../../../_metronic/utils/utils";
const useStyles = makeStyles({
  content: {
    alignItems: 'flex-end',
    '& .modal-content':{
      backgroundColor:'black',
      color: 'white'
    }
  },
  button: {
    backgroundColor:'black',
    color: 'white',
    padding:'0 20px',
    margin:'1px 10px'
  }
});
const DownloadApp = () => {
  const classes = useStyles();
  const [mobileApp, setMobileApp] = useState(()=>reactLocalStorage.get('mobile-app'));
  const handleCloseForm = () => {
    reactLocalStorage.set('mobile-app', 'no');
    setMobileApp('no');
  }
  const handleRedirectApp = () => {
    setMobileApp('no');    
    if(isIOS()){
      setTimeout(function () { window.location.replace("https://apps.apple.com/us/app/fitemos/id1549350889"); }, 25);
      window.location.replace("http://onelink.to/m5fkyh");
    }else{
      setTimeout(function () { window.location.replace("https://play.google.com/store/apps/details?id=com.dexterous.fitemos"); }, 25);
      window.location.replace("http://onelink.to/m5fkyh");
    }
  }
  return (
    <>
      {isMobile() && mobileApp !== 'no' && (
        <Modal
          size="md"
          dialogClassName={classes.content}
          show={true}
          animation={false}
          centered
        >
          <Modal.Body>
            <h3 style={{margin:'14px 0'}}>Descarga la app Fitemos y accede a todos los beneficios</h3>
            <p>En la app de Fitemos podrás vivir la experiencia completa de entrenar y conectarte con tus compañeros. Descárgala ya</p>
          </Modal.Body>
          <Modal.Footer>
            <Button className={classes.button} variant="logout-modal-button" onClick={handleCloseForm}>
              Ahora No 
            </Button>
            <Button className={classes.button} variant="logout-modal-button" onClick={handleRedirectApp}>
              Cambiar a la app
            </Button>
          </Modal.Footer>          
        </Modal>
      )}
    </>
  )
};

export default DownloadApp;
