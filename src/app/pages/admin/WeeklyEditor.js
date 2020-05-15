import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import {
  $datePicked,
  $prevWeek,
  $nextWeek,
  $fetchWeeklyCms,
  $openCell,
  $openPreviewCell,
  $updateItemValue,
  $submitContent
} from "../../../modules/subscription/cms";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Markup } from "interweave";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const useStyles = makeStyles(theme => ({
  border: {
    border: "1px solid rgba(224, 224, 224, 1)"
  },
  cell: {
    marginTop: "-14px",
    height: "80px",
    overflow: "auto",
    cursor: "pointer",
    whiteSpace: "pre-wrap"
  },
  emptyCell: {
    marginTop: "-14px",
    height: "80px",
    overflow: "auto",
    whiteSpace: "pre-wrap"
  },
  preview: {
    marginTop: "-27px",
    marginLeft: "auto",
    width: "30px"
  },
  blog: {
    backgroundColor: "grey"
  }
}));

function Main({
  pickedDate,
  data,
  $openCell,
  editorDate,
  column,
  content,
  $updateItemValue,
  $submitContent,
  $openPreviewCell,
  previewContent
}) {
  const classes = useStyles();
  const onDatePicked = date => {
    //$datePicked(date.toDate(),history);
  };
  const copiedDate = new Date(pickedDate.getTime());
  if(copiedDate.getDay()==0){
    let date = copiedDate.getDate() - copiedDate.getDay() -7;
    copiedDate.setDate(date);
  }
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const labelOptions = { month: "long", day: "numeric", weekday: "long" };
  const weeks = [0, 1, 2, 3, 4, 5, 6];
  const dateLabel = (number) => {
    let date = copiedDate.getDate() - copiedDate.getDay() + number;
    let dayString = new Date(copiedDate.setDate(date)).toLocaleDateString(
      "en",
      labelOptions
    );
    return dayString;
  }
  const columnLabels = {
    comentario: "Comentario del día",
    calentamiento: "A. Calentamiento",
    con_content: "B. Rutina (Full)",
    sin_content: "B. Rutina (Corporal)",
    extra_sin: "C. Extra (Corporal)",
    strong_male: "C. Extra (Fuerza Hombre)",
    strong_female: "C. Extra (Fuerza Mujer)",
    fit: "C. Extra (Mejor condición física)",
    cardio: "C. Extra (Pérdida de Peso)",
    activo: "C. Descanso Activo",
    blog: "Blog Semanal"
  };
  //const columns = [0,1,2,3,4];
  const columns = [
    "comentario",
    "calentamiento",
    "con_content",
    "sin_content",
    "extra_sin",
    "strong_male",
    "strong_female",
    "fit",
    "cardio",
    "activo",
    "blog"
  ];
  const [open, setOpen] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const handleClickOpen = (day, column) => {
    if (activateWorkout(day, column)) {
      setOpen(true);
      let cellDate = new Date(pickedDate.getTime());
      const weekDay = cellDate.getDay();
      console.log(weekDay);
      let date = cellDate.getDate() - cellDate.getDay() + day+1;
      if(weekDay == 0){
        date = cellDate.getDate() - cellDate.getDay() + day-6;
      }
      cellDate.setDate(date);
      $openCell(cellDate, column, day);
    }
  };
  const handleClickPreview = (day, column) => {
    setOpenPreview(true);
    let cellDate = new Date(pickedDate.getTime());
    const weekDay = cellDate.getDay();
    let date = cellDate.getDate() - cellDate.getDay() + day+1;
    if(weekDay == 0){
      date = cellDate.getDate() - cellDate.getDay() + day-6;
    }
    cellDate.setDate(date);
    $openPreviewCell(cellDate, column, day);
  };
  const activateWorkout = (dayNumber, column) => {
    switch (dayNumber) {
      case 0:
        if (column == "blog" || column == "activo") return false;
        break;
      case 1:
        if (column == "blog") return false;
        break;
      case 2:
        if (column == "blog" || column == "activo") return false;
        break;
      case 3:
        if (column != "blog") return false;
        break;
      case 4:
        if (column == "blog") return false;
        break;
      case 5:
        if (column == "activo") return false;
        break;
      case 6:
        if (column != "blog") return false;
        break;
    }
    return true;
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  const handleSave = () => {
    setOpen(false);
    $submitContent();
  };
  const handleChange = event => {
    $updateItemValue(event.target.value);
  };
  return (
    <Paper className={classes.root}>
      <div className="weekly-editor">
        <Table className={classes.border} border={1}>
          <TableHead>
            <TableRow>
              <TableCell
                key={"column"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
              >
                Column
              </TableCell>
              <TableCell
                key={"1"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                {dateLabel(1)}
              </TableCell>
              <TableCell
                key={"2"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                {dateLabel(2)}
              </TableCell>
              <TableCell
                key={"3"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                {dateLabel(3)}
              </TableCell>
              <TableCell
                key={"4"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                {dateLabel(4)}
              </TableCell>
              <TableCell
                key={"5"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                {dateLabel(5)}
              </TableCell>
              <TableCell
                key={"6"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                {dateLabel(6)}
              </TableCell>
              <TableCell
                key={"0"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                {dateLabel(7)}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map(row => (
              <TableRow key={row}>
                <TableCell component="th" scope="row">
                  {columnLabels[row]}
                </TableCell>
                {weeks.map((col, index) => (
                  <TableCell
                    align="left"
                    key={index}
                    className={classnames({
                      blog: activateWorkout(col, row) == false
                    })}
                  >
                    {data[row] != undefined &&
                      data[row][col] != undefined && data[row][col] != "" && (
                        <div className={classes.preview}>
                          <IconButton
                            className={classes.button}
                            aria-label="Edit"
                            title="Edit"
                            color="secondary"
                            onClick={() => handleClickPreview(col, row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </div>
                      )}
                    {activateWorkout(col, row) ? (
                      <div
                        className={classes.cell}
                        onClick={() => handleClickOpen(col, row)}
                      >
                        {data[row] != undefined &&
                          data[row][col] != undefined &&
                          data[row][col]}
                      </div>
                    ) : (
                        <div
                          className={classes.emptyCell}
                          onClick={() => handleClickOpen(col, row)}
                        >
                          &nbsp;
                      </div>
                      )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-workout-edit-title"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-workout-edit-title">
          {editorDate && editorDate.toLocaleDateString(undefined, labelOptions)}{" "}
          {column && columnLabels[column]}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please write down workout content.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label=""
            type="email"
            multiline={true}
            rows={26}
            rowsMax={28}
            value={content}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        aria-labelledby="form-dialog-workout-preview-title"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-workout-preview-title">
          {editorDate && editorDate.toLocaleDateString(undefined, labelOptions)}{" "}
          {column && columnLabels[column]}
        </DialogTitle>
        <DialogContent>
          <Row>
            <Col sm={6}>
              <h4>Email Preview</h4>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {previewContent.content && (
                  <Markup content={previewContent.content[0]} />
                )}
              </div>
            </Col>
            <Col sm={6}>
              <h4>Whatsapp Preview</h4>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {previewContent.whatsapp && previewContent.whatsapp[0]}
              </div>
            </Col>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
const mapStateToProps = state => ({
  pickedDate: state.cms.pickedDate,
  data: state.cms.data,
  editorDate: state.cms.editorDate,
  column: state.cms.column,
  content: state.cms.content,
  previewContent: state.cms.previewContent
});
const mapDispatchToProps = {
  $datePicked,
  $openCell,
  $openPreviewCell,
  $updateItemValue,
  $submitContent
};
const WeeklyEditor = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);

class Sub extends Component {
  constructor(props) {
    super(props);
    this.handlePrevWeek = this.handlePrevWeek.bind(this);
    this.handleNextWeek = this.handleNextWeek.bind(this);
  }

  componentDidMount() {
    this.props.$fetchWeeklyCms(this.props.history);
  }
  getWeekDays(date) {
    let copiedDate = new Date(date.getTime());
    const options = { year: "numeric", month: "short", day: "numeric" };
    const weekDay = copiedDate.getDay();
    var first = copiedDate.getDate() - weekDay; // First day is the day of the month - the day of the week
    if(weekDay == 0){
      first = first - 7;
    }
    var last = first + 7; // last day is the first day + 6

    var firstday = new Date(copiedDate.setDate(first+1)).toLocaleDateString(
      undefined,
      options
    );
    copiedDate = new Date(date.getTime());
    var lastday = new Date(copiedDate.setDate(last)).toLocaleDateString(
      undefined,
      options
    );
    return firstday + " - " + lastday;
  }
  handlePrevWeek() {
    return event => {
      this.props.$prevWeek();
    };
  }
  handleNextWeek() {
    return event => {
      this.props.$nextWeek();
    };
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
          {true ? (
            <>
              <h3 className="kt-subheader__title">
                <a onClick={this.handlePrevWeek()}>
                  <i className="la la-angle-left"></i>
                </a>
                &nbsp;&nbsp;
                {this.getWeekDays(this.props.pickedDate)}
                &nbsp;&nbsp;
                <a onClick={this.handleNextWeek()}>
                  <i className="la la-angle-right"></i>
                </a>
              </h3>
              <span className="kt-subheader__separator kt-subheader__separator--v" />
              <span className="kt-subheader__desc"></span>
            </>
          ) : true ? (
            <h3 className="kt-subheader__title">Loading...</h3>
          ) : (
                <h3 className="kt-subheader__title">There is no item</h3>
              )}
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              type="button"
              className="btn kt-subheader__btn-primary btn-primary MuiButton-root"
              onClick={this.props.history.goBack}
            >
              Back &nbsp;
            </Button>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToPropsSub = state => ({
  pickedDate: state.cms.pickedDate,
  isSaving: state.cms.isSaving
});
const mapDispatchToPropsSub = {
  $fetchWeeklyCms,
  $prevWeek,
  $nextWeek
};
const SubHeaderWeeklyEditor = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { WeeklyEditor, SubHeaderWeeklyEditor };
