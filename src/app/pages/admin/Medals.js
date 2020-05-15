import React, { Component } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RedoIcon from "@material-ui/icons/Redo";
import { red } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $fetchIndex,
  $delete
} from "../../../modules/subscription/medal";


const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 500
  },
  icon: {
    margin: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  iconHover: {
    margin: theme.spacing(2),
    "&:hover": {
      color: red[800]
    }
  }
}));
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "count", numeric: false, disablePadding: false, label: "Count" },
  { id: "image", numeric: false, disablePadding: false, label: "Image" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main({ medals, $delete }) {
  const classes = useStyles();
  const actionDelete = id => medal => {
    if (window.confirm("Are you sure to delete this item?")) $delete(id);
  };
  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-label="custom pagination table">
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
              {medals != null &&
                medals.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">
                      {row.count}
                    </TableCell>
                    <TableCell align="left">
                      <img src={row.image} />
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      <NavLink
                      className=""
                      aria-label="Medal Edit"
                      title="Medal Edit"
                      to={`/admin/medals/${row.id}`}
                      >
                      <IconButton
                          className={classes.button}
                          aria-label="Edit"
                          title="Edit"
                          color="secondary"
                      >
                          <EditIcon />
                      </IconButton>
                      </NavLink>    
                      <IconButton
                        className={classes.button}
                        aria-label="Delete"
                        title="Delete"
                        onClick={actionDelete(row.id)}
                        >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

            </TableBody>
          </Table>
        </div>
      </Paper>
    </>
  );
}
const mapStateToProps = state => ({
  medals: state.medal.data,
});
const mapDispatchToProps = {
  $delete
};
const MedalConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class MedalWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
  }
  render() {
    return (
      <>
        <MedalConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex
};

const Medals = injectIntl(connect(null, mapDispatchToProps1)(MedalWrapper));
function Sub() {
  const classes = useStyles();
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

        <h3 className="kt-subheader__title">Medals</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Create"
            to={"/admin/medals/create"}
          >
            <span className="MuiButton-label">Create &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const SubHeaderMedals = injectIntl(
  Sub
);
export { Medals, SubHeaderMedals };
