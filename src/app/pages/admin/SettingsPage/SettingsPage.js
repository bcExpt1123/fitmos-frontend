import React from "react";
import { makeStyles } from "@material-ui/core";
import {Paper} from "@material-ui/core";
import SubMenu from "../../../../app/components/SubMenu";

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

const SettingsPage = ({ section }) => {
  const classes = useStyles();
  const profileLinks = [
    { name: "cart", url: "cart", label: "Abandon Cart Settings" },
    { name: "permissions", url: "permissions", label: "Roles & Permissions" },
    { name: "referral", url: "referral", label: "Referral Discount" },
    { name: "tagLine", url: "tag-line", label: "Tag Line" },
    { name: "reports", url: "reports", label: "Reports" }
  ];
  return (
    <>
      <Paper className={classes.root} style={{ padding: "25px" }}>
        <SubMenu links={profileLinks}/>
        {/* TODO: can be replaced with context to reduce drilling */}
        {section()}
      </Paper>
    </>
  );
};
const SubHeader =  ({title}) =>(
  <>
    <div className="kt-subheader__main">
    <h3 className="kt-subheader__title">{title}</h3>
      <span className="kt-subheader__separator kt-subheader__separator--v" />
      <span className="kt-subheader__desc"></span>
    </div>

    <div className="kt-subheader__toolbar">
      <div className="kt-subheader__wrapper">
      </div>
    </div>
  </>
)
export {SettingsPage,SubHeader};
