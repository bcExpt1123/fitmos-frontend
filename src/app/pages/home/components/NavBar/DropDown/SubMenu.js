import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { stopRunning } from "../../../redux/done/actions";
import { logOut as logOutAction } from "../../../redux/auth/actions";

const Submenu = ({open,show,openCreatingPost} )=>{
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const [showForm,setShowForm] = useState(false);
  const isRunning = useSelector(({done})=>done.isRunning);
  const changeConfirm = ()=>{
    if(isRunning){
      if(window.confirm("El reloj aún sigue corriendo. ¿Deseas avanzar?") ===false)return false;
      dispatch(stopRunning());
    }
    return true;
  }
  const handleShowLogoutModal = ()=>{
    if(changeConfirm())setShowForm(true);
  }
  const handleCloseForm = ()=>{
    setShowForm(false);
  }
  const dispatch = useDispatch();
  const history = useHistory();
  const handleLogout = ()=>{
    history.push("/");
    dispatch(logOutAction());
    setShowForm(false);
  }
  return (
    <>
      <button type="button" className={"clickable-button dropbtn"} onClick={open}>
        <i className="fas fa-chevron-down dropbtn" />
      </button>
      <div className={classnames("dropdown-menu",{show:show})}>
        <a className={"dropdown-item createing"} onClick={openCreatingPost}>
          Crear Post
        </a>                
        <NavLink
          to={"/"+currentUser.customer.username}
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          <i className="far fa-user-circle" />Mi Cuenta
        </NavLink>                
        <NavLink
          to="/partners"
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          <i className="fas fa-users" />Partners
        </NavLink>                
        <NavLink
          to="/ayuda"
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          <i className="fas fa-question" />Ayuda
        </NavLink>                
        <NavLink
          to="/profile"
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          <i className="fas fa-cog" />Ajustes
        </NavLink>                
        <a className="dropdown-item"  onClick={handleShowLogoutModal}>
          <i className="fas fa-sign-out-alt" />Cerrar sesión
        </a>
      </div>
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
  )
}
export default Submenu;