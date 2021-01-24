import React,{useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {Row} from "react-bootstrap";
import {Col} from "react-bootstrap";
import MetaTags from "react-meta-tags";
import SectionEditBenchmark from "../../DashboardPage/SectionEditBenchmark";
import { $findPublished } from "../../../../../modules/subscription/benchmark";

const BenchmarksPage = () => {
  const benchmarks = useSelector(({ benchmark }) => benchmark.published);
  const [show,setShow] = useState(false);
  const [benchmark,setBenchmark] = useState(false);
  const total = benchmarks
    .map(item => item.result)
    .reduce((acc, result) => acc + parseInt(result), 0);
  const handleShow = (benchmark)=> {
    setShow(true);
    setBenchmark(benchmark);
  }
  const handleClose = ()=> {
    setShow(false);
  }
  const dispatch = useDispatch();
  useEffect(()=>{
    if(total === 0 )dispatch($findPublished());
    // dispatch(findUserDetails());
  },[]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <MetaTags>
        <title>Benchmarks -Fitemos </title>
        <meta
          name="description"
          content="Benchmarks -Fitemos"
        />
      </MetaTags>
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
                      {benchmark.result === "" ? (
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
      <SectionEditBenchmark
        handleClose={handleClose}
        show={show}
        benchmark={benchmark}
      />
    </>
  )
};

export default BenchmarksPage;
