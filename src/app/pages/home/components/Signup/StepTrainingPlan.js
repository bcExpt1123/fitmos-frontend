import React from "react";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";

import Button from "../Button";
import Icon from "../Icon";
import GlobalIcon from "../Icon";
import Typography from "../Typography";
import TrainingPlanCard from "./TrainingPlanCard";
//import trackVirtualPageImpression from '../../../../../lib/trackVirtualPageImpression';

const styles = {};

class StepTrainingPlan extends React.Component {
  componentDidMount() {
    const { gender, goal } = this.props;

    //trackVirtualPageImpression(      'training-plan',      `?gender=${gender}&goal=${goal}`,    );
  }

  render() {
    const { onSubmit, plan } = this.props;

    const tags = plan.tags.map(tag => <li key={tag}>{tag}</li>);
    const results = plan.results.map(result => (
      <li key={result}>
        <GlobalIcon name="checkmark" />
        <span>{result}</span>
      </li>
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
            <FormattedHTMLMessage id="AthleteAssessment.StepTrainingPlan.Typography.Heading" />
          </Typography>
          <Typography color="lightGrey">
            <FormattedMessage id="AthleteAssessment.StepTrainingPlan.Typography.Subheading" />
          </Typography>
        </header>

        <TrainingPlanCard plan={plan} />

        <section className={styles.content}>
          <Typography variant="subheading" size="sm">
            <FormattedMessage id="AthleteAssessment.StepTrainingPlan.Typography.Title.Tags" />
          </Typography>

          <ul className={styles.tags}>{tags}</ul>
        </section>

        <section className={styles.content}>
          <Typography variant="subheading" size="sm">
            <FormattedMessage id="AthleteAssessment.StepTrainingPlan.Typography.Title.Info" />
          </Typography>

          <ul className={styles.constraints}>
            <li>
              {plan.constraints[0].type === "basic_gym_equipment" ? (
                <Icon name="barbell" />
              ) : (
                <Icon name="home" />
              )}
              <span>{plan.constraints[0].text}</span>
            </li>
            <li>
              <Icon name="clock" />
              <span>{plan.constraints[1].text}</span>
            </li>
          </ul>
        </section>

        <section className={styles.content}>
          <Typography variant="subheading" size="sm">
            <FormattedMessage id="AthleteAssessment.StepTrainingPlan.Typography.Title.Results" />
          </Typography>

          <ul className={styles.results}>{results}</ul>
        </section>

        <section className={styles.content}>
          <Typography variant="subheading" size="sm">
            <FormattedMessage id="AthleteAssessment.StepTrainingPlan.Typography.Title.Plan" />
          </Typography>

          <ul className={styles.preview}>
            <li>
              <div className={styles.previewFlow}>
                <div className={styles.previewFlowIcon}>
                  <Icon name="start" display="block" />
                </div>
              </div>
              <div className={styles.previewContent}>
                <h4>{plan.preview[0].title}</h4>
                <p>{plan.preview[0].body}</p>
              </div>
            </li>
            <li>
              <div className={styles.previewFlow}>
                <div className={styles.previewFlowIcon}>
                  <Icon name="renew" display="block" />
                </div>
              </div>
              <div className={styles.previewContent}>
                <h4>{plan.preview[1].title}</h4>
                <p>{plan.preview[1].body}</p>
              </div>
            </li>
            <li>
              <div className={styles.previewFlow}>
                <div className={styles.previewFlowIcon}>
                  <Icon name="renew" display="block" />
                </div>
              </div>
              <div className={styles.previewContent}>
                <h4>{plan.preview[2].title}</h4>
                <p>{plan.preview[2].body}</p>
              </div>
            </li>
            <li>
              <div className={styles.previewFlow}>
                <div className={styles.previewFlowIcon}>
                  <Icon name="check" display="block" />
                </div>
              </div>
              <div className={styles.previewContent}>
                <h4>{plan.preview[3].title}</h4>
                <p>{plan.preview[3].body}</p>
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.disclaimer}>
          <Icon name="info" display="block" />
          <Typography color="lightGrey" size="sm" noMarginBottom>
            <FormattedMessage id="AthleteAssessment.StepTrainingPlan.Typography.Body.Disclaimer" />
          </Typography>
        </section>

        <Button onClick={onSubmit} block>
          <FormattedMessage id="AthleteAssessment.StepTrainingPlan.Button.Cta" />
        </Button>
      </main>
    );
  }
}

export default StepTrainingPlan;
