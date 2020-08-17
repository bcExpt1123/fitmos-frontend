import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field } from "formik";
import FormGroup from "../components/FormGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Markup } from "interweave";
import ModalVideo from 'react-modal-video';
import { http } from "../services/api";
import {
  updateCustomerAttribute as updateConditionAction,
  deleteAuthData as deleteAuthAction
} from "../../home/redux/auth/actions";
import { $resetPublished } from "../../../../modules/subscription/benchmark";

class NextLevel extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      // form input fields states
      condition: null,
      conditions:null,
      confirm:false,
      show:false,
      vid:false,
    };
    this.handleNextLevel = this.handleNextLevel.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }
  componentDidMount() {
    this.getConditions();
  }
  handleNextLevel = async () => {
    const res = await http({
      method: "POST",
      app: "user",
      path: "customers/nextCondition"
    });
    let { data } = res;
    this.props.updateConditionAction({
      attribute: "current_condition",
      value: data.condition
    });
    let item = this.state.conditions.find(item => {
      if (item.id == data.condition)
        return item;
    });
    this.setState({ condition: item });
    this.setState({confirm:false});
    this.props.$resetPublished();
    this.props.handleClose();
  };
  handlePrevious = async () => {
    const res = await http({
      method: "POST",
      app: "user",
      path: "customers/previousCondition"
    });
    let { data } = res;
    this.props.updateConditionAction({
      attribute: "current_condition",
      value: data.condition
    });
    let item = this.state.conditions.find(item => {
      if (item.id == data.condition)
        return item;
    });
    this.setState({ condition: item });
    this.props.$resetPublished();
    this.props.handleClose();
  };
  async getConditions() {
    try {
      const res = await http({
        method: "GET",
        app: "user",
        path: "customers/conditions"
      });
      const { data } = res;
      let item = data.find(item => {
        if (item.id == this.props.currentUser.customer.current_condition)
          return item;
      });
      this.setState({ condition: item,conditions:data });
    } catch (e) {
      this.props.deleteAuthAction();
    }
  }
  render() {
    return (
      <>
        <Modal
          show={this.props.show}
          onHide={this.props.handleClose}
          animation={false}
          centered
          className="next-level"
        >
          {this.state.confirm?(
            <>
              <Modal.Header closeButton>
                <Modal.Title className="text-center w-100 text-white">
                  Prueba Superada
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="content text-white">
                  {this.props.currentUser.customer.first_name}, al avanzar de nivel la intensidad del entrenamiento subirá. 
                  Siempre podrás disminuir la misma en el momento que gustes.
                  Si superas satisfactoriamente la prueba y deseas avanzar al siguiente Nivel haz click en el botón de <strong>Prueba Superada</strong>.
                </div>
                <div className='actions mt-5'>
                  <div  className="btn-level-decrease">
                    <div className="arrow-decrease"/>
                    <button onClick={()=>this.setState({confirm:false})}>Regresar</button>
                  </div>
                  <div className="btn-level-increase">
                    <button onClick={this.handleNextLevel}>Prueba Superada</button>
                  </div>
                </div>
              </Modal.Body>
            </>
          ):(
            <>
              <Modal.Header closeButton>
                <Modal.Title className="text-center w-100 text-white">
                  Intensidad de Entrenamiento
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="text-white header" style={{display:'none'}}>
                  {this.state.condition && this.state.condition.title}
                </div>
                <div className="content text-white">
                  {this.props.currentUser.customer.current_condition<5?(
                    <>
                      {this.props.currentUser.customer.first_name}, actualmente estás en <span className='level'>Nivel {this.props.currentUser.customer.current_condition}</span>, para avanzar al siguiente nivel debes ser capaz de:
                      <br/>
                      <div className='summury'>
                        {this.state.condition && (
                          this.state.condition.summury.map((line,index)=>
                            <p key={index}>
                              {line.content}&nbsp;
                              {line.youtube&&(
                                <button onClick={()=>{
                                    this.setState({vid:line.youtube.vid});
                                    this.setState({show:true});
                                    const res = http({
                                      method: "POST",
                                      app: "user",
                                      path: "customers/activity",
                                      data:{
                                        column:'video_count'
                                      }
                                    });                                
                                  }
                                }>
                                  {line.youtube.name}
                                </button>
                              )}
                            </p>
                          )
                        )}
                      </div>
                    </>
                  ):(
                    <>
                      ¡Hola {this.props.currentUser.customer.first_name}! En estos momentos estás en el nivel máximo. Si buscas seguir aumentando la intensidad de tu entrenamiento por favor contáctanos. 
                      <br/>
                      Nos encantará ayudarte: hola@fitemos.com
                    </>
                  )}
                </div>
                <div className='actions  mt-5'>
                  {this.props.currentUser.customer.current_condition>1&&(
                    <div  className="btn-level-decrease">
                      <div className="arrow-decrease"/>
                      <button onClick={this.handlePrevious}>Nivel {parseInt(this.props.currentUser.customer.current_condition)-1}</button>
                    </div>
                  )}
                  {this.props.currentUser.customer.current_condition<5&&(
                    <div className="btn-level-increase">
                      <div className="arrow-increase"/>
                      <button onClick={()=>this.setState({confirm:true})}>Nivel {parseInt(this.props.currentUser.customer.current_condition)+1}</button>
                    </div>
                  )}
                </div>
              </Modal.Body>
            </>
          )}
        </Modal>
        <ModalVideo channel='youtube' isOpen={this.state.show} videoId={this.state.vid} onClose={() => this.setState({show:false})} />
      </>
    );
  }
}

const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {
  updateConditionAction,
  deleteAuthAction,
  $resetPublished,
};
const SectionNextLevel = connect(
  mapStateToProps,
  mapDispatchToProps
)(NextLevel);
export default SectionNextLevel;
