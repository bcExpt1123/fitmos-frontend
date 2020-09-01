import React, {useState, useEffect} from "react";
import { useDispatch} from "react-redux";
import MetaTags from "react-meta-tags";
import {Button, Row, Col, Table} from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import Pagination from "react-js-pagination";
import {IconButton} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import classnames from "classnames";

import FormGroup from "./components/FormGroup";
import ThreeColumn from "./layouts/Three";
import PageHeader from "./layouts/PageHeader";
import { http } from "./services/api";
import { serializeQuery } from "../../../app/components/utils/utils";
import { authenticate as regenerateAuthAction } from "./redux/auth/actions";

const validate = values => {
  const errors = {};
  if (!values.repetition) {
    errors.repetition = {
      id: "LogInForm.Error.Email.required"
    };
  }

  return errors;
};
const LevelPage = () => {
  const [focused, setFocused] = useState({});
  const [id, setId] = useState(null);
  const [repetition, setRepetion] = useState("");
  const [recordingDate,setRecordingDate] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [meta, setMeta] = useState({
    page: 1,
    pageSize: 10,
    pageTotal: 1,
    total: 0
  });
  const dispatch = useDispatch();
  useEffect(() => {
    fetchRecords(activePage);
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const fetchRecords = async (page)=>{
    const res = await http({
      path: `levelTests?${serializeQuery({
        pageSize: meta.pageSize,
        pageNumber: page - 1,
      })}`
    });
    if(res.data){
      setRecords(res.data.results.data);
      setMeta({
        page,
        pageSize:10,
        pageTotal:res.data.results.last_page,
        total:res.data.results.total,
      });  
      if(res.data.current>100)setCurrentLevel(100);
      else if(res.data.current<0)setCurrentLevel(0);
      else {
        setCurrentLevel(res.data.current);
      }
    }
  }
  const onSubmit = async ({ repetition }, { setSubmitting }) => {
    if (id) {
      await http({
        method: "PUT",
        app: "user",
        path: "levelTests/" + id,
        data: {
          repetition,
          id: id
        }
      });
    } else {
      await http({
        method: "POST",
        app: "user",
        path: "levelTests",
        data: {
          repetition
        }
      });
    }
    setSubmitting(false);
    setId(null);
    setRepetion("");
    setRecordingDate(new Date());
    setActivePage(1);
    fetchRecords(activePage);
    dispatch(regenerateAuthAction());
  };
  const handleFocus = (event)=> {
    const { name } = event.target;
    setFocused({
        [name]: true
      }
    );
  }
  const handlePageChange = (number) => {
    setActivePage(number);
    fetchRecords(number);
  }
  const deleteAction = async (id)=>{
    await http({
      method: "DELETE",
      app: "user",
      path: "levelTests/" + id,
    });
    setId(null);
    setRepetion("");
    setRecordingDate(new Date());
    setActivePage(1);
    fetchRecords(activePage);
  }
  return (
  <>
    <MetaTags>
      <title>Nivel Físico -Fitemos </title>
      <meta
        name="description"
        content="Nivel Físico -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      <PageHeader title={`Nivel Físico`}/>
      <div className="row condition-level">
        <div className="col-12 col-md-7">
          <div>
            <h4 className="mb-2 mt-2">Máximos Burpees en 5:00 minutos.</h4>
            <p>En este prueba determinaremos el nivel de condición física. 
              La intensidad del programa se ajustará en función del resultado. 
              Esta prueba se recomienda realizarla en una ventana mínima de dos semanas entre pruebas. 
              Al realizarla ingresaremos nuestro puntaje en el recuadro inferior.</p>
          </div>
          <div>
            <h4 className="mb-3 mt-2">Ingresar Repeticiones</h4>
            <Formik
              enableReinitialize
              validate={validate}
              onSubmit={onSubmit}
              initialValues={{
                repetition: repetition,
                recordingDate: recordingDate
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors
              }) => (
                <Form className="auth-form">
                  <Row>
                    <Col xs={6} md={4}>
                      <FormGroup
                        hasValue={Boolean(values.repetition)}
                        name="repetition"
                        htmlFor="repetition"
                        label={""}
                        focused={focused.repetition}
                        touched={touched.repetition}
                        valid={Boolean(values.repetition && !errors.repetition)}
                      >
                        <Field
                          id="repetition"
                          type="number"
                          name="repetition"
                          autoComplete="given-name"
                          onFocus={handleFocus}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="mt-4">
                        {recordingDate.getMonth()+1}/{recordingDate.getDate()}/{recordingDate.getFullYear()}
                        {id&&(
                          <>
                            <Button type="submit" variant="today">
                              Hoy
                            </Button>                        
                          </>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} md={5}>
                      <Button type="submit" variant="save">
                        Ingresar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>
          <div>
            <h4 className="mb-2 mt-2">Registro de Repeticiones</h4>
            <Table responsive className='records'>
              <thead>
                <tr>
                  <th>Repeticiones</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {records != null &&
                  records.map(row => (
                    <tr key={row.id}>
                      <td>{row.repetition}</td>
                      <td>{row.created_date}</td>
                      <td>
                        <IconButton
                          aria-label="Eliminar"
                          title="Eliminar"
                          style={{padding:0,color:'#212529'}}
                          onClick={()=>deleteAction(row.id)}
                        >
                          <DeleteIcon color={"error"} />
                        </IconButton>                      
                      </td>
                    </tr>              
                  ))}
              </tbody>
            </Table>
          <div className="pagination-wrapper pb-3">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={meta.pageSize}
              totalItemsCount={meta.total}
              itemClass="page-item"
              linkClass="page-link"
              onChange={handlePageChange}
            />
          </div>
          </div>
        </div>
        <div className="col-12 col-md-5 row no-glutter">
          <div className="col-6">
            <div className={classnames("number-level",{active:currentLevel>79})}>Nivel Fisico 5</div>
            <div className={classnames("number-level",{active:currentLevel>59 && currentLevel<=79})}>Nivel Fisico 4</div>
            <div className={classnames("number-level",{active:currentLevel>39 && currentLevel<=59})}>Nivel Fisico 3</div>
            <div className={classnames("number-level",{active:currentLevel>19 && currentLevel<=39})}>Nivel Fisico 2</div>
            <div className={classnames("number-level",{active:currentLevel>0 && currentLevel<=19})}>Nivel Fisico 1</div>
          </div>
          <div className="col-2 container">
            <div className="vertical">
              <div className="level-bar level-bar-info" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="80" style={{height: ((currentLevel>80)?100:currentLevel/0.8)+'%'}}>
              </div>  
            </div>
          </div>
          <div className="col-4">
            <div className="number-level-value">+80</div>
            <div className="number-level-value">60</div>
            <div className="number-level-value">40</div>
            <div className="number-level-value">20</div>
            <div className="number-level-value">0</div>
          </div>
        </div>
      </div>
    </ThreeColumn>
  </>
)};

export default LevelPage;
