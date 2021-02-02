import React from "react";
import RadioButton from "./RadioButton";

class StepTrainingPlace extends React.Component {
  componentDidMount() {
    //trackVirtualPageImpression('place');
  }

  render() {
    const { place, onSubmit } = this.props;
    console.log(place);
    return (
      <>
        <main className="row justify-content-md-center">
          <div className="col-12 col-lg-2"></div>
          <div className="col-12 col-lg-8">
            <header>
              <h1>Lugar de entrenamiento</h1>
              <div>
                Recibirás una planificación en función del lugar que entrenes.
              </div>
            </header>
            <form className={"place-form"}>
              <RadioButton
                id="place1"
                name="place"
                variant="column"
                checked={place === "Casa o Exterior"}
                onSelect={() => onSubmit({ place: "Casa o Exterior" })}
              >
                <div>
                  <img
                    src={require("../../assets/img/home-sm.png")}
                    alt="home"
                  />
                </div>
                <strong>Casa o Exterior</strong>
              </RadioButton>
              <RadioButton
                id="place2"
                name="place"
                variant="column"
                checked={place === "GYM"}
                onSelect={() => onSubmit({ place: "GYM" })}
              >
                <div>
                  <img
                    src={require("../../assets/img/dumbell-sm.png")}
                    alt="gym"
                  />
                </div>
                <strong>Gimnasio básico</strong>
              </RadioButton>
              <RadioButton
                id="place3"
                name="place"
                variant="column"
                checked={place === "Ambos"}
                onSelect={() => onSubmit({ place: "Ambos" })}
              >
                <div>
                  <img
                    src={require("../../assets/img/dumbell-sm.png")}
                    alt="ambos"
                  />
                </div>
                <strong>Ambos Lugares</strong>
              </RadioButton>
            </form>
            <footer>
              El lugar de entrenamiento lo podrás editar en cualquier momento
            </footer>
          </div>
          <div className="col-12 col-lg-2"></div>
        </main>
      </>
    );
  }
}

export default StepTrainingPlace;
