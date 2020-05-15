import React, { Component, useEffect } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  $showInvoice, $page
} from "../../../modules/subscription/invoice";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";

const useStyles = makeStyles(theme => ({
}));
function InvoicePrint() {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($showInvoice(id));
  }, [id]);
  const invoice = useSelector(({ invoice }) => invoice.item);
  return (
    <Paper className={classes.root}>
      {invoice ? (
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
                  <span className="kt-invoice__subtitle">NO.Factura</span>
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
              <button type="button" className="btn btn-brand btn-bold" onClick={()=>window.print()}>Print Invoice</button>
            </div>
          </div>
        </div>
      ) : (
          <div>
            No Invoice
        </div>
        )
      }
    </Paper>
  );
}
function SubHeaderInvoicePrint() {
  const { id } = useParams();
  return (
    <>
      <div className="kt-subheader__main">
        {false && (
          <button
            className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left"
            id="kt_subheader_mobile_toggle"
          >
            <span />
          </button>
        )}
        {id ? (
          <h3 className="kt-subheader__title">
            Invoice {id}
          </h3>
        ) : (
            <h3 className="kt-subheader__title">No invoice</h3>
          )}
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
        </div>
      </div>
    </>
  );
}
export { InvoicePrint, SubHeaderInvoicePrint };
