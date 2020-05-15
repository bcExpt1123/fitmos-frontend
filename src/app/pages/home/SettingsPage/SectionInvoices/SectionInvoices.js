import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SplashScreen from "../../../../../app/partials/layout/SplashScreen";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { $page, $changeConditionValue,$showInvoice } from "../../../../../modules/subscription/invoice";

const SectionInvoices = () => {
  const [activePage, setActivePage] = useState(1);
  const [id, setId] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($changeConditionValue("customer_id", currentUser.customer.id));
  }, [currentUser]);
  useEffect(() => {
    if(id>0)dispatch($showInvoice(id));
  }, [id]);

  const invoice = useSelector(({ invoice }) => invoice.item);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const invoices = useSelector(({ invoice }) => invoice.data);
  const meta = useSelector(({ invoice }) => invoice.meta);
  const handlePageChange = (number) => {
    setActivePage(number);
    dispatch($page(number));
  }
  
  const splashScreenVisible = (invoice&&invoice.id==id)===false;
  console.log(splashScreenVisible)
  /*useEffect(() => {
    const splashScreen = document.getElementById("splash-screen");

    if (splashScreenVisible) {
      splashScreen.classList.remove("hidden");
    }else{
      splashScreen.classList.add("hidden");
    }
  }, [splashScreenVisible]);*/

  return (
    <div className='container mt-5 mb-5'>
      {(id==0) ? (
        <>
          <Table responsive className='invoices'>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Factura No</th>
                <th>Plan</th>
                <th>Tiempo</th>
                <th>Monto</th>
                <th>Imprimir</th>
              </tr>
            </thead>
            <tbody>
              {invoices != null &&
                invoices.map(row => (
                  <tr key={row.id}>
                    <td>{row.paid_date}</td>
                    <td>{row.id}</td>
                    <td>{row.transaction.plan.service.title}</td>
                    <td>{row.transaction.frequency}</td>
                    <td>${row.transaction.total}</td>
                    <td>
                      <IconButton
                        aria-label="Print"
                        title="Print"
                        style={{padding:0,color:'#212529'}}
                        onClick={()=>setId(row.id)}
                      >
                        <VisibilityIcon color={"black"} />
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
        </>
      ):(
        (invoice&&invoice.id==id)?(
        <div className="kt-invoice-2">
          <div className="kt-invoice__head">
            <div className="kt-invoice__container">
              <div className="kt-invoice__brand">
                <h1 className="kt-invoice__title">FACTURA</h1>
                <div href="#" className="kt-invoice__logo">
                  <a href="#"><img src={toAbsoluteUrl('/media/logos/Fitmose-logo.png')} style={{height:'50px'}} /></a>
                  <span className="kt-invoice__desc">
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
              <div className="kt-invoice__items">
                <div className="kt-invoice__item">
                  <span className="kt-invoice__subtitle">FECHA</span>
                  <span className="kt-invoice__text">{invoice.doneDate}</span>
                </div>
                <div className="kt-invoice__item">
                  <span className="kt-invoice__subtitle">No. Factura</span>
                  <span className="kt-invoice__text">{invoice.id}</span>
                </div>
                <div className="kt-invoice__item">
                  <span className="kt-invoice__subtitle">Facturado a</span>
                  <span className="kt-invoice__text">{invoice.to}.<br /></span>
                </div>
              </div>
            </div>
          </div>
          <div className="kt-invoice__body">
            <div className="kt-invoice__container">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Frecuencia</th>
                      <th>Monto</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{invoice.serviceName}</td>
                      <td>{invoice.transaction.frequency}</td>
                      <td className="kt-font-danger kt-font-lg">${invoice.transaction.total}</td>
                      <td>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="kt-invoice__footer">
            <div className="kt-invoice__container">
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        Entrenamiento del&nbsp;{invoice.startDate}&nbsp;al&nbsp;{invoice.expiredDate}&nbsp;
                        Próxima renovación de plan&nbsp;{invoice.nextPaymentDate}.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="kt-invoice__actions">
            <div className="kt-invoice__container">
              <button type="button" className="btn btn-brand btn-bold" onClick={()=>setId(0)}>Atrás</button>
              <button type="button" className="btn btn-brand btn-bold" onClick={()=>window.print()}>Imprimir factura</button>
            </div>
          </div>
        </div>
        ):(
          <div className="loading">
            <SplashScreen />
          </div>
        )
      )}
    </div>
  )
};

export default SectionInvoices;
