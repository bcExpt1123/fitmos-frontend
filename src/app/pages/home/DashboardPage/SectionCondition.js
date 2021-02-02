import React from "react";
import { Card } from "react-bootstrap";
import QuickStatsChart from "../../../widgets/QuickStatsChart";
import { useSelector } from "react-redux";
const SectionCondition = () => {
  const benchmark = useSelector(({ benchmark }) => benchmark);
  const chartOptions = {
    data: benchmark.results.data,
    color: "#bbca43",
    labels: benchmark.results.labels,
    border: 3
  };
  const total = benchmark.published
    .map(item => item.result)
    .reduce((acc, result) => acc + parseInt(result), 0);
  return (
    total > 0 && (
      <Card className="condition">
        <Card.Header>
          <Card.Title>Condición Fisica</Card.Title>
        </Card.Header>
        <Card.Body>
          <QuickStatsChart
            value={total}
            desc="Progreso"
            data={chartOptions.data}
            labels={chartOptions.labels}
            color={chartOptions.color}
            border={chartOptions.border}
          />
        </Card.Body>
      </Card>
    )
  );
};
export default SectionCondition;
