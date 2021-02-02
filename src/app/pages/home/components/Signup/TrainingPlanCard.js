import React from "react";
import { FormattedMessage } from "react-intl";

import Typography from "../Typography";

const styles = {};

const FocusIndicator = ({ label, value }) => (
  <div className={styles.focusIndicator}>
    <strong>{label}</strong>

    <ul data-value={value}>
      <li />
      <li />
      <li />
    </ul>
  </div>
);

const TrainingPlanCard = ({ onSubmit, plan }) => {
  const cardStyles =
    plan.media && plan.media.image_url
      ? {
          backgroundImage: `url('${plan.media.image_url}')`
        }
      : { backgroundColor: "#505050" };

  const focuses = plan.focuses.map(focus => (
    <li key={focus.name}>
      <FocusIndicator value={focus.level} label={focus.name} />
    </li>
  ));

  const buttonAttrs = {
    onClick() {
      onSubmit({ selectedPlan: plan });
    },
    role: "button",
    tabIndex: 0
  };

  return (
    <div
      className={styles.card}
      data-recommended={
        plan.label && plan.label.type === "coach_recommendation"
      }
      style={cardStyles}
      {...(onSubmit ? buttonAttrs : {})}
    >
      <div>
        <Typography noMarginBottom>
          <FormattedMessage
            id="AthleteAssessment.TrainingPlanCard.Typography.Duration"
            values={{ weekCount: plan.duration }}
            tagName="strong"
          />
        </Typography>
        <Typography variant="subheading" noMarginBottom>
          {plan.title}
        </Typography>

        <ul className={styles.focusIndicators}>{focuses}</ul>
      </div>

      {plan.label && <div className={styles.cardLabel}>{plan.label.text}</div>}
    </div>
  );
};

export default TrainingPlanCard;
