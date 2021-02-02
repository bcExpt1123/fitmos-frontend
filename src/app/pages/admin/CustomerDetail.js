import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { $changeItem } from "../../../modules/subscription/customer";
import { makeStyles } from "@material-ui/core";
import { Button, Paper} from "@material-ui/core";
import {Tabs, Tab} from "react-bootstrap";
import CustomerOverview from "./CustomerOverview";
import { CustomerTransactions } from "./CustomerTransactions";
import { CustomerInvoices } from "./CustomerInvoices";

const useStyles = () => {
  return makeStyles(theme => ({
    root: {
      display: "block",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    margin: {
      margin: theme.spacing(1)
    }
  }));
};

function Main({ item, isloading }) {
  return (
    <Paper style={{ padding: "25px" }}>
      {item ? (
        <div id="customer-form">
          <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example">
            <Tab eventKey="overview" title="Overview">
              <CustomerOverview />
            </Tab>
            <Tab eventKey="transactions" title="Transactions">
              <CustomerTransactions />
            </Tab>
            <Tab eventKey="invoices" title="Invoices">
              <CustomerInvoices />
            </Tab>
          </Tabs>
        </div>
      ) : isloading ? (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          Loading...
        </h3>
      ) : (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          The Item doesn't exist
        </h3>
      )}
    </Paper>
  );
}
const mapStateToProps = state => ({
  item: state.customer.item,
  errors: state.customer.errors,
  isloading: state.customer.isloading
});
const mapDispatchToProps = {};
const CustomerDetail = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))
);

class Sub extends Component {
  componentDidMount() {
    this.id = this.props.match.params.id;
    this.props.$changeItem(this.id);
    this.classes = useStyles();
  }
  useStyles() {
    return makeStyles(theme => ({
      root: {
        display: "block",
        flexWrap: "wrap"
      },
      textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
      },
      margin: {
        margin: theme.spacing(1)
      }
    }));
  }
  render() {
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
          {this.id ? (
            this.props.item ? (
              <h3 className="kt-subheader__title">
                {this.props.item.first_name} {this.props.item.last_name}
                {this.props.item.coupon && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={this.classes.button}
                    style={{ marginLeft: "20px" }}
                  >
                    {this.props.item.coupon.code}
                  </Button>
                )}
              </h3>
            ) : this.props.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )
          ) : (
            <h3 className="kt-subheader__title">New Customer</h3>
          )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <div>{this.props.item&&this.props.item.status}</div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToPropsSub = state => ({
  item: state.customer.item,
  isSaving: state.customer.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem
};
const SubHeaderCustomerDetail = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { CustomerDetail, SubHeaderCustomerDetail };
