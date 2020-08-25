import React from "react";
import RadioButton from "./RadioButton";
//import trackVirtualPageImpression from '../../../../../lib/trackVirtualPageImpression';

class StepGender extends React.Component {
  componentDidMount() {
    //trackVirtualPageImpression('gender');
  }

  render() {
    const { gender, onSubmit } = this.props;
    return (
      <>
        <main className="row justify-content-md-center">
          <div className="col-12 col-lg-2"></div>
          <div className="col-12 col-lg-8">
            <header>
              <h1>Soy</h1>
              <div>Los entrenamientos serán acorde a tu género.</div>
            </header>
            <form className={"gender-form"}>
              <RadioButton
                id="gender1"
                name="gender"
                variant="column"
                checked={gender === "female"}
                onSelect={() => onSubmit({ gender: "female" })}
              >
                <div>
                  <i className="fa fa-female" aria-hidden="true"></i>
                </div>
                <strong>Mujer</strong>
              </RadioButton>

              <RadioButton
                id="gender2"
                name="gender"
                variant="column"
                checked={gender === "male"}
                onSelect={() => onSubmit({ gender: "male" })}
              >
                <div>
                  <i className="fa fa-male" aria-hidden="true"></i>
                </div>
                <strong>Hombre</strong>
              </RadioButton>
            </form>
          </div>
          <div className="col-12 col-lg-2"></div>
        </main>
      </>
    );
  }
}

export default StepGender;
