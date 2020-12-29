import React from "react";
import { FormattedMessage } from "react-intl";

import RadioButton from "./RadioButton";
//import trackVirtualPageImpression from '../../../../../lib/trackVirtualPageImpression';

const FITNESS_LEVEL = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5
};

class StepLevel extends React.Component {
  componentDidMount() {
    //trackVirtualPageImpression('fitness-level');
  }

  render() {
    const { level, onSubmit } = this.props;

    return (
      <main className="row justify-content-md-center level">
        <div className="col-12 col-lg-2"></div>
        <div className="col-12 col-lg-8">
          <header>
            <h1>Nivel de condición física</h1>
            <div>
              La intensidad de los entrenamientos se irá incrementando a medida
              logres tus objetivos.
            </div>
          </header>

          <form className={"level-form"}>
            <RadioButton
              id="fitnessLevel_1"
              name="fitnessLevel"
              checked={level === FITNESS_LEVEL.LEVEL_1}
              onSelect={() => onSubmit({ level: FITNESS_LEVEL.LEVEL_1 })}
            >
              <div>
                <FormattedMessage
                  id="StepLevel.Button.Level_1.Heading"
                  tagName="strong"
                />
                <strong
                  className="mbr-bold pull-right"
                  style={{ fontWeight: 700 }}
                >
                  LV1
                </strong>
              </div>
            </RadioButton>

            <RadioButton
              id="fitnessLevel_2"
              name="fitnessLevel"
              checked={level === FITNESS_LEVEL.LEVEL_2}
              onSelect={() => onSubmit({ level: FITNESS_LEVEL.LEVEL_2 })}
            >
              <div>
                <FormattedMessage
                  id="StepLevel.Button.Level_2.Heading"
                  tagName="strong"
                />
                <strong
                  className="mbr-bold pull-right"
                  style={{ fontWeight: 700 }}
                >
                  LV2
                </strong>
              </div>
            </RadioButton>

            <RadioButton
              id="fitnessLevel_3"
              name="fitnessLevel"
              checked={level === FITNESS_LEVEL.LEVEL_3}
              onSelect={() => onSubmit({ level: FITNESS_LEVEL.LEVEL_3 })}
            >
              <div>
                <FormattedMessage
                  id="StepLevel.Button.Level_3.Heading"
                  tagName="strong"
                />
                <strong
                  className="mbr-bold pull-right"
                  style={{ fontWeight: 700 }}
                >
                  LV3
                </strong>
              </div>
            </RadioButton>

            <RadioButton
              id="fitnessLevel_4"
              name="fitnessLevel"
              checked={level === FITNESS_LEVEL.LEVEL_4}
              onSelect={() => onSubmit({ level: FITNESS_LEVEL.LEVEL_4 })}
            >
              <div>
                <FormattedMessage
                  id="StepLevel.Button.Level_4.Heading"
                  tagName="strong"
                />
                <strong
                  className="mbr-bold pull-right"
                  style={{ fontWeight: 700 }}
                >
                  LV4
                </strong>
              </div>
            </RadioButton>

            <RadioButton
              id="fitnessLevel_5"
              name="fitnessLevel"
              checked={level === FITNESS_LEVEL.LEVEL_5}
              onSelect={() => onSubmit({ level: FITNESS_LEVEL.LEVEL_5 })}
            >
              <div>
                <FormattedMessage
                  id="StepLevel.Button.Level_5.Heading"
                  tagName="strong"
                />
                <strong
                  className="mbr-bold pull-right"
                  style={{ fontWeight: 700 }}
                >
                  LV5
                </strong>
              </div>
            </RadioButton>
          </form>
        </div>
        <div className="col-12 col-lg-2"></div>
      </main>
    );
  }
}

export default StepLevel;
