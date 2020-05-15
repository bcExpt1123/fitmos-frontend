import React, { useState } from "react";
import { connect } from "react-redux";
import { http } from "./services/api";
import { updateCustomerAttribute as updateWeightsAction } from "./redux/auth/actions";

function Notification({ updateWeightsAction, currentUser }) {
  const [focused, setFocused] = useState({});
  const handleClick = async event => {
    if (window.confirm("Por favor confirmar para hacer el cambio.")) {
      const res = await http({
        method: "POST",
        app: "user",
        path: "customers/changeWeights",
        data: {
          weights: "con pesas"
        }
      });
      updateWeightsAction({ attribute: "weights", value: "con pesas" });
    }
  };

  return (
    <>
      {currentUser &&
        currentUser.customer &&
        currentUser.customer.weights == "sin pesas" && (
          <div
            className="section-notification"
            id="section-notification"
            onClick={handleClick}
          >
            {currentUser.customer.first_name}, cuando tengas un par de
            mancuernas de peso medio, haz click aquí para recibir el
            entrenamiento completo.
          </div>
        )}
    </>
  );
}
const mapStateToProps = state => ({
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {
  updateWeightsAction
};

const NotificationSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);

export default NotificationSection;
