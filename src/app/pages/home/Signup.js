/* eslint import/no-named-as-default: off */
import React from "react";

import NavBar from "./components/Signup/NavBar";
import ProgressBar from "./components/Signup/ProgressBar";
import Step from "./components/Step";
import Stepper from "./components/Stepper";
import StepGender from "./components/Signup/StepGender";
import StepLevel from "./components/Signup/StepLevel";
import StepGoal from "./components/Signup/StepGoal";
import StepInfo from "./components/Signup/StepInfo";
import StepTrainingPlace from "./components/Signup/StepTrainingPlace";
import StepRegisteration from "./components/Signup/StepRegisteration";
//import MetaTags from '../../components/MetaTags';
import * as Cookies from "./services/storage";

//import { getNavigation } from '../../navigation';
import { withRouter } from "react-router";
import "./assets/scss/theme/signup.scss";

const preloadImage = url => {
  const image = new Image();
  image.src = url;
};

class SignupPage extends React.Component {
  state = {
    currentStep: 0,
    gender: "",
    level: "",
    place: "",
    goal: "",
    info: {
      birthday: "",
      height: "",
      heightUnit: "cm",
      weight: "",
      weightUnit: "lbs"
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // Scroll to the top after changing step
    if (this.state.currentStep !== prevState.currentStep) {
      window.scrollTo(0, 0);
    }
  }

  setGoal = ({ goal }) => {
    const { gender } = this.state;
    // Preload image displayed on StepGeneratePlan
    this.setState({ goal: goal });
    //this.submit();
    this.nextStep({
      gender,
      goal
    });
  };

  prevStep = () => {
    this.setState(prevState => ({
      currentStep: prevState.currentStep - 1
    }));
  };

  nextStep = (stateChange = {}) => {
    this.setState(prevState => ({
      ...stateChange,
      currentStep: prevState.currentStep + 1
    }));
  };

  submit = () => {
    const {
      gender,
      level,
      place,
      goal,
      info: { birthday, weight, weightUnit, height, heightUnit }
    } = this.state;

    Cookies.set(
      "fitemos_profile",
      JSON.stringify({
        birthday,
        gender: { male: "m", female: "f" }[gender],
        goals: [goal],
        fitness_level: level,
        height: parseInt(height, 10),
        height_unit: heightUnit,
        weight: parseInt(weight, 10),
        weight_unit: weightUnit
      })
    );
  };

  render() {
    const { currentStep } = this.state;

    return (
      <div className={"signup_wizard"}>
        <section>
          <NavBar prevStep={this.prevStep} currentStep={currentStep} />
        </section>
        <section className={"widget"}>
          <div className="container">
            <Stepper activeStep={currentStep}>
              <Step>
                <ProgressBar currentStep={currentStep} />
                <StepGender
                  gender={this.state.gender}
                  onSubmit={this.nextStep}
                />
              </Step>

              <Step>
                <ProgressBar currentStep={currentStep} />
                <StepLevel level={this.state.level} onSubmit={this.nextStep} />
              </Step>

              <Step>
                <ProgressBar currentStep={currentStep} />
                <StepTrainingPlace
                  place={this.state.place}
                  onSubmit={this.nextStep}
                />
              </Step>

              <Step>
                <ProgressBar currentStep={currentStep} />
                <StepInfo info={this.state.info} onSubmit={this.nextStep} />
              </Step>

              <Step>
                <ProgressBar currentStep={currentStep} />
                <StepGoal
                  gender={this.state.gender}
                  goal={this.state.goal}
                  info={this.state.info}
                  onSubmit={this.setGoal}
                />
              </Step>
              <Step>
                <ProgressBar currentStep={currentStep} />
                <StepRegisteration profile={this.state} />
              </Step>
            </Stepper>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(SignupPage);
