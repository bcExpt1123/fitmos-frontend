import React,{useState, useEffect, useRef} from "react";
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
  const [height, setHeight] = useState(230);
  useEffect(()=>{
    dispatch($findPublished());
    // dispatch(findUserDetails());
    changeDimesions();
    setTimeout(changeDimesions,50);
    function handleResize() {
      changeDimesions();
    }
    window.addEventListener('resize', handleResize) 
    return ()=>window.removeEventListener("resize", handleResize);   
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const changeDimesions = ()=>{
    console.log(window.innerWidth)
    if(window.innerWidth>900)setHeight(window.innerWidth/4-50);
    if(window.innerWidth<768)setHeight(window.innerWidth-150);
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
      <div className="benchmarks">
        <Row>
          {benchmarks.map(benchmark => (
            <Col xs={12} md={3} key={benchmark.id}>
              <div
                className="content"
                onClick={() => handleShow(benchmark)}
              >
                <div className="image cursor-pointer"
                  style={{
                    backgroundImage: "url(" + benchmark.image + ")"
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
