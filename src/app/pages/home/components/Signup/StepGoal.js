import React from "react";
import RadioButton from "./RadioButton";
//import trackVirtualPageImpression from '../../../../../lib/trackVirtualPageImpression';

export const GOALS = {
  BUILD_MUSCLE: "strong",
  GENERAL_FITNESS: "fit",
  LOSE_WEIGHT: "cardio"
};

class StepGoal extends React.Component {
  componentDidMount() {
    //trackVirtualPageImpression('goal');
  }

  render() {
    const { gender, goal, info, onSubmit } = this.props;
    let imc = (info.weight / info.height / info.height) * 10000;
    if (info.heightUnit === "in") imc = imc / 2.5399 / 2.5399;
    if (info.weightUnit === "lbs") imc = imc / 2.20462;
    return (
      <main className="row justify-content-md-center">
        <div className="col-12 col-lg-2"></div>
        <div className="col-12 col-lg-8">
          <header>
            <h1>Escoge tu objetivo</h1>
            <div>
              De acuerdo a tu índice de masa corporal de {(Math.round(imc * 100) / 100).toFixed(1)} y edad te recomendamos:
            </div>
          </header>

          <form className="goal-form">
            <RadioButton
              id="goal1"
              name="goal"
              checked={goal === GOALS.LOSE_WEIGHT}
              onSelect={() => onSubmit({ goal: GOALS.LOSE_WEIGHT })}
            >
              <strong>Perder peso</strong>
              {gender === "male" ? (
                <img src={require("../../assets/img/male_lose.png")}  alt="male-lose-alt"/>
              ) : (
                <img src={require("../../assets/img/female_lose.png")} alt="female-lose-alt" />
              )}
              <span>Quema la grasa corporal</span>
              {imc >= 25 && <div className="recommend">RECOMENDADO</div>}
            </RadioButton>
            <RadioButton
              id="goal2"
              name="goal"
              checked={goal === GOALS.GENERAL_FITNESS}
              onSelect={() => onSubmit({ goal: GOALS.GENERAL_FITNESS })}
            >
              <strong>Ponerte en forma</strong>
              <img src={require("../../assets/img/fit.png")} alt="fit-alt" />
              <span>Mejora tu condición física </span>
              {imc >= 18.5 && imc < 25 && (
                <div className="recommend">RECOMENDADO</div>
              )}
            </RadioButton>

            <RadioButton
              id="goal3"
              name="goal"
              checked={goal === GOALS.BUILD_MUSCLE}
              onSelect={() => onSubmit({ goal: GOALS.BUILD_MUSCLE })}
            >
              {gender === "male" ? (
                <strong>Ganar musculatura</strong>
              ) : (
                <strong>Tonificar</strong>
              )}
              <img src={require("../../assets/img/strong.png")} alt="strong-alt" />
              {gender === "male" ? (
                <span>Desarrolla tus músculos</span>
              ) : (
                <span>Define tus músculos</span>
              )}
              {imc < 18.5 && <div className="recommend">RECOMENDADO</div>}
            </RadioButton>
          </form>
          <footer>Este objetivo lo podrás editar en cualquier momento</footer>
        </div>
        <div className="col-12 col-lg-2"></div>
      </main>
    );
  }
}

export default StepGoal;
