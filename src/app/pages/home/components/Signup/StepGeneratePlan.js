import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

import Icon from "../Icon";
import Typography from "../Typography";
//import trackVirtualPageImpression from '../../../../../lib/trackVirtualPageImpression';
import * as TrainingPlans from "../../services/training-plans";

const styles = {};

class StepGeneratePlan extends React.Component {
  componentDidMount() {
    const {
      birthday,
      gender,
      goal,
      level,
      intl,
      recommendedPlanSlug,
      onSubmit
    } = this.props;

    //trackVirtualPageImpression('training-plan-generation', `?gender=${gender}`);

    const timeout = new Promise(resolve => {
      this.timeout = setTimeout(resolve, 3000);
    });

    const fetchPlans = TrainingPlans.all({
      birthday,
      gender: { male: "m", female: "f" }[gender],
      goal,
      level,
      recommended: true,
      recommendedPlanSlug,
      locale: intl.locale,
      limit: 3
    });

    Promise.all([timeout, fetchPlans]).then(values =>
      onSubmit({ plans: values[1], recommendedPlan: values[1][0] })
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { imgUrl } = this.props;

    const bgImg = {
      backgroundImage: `url('${imgUrl}')`
    };

    return (
      <main className={styles.loadingScreen} style={bgImg}>
        <Icon name="coach" className={styles.coachIcon} display="block" />

        <div className={styles.loadingBox}>
          <Typography>
            <FormattedMessage id="AthleteAssessment.StepGeneratingPlan.Typography.Heading" />
          </Typography>

          <div className={styles.loadBar}>
            <div className={styles.bar} />
          </div>
        </div>
      </main>
    );
  }
}

export default injectIntl(StepGeneratePlan);
