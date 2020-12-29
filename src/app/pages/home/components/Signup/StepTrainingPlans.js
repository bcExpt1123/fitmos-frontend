import React from "react";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";

import Typography from "../Typography";
import TrainingPlanCard from "./TrainingPlanCard";
//import trackVirtualPageImpression from '../../../../../lib/trackVirtualPageImpression';

const styles = {};

class StepTrainingPlans extends React.Component {
  componentDidMount() {
    //const { gender, goal } = this.props;

    //trackVirtualPageImpression(      'training-plans',      `?gender=${gender}&goal=${goal}`,    );
  }

  render() {
    const { plans, onSubmit } = this.props;

    const planList = plans.map(plan => (
      <TrainingPlanCard
        onSubmit={onSubmit}
        key={plan.slug}
        plan={plan}
        className={styles.card}
      />
    ));

    return (
      <main className={styles.main}>
        <header className={styles.header}>
          <Typography
            variant="subheading"
            size="lg"
            tagName="h1"
            noMarginBottom
          >
            <FormattedHTMLMessage id="AthleteAssessment.StepTrainingPlans.Typography.Heading" />
          </Typography>
          <Typography color="lightGrey">
            <FormattedMessage id="AthleteAssessment.StepTrainingPlans.Typography.Subheading" />
          </Typography>
        </header>

        <section className={styles.content}>{planList}</section>
      </main>
    );
  }
}

export default StepTrainingPlans;
