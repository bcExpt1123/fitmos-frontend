import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { $changeItem } from "../../../modules/subscription/customer";
import { makeStyles } from "@material-ui/core";
import { Button, Paper, MenuList, Grow, Popper, MenuItem, ClickAwayListener } from "@material-ui/core";
import { Tabs, Tab } from "react-bootstrap";
import CustomerOverview from "./CustomerOverview";
import { CustomerTransactions } from "./CustomerTransactions";
import { CustomerInvoices } from "./CustomerInvoices";
import { can } from "../../../lib/common";
import MuteDialog from "./dialog/MuteDialog";
import { http } from '../home/services/api';

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
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  return (
    <Paper style={{ padding: "25px" }}>
      {item ? (
        <div id="customer-form">
          {can(currentUser, "customers")?<> 
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
          </>:
            <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example">
              <Tab eventKey="overview" title="Overview">
                <CustomerOverview />
              </Tab>
            </Tabs>
          }
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

function Sub({$changeItem, match, item, isloading}){
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const classes = useStyles();
  const id = match.params.id;
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch($changeItem(id));
  },[id]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const [muteOpen, setMuteOpen] = useState(false);
  const handleMute = (event)=>{
    setMuteOpen(true);
    handleClose(event);
  }
  const handleUnmute = (event)=>{
    handleClose(event);
    if(window.confirm('Are you sure to unmute this customer')){
      http({
        path:'admin-actions',
        method:'POST',
        data:{
          customer_id:item.id,
          type:'unmute'
        }
      }).then(res=>{
        dispatch($changeItem(item.id));
      })
    }
  }
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
          item ? (
            <h3 className="kt-subheader__title">
              {item.first_name} {item.last_name}
              {item.coupon && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ marginLeft: "20px" }}
                >
                  {item.coupon.code}
                </Button>
              )}
            </h3>
          ) : isloading ? (
            <h3 className="kt-subheader__title">Loading...</h3>
          ) : (
            <h3 className="kt-subheader__title">There is no item</h3>
          )
        ) : (
          <h3 className="kt-subheader__title">New Customer</h3>
        )}
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          {can(currentUser, "customers") && <>
            <Button
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              variant="contained"
              color="primary"
              className={classes.button}
              style={{ marginRight: "20px" }}
            >
              Actions
            </Button>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        {item.muteStatus?<MenuItem onClick={handleUnmute}>Unmute</MenuItem>:<MenuItem onClick={handleMute}>Mute</MenuItem>}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>}
          <div style={{display:'inline'}}>{item&&item.status}</div>
        </div>
      </div>
      {muteOpen && <MuteDialog open={muteOpen} customer={item} handleClose={()=>setMuteOpen(false)}/>}
    </>
  );
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
