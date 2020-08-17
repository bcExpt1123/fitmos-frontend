import React,{useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ThreeColumn from "./layouts/Three";
import PageHeader from "./layouts/PageHeader";
import SectionEditBenchmark from "./DashboardPage/SectionEditBenchmark";

const BenchmarksPage = () => {
  const benchmarks = useSelector(({ benchmark }) => benchmark.published);
  const [show,setShow] = useState(false);
  const [benchmark,setBenchmark] = useState(false);
  const handleShow = (benchmark)=> {
    setShow(true);
    setBenchmark(benchmark);
  }
  const handleClose = ()=> {
    setShow(false);
  }

  return (
    <>
      <MetaTags>
        <title>Benchmarks -Fitemos </title>
        <meta
          name="description"
          content="Benchmarks -Fitemos"
        />
      </MetaTags>
      <ThreeColumn>
        <PageHeader title={`Benchmarks`}/>
        <div className="benchmarks">
          <Row>
            {benchmarks.map(benchmark => (
              <Col xs={12} md={4} key={benchmark.id}>
                <div
                  className="content"
                  onClick={() => handleShow(benchmark)}
                >
                  <div className="image"
                    style={{
                      backgroundImage: "url(" + benchmark.image + ")",
                      cursor: "pointer"
                    }}
                  >
                    <div className="background">
                    </div>
                  </div>
                  <div className="body row">
                    <div className="title col-8">{benchmark.title}</div>
                        {benchmark.result == "" ? (
                          <div className="repetition col-4">PENDIENTE</div>
                        ) : (
                          <div className="repetition col-4">{benchmark.result}</div>
                        )}
                    </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </ThreeColumn>
      <SectionEditBenchmark
        handleClose={handleClose}
        show={show}
        benchmark={benchmark}
      />
    </>
  )
};

export default BenchmarksPage;
