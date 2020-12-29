import React, { useState } from "react";
import { connect } from "react-redux";
import { Card, Button, ProgressBar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import classnames from "classnames";
import { useSelector } from "react-redux";
import SectionEditWeight from "./SectionEditWeight";

const Profile = ({ currentUser }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const done = useSelector(({ done }) => done);
  const now = (done.workoutCount)/(done.toWorkout)*100;
  return (
    <>
      <Card className="profile">
        <Card.Header>
          <Card.Title>Perfil</Card.Title>
          <Card.Subtitle>
            <NavLink to={"/settings/profile"}>Editar</NavLink>
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Img src={currentUser.avatarUrls.medium} alt="Card image" />
          <div className="info">
            <Card.Title className={classnames({"mb-4":!done.fromWorkoutImage,"mb-1":done.fromWorkoutImage})}>
              {currentUser.customer.first_name +
                " " +
                currentUser.customer.last_name}
              {done.fromWorkoutImage&&(
                <img src={done.fromWorkoutImage} alt="from-workout-alt"/>
              )}
            </Card.Title>
            <div className="row">
              <div className="col-6">
                <div className="mt-2 pt-1">Workouts</div>
              </div>
              <div className="col-6" style={{textAlign:'right'}}>
                <span>{done.workoutCount}/{done.toWorkout}</span>
                {done.toWorkoutImage&&(
                  <img src={done.toWorkoutImage} alt="to-workout-alt"/>
                )}
              </div>
              <div className="col-12 mb-4">
                <ProgressBar now={now} />
              </div>
              <div className="col-6 col-md-6">
                <div className="mb-0">
                  <span>Pais:&nbsp;&nbsp;</span>
                  {currentUser.customer.country}
                </div>
                <div className="mb-0">
                  <span>Edad:&nbsp;&nbsp;</span>
                  {currentUser.customer.age}
                </div>
                <div className="mb-0">
                  <span>Género:&nbsp;&nbsp;</span>
                  <FormattedMessage
                    id={`SettingsForm.Profile.Value.${currentUser.customer.gender}`}
                  />
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="mb-0">
                  <span>Altura:&nbsp;&nbsp;</span>
                  {parseInt(currentUser.customer.current_height)}
                  {currentUser.customer.current_height_unit}
                </div>
                <div className="mb-0">
                  <span>Peso:&nbsp;&nbsp;</span>
                  {parseInt(currentUser.customer.current_weight)}
                  {currentUser.customer.current_weight_unit}
                  <Button
                    variant="light"
                    className="transparent-btn"
                    onClick={handleShow}
                  >
                    <i className="fa fa-edit"></i>
                  </Button>
                </div>
                <div className="mb-0">
                  <span>IMC:&nbsp;&nbsp;</span>
                  {currentUser.customer.imc}
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <SectionEditWeight handleClose={handleClose} show={show} />
    </>
  );
};

const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {};
const SectionProfile = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default SectionProfile;
