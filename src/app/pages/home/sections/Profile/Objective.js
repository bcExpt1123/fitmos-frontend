import React,{useState} from "react";
import Card from "react-bootstrap/Card";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { http } from "../../services/api";
import { currentCustomerWeights } from "../../services/convert";
import { updateCustomerAttribute as updateWeightsAction } from "../../redux/auth/actions";
import SectionChangeGoal from "../../DashboardPage/SectionChangeGoal";
import { $resetPublished } from "../../../../../modules/subscription/benchmark";

export const findObjective = (objective,currentUser) => {
  let label;
  if (objective == 'auto') {
    if (currentUser.customer.imc >= 25) objective = 'cardio';
    else if (currentUser.customer.imc <= 18.5) objective = 'strong';
    else objective = 'fit';
  }
  switch (objective) {
    case 'cardio':
      label = 'Perder peso';
      break;
    case 'fit':
      label = 'Ponerte en forma';
      break;
    case 'strong':
      label = currentUser.customer.gender == "Male"
        ? "Ganar musculatura" : "Tonificar"
      break;
  }
  return label;
}
const Objective = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [objective, setObjective] = useState(false);
  const [condition, setCondition] = useState(false);

  const dispatch = useDispatch();

  const handleCloseObjective = ()=>{
    setObjective(false);
  }
  const openModalObjective = ()=>{
    setObjective(true);
  }
  const handleClick = async event => {
    if (window.confirm("Por favor confirmar para hacer el cambio.")) {
      const weights = currentUser.customer.weights=='con pesas'?'sin pesas':'con pesas';
      const res = await http({
        method: "POST",
        app: "user",
        path: "customers/changeWeights",
        data: {
          weights: weights
        }
      });
      dispatch(updateWeightsAction({ attribute: "weights", value: weights }));
      dispatch($resetPublished());
    }
  };
  const handleCloseCondition = ()=>{
    setCondition(false);
  }
  const openModalCondition = ()=>{
    setCondition(true);
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Objetivos</Card.Title>
      </Card.Header>
      <Card.Body>
        <label>Objetivo</label>
        <div className="row">
          <div className="value col-10">{findObjective(currentUser.customer.objective,currentUser)}</div>
          <div className="col-2 edit"><i className="fa fa-pen" onClick={openModalObjective}></i></div>
        </div>
        <label>Equipo</label>
        <div className="row">
          <div className="value col-10">{currentCustomerWeights(currentUser.customer.weights)}</div>
          <div className="col-2 edit"><i className="fa fa-pen" onClick={handleClick}></i></div>
        </div>
        <label>Intensidad</label>
        <div className="row">
          <div className="value col-10">Nivel Físico {currentUser.customer.current_condition}</div>
          <div className="col-2 edit">                            
            <NavLink
              to={"/level"}
              exact
            >
              <i className="fa fa-pen"></i>
            </NavLink>
          </div>
        </div>
      </Card.Body>
      <SectionChangeGoal handleClose={handleCloseObjective} show={objective}/>
    </Card>
  );
};
export default Objective;
