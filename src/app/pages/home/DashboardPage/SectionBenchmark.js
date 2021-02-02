import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {Row} from "react-bootstrap";
import {Col} from "react-bootstrap";
import {Button} from "react-bootstrap";
import SectionEditBenchmark from "./SectionEditBenchmark";
import { $findPublished } from "../../../../modules/subscription/benchmark";

class Benchmarks extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = { show: false, benchmark: false };
  }
  handleShow(benchmark) {
    this.setState({ show: true, benchmark: benchmark });
  }
  handleClose() {
    this.setState({ show: false });
  }
  componentDidMount() {
    this.props.$findPublished();
  }
  render() {
    return (
      <>
        <Card className="benchmarks">
          <Card.Header>
            <Card.Title>Benchmarks</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              {this.props.benchmarks.map(benchmark => (
                <Col xs={6} key={benchmark.id}>
                  <div
                    className="content"
                    style={{
                      backgroundImage: "url(" + benchmark.image + ")",
                      cursor: "pointer"
                    }}
                    onClick={() => this.handleShow(benchmark)}
                  >
                    <div className="background">
                      <div className="title">{benchmark.title}</div>
                      <Button variant="light" className="transparent-btn">
                        <i className="fa fa-edit"></i>
                      </Button>
                      {benchmark.result === "" ? (
                        <div className="repetition">PENDIENTE</div>
                      ) : (
                        <div className="repetition">{benchmark.result}</div>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
        <SectionEditBenchmark
          handleClose={this.handleClose}
          show={this.state.show}
          benchmark={this.state.benchmark}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser,
  benchmarks: state.benchmark.published
});

const mapDispatchToProps = {
  $findPublished
};
const SectionBenchmark = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Benchmarks)
);
export default SectionBenchmark;
