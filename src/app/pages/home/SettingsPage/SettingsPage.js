import React,{useState} from "react";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { addAlertMessage } from "../redux/alert/actions";
//import { updateMessagingProfile } from '../redux/messagingProfile/actions';
/*import {
  updateAvatar,
  updateProfile,
} from '../redux/userSettings/actions';*/
import { camelizeResponse } from "../services/api";
import MetaTags from "react-meta-tags";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SubNav from "../components/SubNav";
import { logOut as logOutAction } from "../redux/auth/actions";

const SettingsPage = ({ actions, currentUser, profile, section }) => {
  const [showForm,setShowForm] = useState(false);
  const profileLinks = [
    { name: "profile", url: "profile", label: "Perfil" },
    { name: "payments", url: "payments", label: "Métodos de Pago" },
    { name: "invoices", url: "bills", label: "Facturas" },
    { name: "subscriptions", url: "subscriptions", label: "Suscripciones" },
    { name: "logout", url: "/logout", label: "Cerrar Sesión" }
  ];
  const handleShowLogoutModal = ()=>{
    setShowForm(true);
  }
  const handleCloseForm = ()=>{
    setShowForm(false);
  }
  const dispatch = useDispatch();
  const handleLogout = ()=>{
    dispatch(logOutAction());
    setShowForm(false);
  }
  return (
    <>
      <MetaTags></MetaTags>
      <NavBar />

      <section className={"settings dashborad-backgorund pt-5 pb-5"}>
        <div className="body container mb-5 ">
          <SubNav links={profileLinks} handleLogout={handleShowLogoutModal}/>

          <div className="">
            {/* TODO: can be replaced with context to reduce drilling */}
            {section({
              actions,
              currentUser,
              profile
            })}
          </div>
        </div>
      </section>

      <Footer />
      <Modal
        size="md"
        dialogClassName="logout-modal"
        show={showForm}
        onHide={handleCloseForm}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h3>¿Está seguro que desea cerrar sesión?</h3>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="logout-modal-button" onClick={handleCloseForm}>
          No 
        </Button>
        <Button variant="logout-modal-button" onClick={handleLogout}>
          Si
        </Button>
        </Modal.Footer>          
      </Modal>
    </>
  );
};

export const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: camelizeResponse(state.auth.currentUser),
  card: null,
  isLoadingCard: null,
  profile: null
});

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addAlertMessage
      //      updateAvatar,
      //      updateProfile,
    },
    dispatch
  )
});

export default SettingsPage;
