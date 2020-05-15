import React, { useEffect } from "react";
import { connect,useSelector,useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
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
import {
    $fetchRequestCms,
    $openCell,
    $openPreviewCell,
    $updateItemValue,
    $submitContent
  } from "../../../modules/subscription/weekWorkout";
const weekdates = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];  
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
  weekDay,
  history,
  match  
}) {
  const classes = useStyles();
  const weeks = [0, 1, 2, 3, 4, 5, 6];
  const data = useSelector(({ weekWorkout }) => weekWorkout.data);
  const column = useSelector(({ weekWorkout }) => weekWorkout.column);
  const content = useSelector(({ weekWorkout }) => weekWorkout.content);
  const day = useSelector(({ weekWorkout }) => weekWorkout.day);
  const previewContent = useSelector(({ weekWorkout }) => weekWorkout.previewContent);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($fetchRequestCms(history,match.params.id));
  }, []);
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
      dispatch($openCell(weekDay, column, day));
    }
  };
  const handleClickPreview = (day, column) => {
    setOpenPreview(true);
    dispatch($openPreviewCell(weekDay, column, day));
  };
  const activateWorkout = (dayNumber, column) => {
    switch (dayNumber) {
      case 0:
        if (column == "blog" || column == "activo" || weekDay>dayNumber) return false;
        break;
      case 1:
        if (column == "blog" || weekDay>dayNumber) return false;
        break;
      case 2:
        if (column == "blog" || column == "activo" || weekDay>dayNumber) return false;
        break;
      case 3:
        if (column != "blog" || weekDay>dayNumber) return false;
        break;
      case 4:
        if (column == "blog" || weekDay>dayNumber) return false;
        break;
      case 5:
        if (column == "activo" || weekDay>dayNumber) return false;
        break;
      case 6:
        if (column != "blog" || weekDay>dayNumber) return false;
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
    dispatch($submitContent(weekDay));
  };
  const handleChange = event => {
    dispatch($updateItemValue(event.target.value));
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
                Monday
              </TableCell>
              <TableCell
                key={"2"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                Tuesday
              </TableCell>
              <TableCell
                key={"3"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                Wednesday
              </TableCell>
              <TableCell
                key={"4"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                Thursday
              </TableCell>
              <TableCell
                key={"5"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                Friday
              </TableCell>
              <TableCell
                key={"6"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                Saturday
              </TableCell>
              <TableCell
                key={"0"}
                align={"left"}
                padding={"default"}
                sortDirection={false}
                width={"400px"}
              >
                Sunday
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
                    {data[weekDay]&&data[weekDay][col] != undefined &&
                      data[weekDay][col][row] != undefined && data[weekDay][col][row] != "" && (
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
                        {data[weekDay]&&data[weekDay][col] != undefined &&
                          data[weekDay][col][row] != undefined &&
                          data[weekDay][col][row]}
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
          {weekdates[weekDay]}'s {weekdates[day]} &nbsp;&nbsp;
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
          {weekdates[weekDay]}'s {weekdates[day]}&nbsp;&nbsp;
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
const WeekEditor = injectIntl(
  withRouter(Main)
);
export default WeekEditor;