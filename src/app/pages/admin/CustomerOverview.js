import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Table, TableHead, TableBody, TableCell, TableRow, Grid } from "@material-ui/core";
const headRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Subscription" },
  {
    id: "frequency",
    numeric: false,
    disablePadding: false,
    label: "Frequency"
  },
  { id: "start", numeric: false, disablePadding: false, label: "Start" },
  { id: "end", numeric: false, disablePadding: false, label: "End" },
  {
    id: "active_time",
    numeric: false,
    disablePadding: false,
    label: "Active Time"
  },
  { id: "total", numeric: false, disablePadding: false, label: "Total Paid" },
  {
    id: "monthly_cost",
    numeric: false,
    disablePadding: false,
    label: "Monthly cost"
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" }
];
function Main({ item }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Email</label>
        {item.email}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">WhatsApp</label>
        {item.whatsapp_phone_number}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Coupon</label>
        {item.coupon && item.coupon.code}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Country</label>
        {item.country}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Gender</label>
        {item.gender}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Age</label>
        {item.age}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Registration Date</label>
        {item.registration_date}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">First Payment Date</label>
        {item.first_payment_date}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Height</label>
        {parseInt(item.current_height)}
        {item.current_height_unit}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Peso Inicial</label>
        {parseInt(item.initial_weight)}
        {item.initial_weight_unit}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Peso Actual</label>
        {parseInt(item.current_weight)}
        {item.current_weight_unit}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Diferencia de Peso</label>
        {item.initial_weight &&
          item.current_weight &&
          (item.initial_weight - item.current_weight).toFixed(2)}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">IMC inicial</label>
        {item.initial_imc}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">IMC actual</label>
        {item.imc}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">Diferencia IMC</label>
        {item.initial_imc &&
          item.imc &&
          item.current_weight &&
          item.current_height &&
          (item.initial_imc - item.imc).toFixed(2)}
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={12}>
        <h2>Fitness Data</h2>
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">
          Condición Física Inicial
        </label>
        {item.initial_condition}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">
          Condición Física Actual
        </label>
        {item.current_condition}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">
          Diferencia Nivel Físico
        </label>
        {item.initial_condition &&
          item.current_condition &&
          (item.current_condition - item.initial_condition).toFixed(0)}
      </Grid>
      <Grid item xs={3}>
        <label className="font-weight-bold d-block">
          Lugar de Entrenamiento
        </label>
        {item.training_place}
      </Grid>
      <Grid item xs={12}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {headRows.map(row => (
                <TableCell
                  key={row.id}
                  align={"left"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={false}
                >
                  {row.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {item.subscriptions != null &&
              item.subscriptions.map(row => (
                <TableRow key={row.id}>
                  <TableCell scope="row">
                    {row.service_name}
                    <br />
                    {row.service_id === 1 && "+" + item.objective}
                  </TableCell>
                  <TableCell align="left">{row.frequency_name}</TableCell>
                  <TableCell align="left">{row.start_date}</TableCell>
                  <TableCell align="left">{row.end_date}</TableCell>
                  <TableCell align="left">{row.active_time}</TableCell>
                  <TableCell align="left">{row.total_paid}</TableCell>
                  <TableCell align="left">{row.monthly_cost}</TableCell>
                  <TableCell align="left">{row.status}</TableCell>
                </TableRow>
              ))}
            {item.subscriptions != null && item.subscriptions.length > 0 && (
              <TableRow>
                <TableCell scope="row">Total</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left">{item.total_paid}</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
const mapStateToProps = state => ({
  item: state.customer.item,
  isloading: state.customer.isloading
});
const mapDispatchToProps = {};
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Main));
