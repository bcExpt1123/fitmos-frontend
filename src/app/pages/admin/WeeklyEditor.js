import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import {Table, TableHead, TableBody, TableCell, TableRow, Button, Paper, IconButton} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import classnames from "classnames";
import {
  $datePicked,
  $prevWeek,
  $nextWeek,
  $fetchWeeklyCms,
  $openCell,
  $openPreviewCell,
  $updateItemValue,
  $submitContent,
  $updateImage,
  $removeImage,
} from "../../../modules/subscription/cms";
import WorkoutEditDialog from "./dialog/WorkoutEditDialog";
import WorkoutImageEditDialog from "./dialog/WorkoutImageEditDialog";
import WorkoutNoteEditDialog from "./dialog/WorkoutNoteEditDialog";
import WorkoutPreviewDialog from "./dialog/WorkoutPreviewDialog";
import {timeType} from "../../../_metronic/utils/utils";

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
  timer: {
    marginRight: "auto",
    width: "100px",
    fontWeight:"600"
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
  note,
  image,
  timerType,
  work,
  round,
  rest,
  description,
  $updateItemValue,
  $submitContent,
  $updateImage,
  $removeImage,
  $openPreviewCell,
  previewContent
}) {
  const classes = useStyles();
  //const onDatePicked = date => {
    //$datePicked(date.toDate(),history);
  //};
  const copiedDate = new Date(pickedDate.getTime());
  if(copiedDate.getDay()===0){
    let date = copiedDate.getDate() - copiedDate.getDay() -7;
    copiedDate.setDate(date);
  }
  //const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const labelOptions = { month: "short", day: "numeric", weekday: "short" };
  const weeks = [0, 1, 2, 3, 4, 5, 6];
  const [weekDate, setWeekDate] = useState(false);
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
  const [openFirst, setOpenFirst] = React.useState(false);
  const [openBlock, setOpenBlock] = React.useState(false);
  const [openBlog, setOpenBlog] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const handleClickOpen = (day, column) => {
    if (activateWorkout(day, column)) {
      if(column === 'comentario'){
        setOpenFirst(true);
      }else if(column === 'blog'){
        setOpenBlog(true);
      }else{
        setOpenBlock(true);
      }
      let cellDate = new Date(pickedDate.getTime());
      const weekDay = cellDate.getDay();
      let date = cellDate.getDate() - cellDate.getDay() + day+1;
      if(weekDay === 0){
        date = cellDate.getDate() - cellDate.getDay() + day-6;
      }
      cellDate.setDate(date);
      setWeekDate(day);
      $openCell(cellDate, column, day);
    }
  };
  const handleClickPreview = (day, column) => {
    setOpenPreview(true);
    let cellDate = new Date(pickedDate.getTime());
    const weekDay = cellDate.getDay();
    let date = cellDate.getDate() - cellDate.getDay() + day+1;
    if(weekDay === 0){
      date = cellDate.getDate() - cellDate.getDay() + day-6;
    }
    cellDate.setDate(date);
    $openPreviewCell(cellDate, column, day);
  };
  const activateWorkout = (dayNumber, column) => {
    switch (dayNumber) {
      case 0:
        if (column === "blog" || column === "activo") return false;
        break;
      case 1:
        if (column === "blog") return false;
        break;
      case 2:
        if (column === "blog" || column === "activo") return false;
        break;
      case 3:
        if (column !== "blog") return false;
        break;
      case 4:
        if (column === "blog") return false;
        break;
      case 5:
        if (column === "activo") return false;
        break;
      case 6:
        if (column !== "blog") return false;
        break;
        default:  
    }
    return true;
  };
  const checkComplete = (dayNumber, column) => {
    if(activateWorkout(dayNumber, column)===false) return true;
    if(!data[column]) return false;
    switch(column){
      case "comentario":
        if(data[column][dayNumber] == null || data[column][dayNumber] == "")return false;
        if(data['image_path'][dayNumber] == null || data['image_path'][dayNumber] == "")return false;
      break;
      case "calentamiento":
      case "con_content":
      case "sin_content":
      case "extra_sin":
      case "strong_male":
      case "strong_female":
      case "fit":
      case "cardio":
      case "activo":
        if(data[column][dayNumber] == null || data[column][dayNumber] == "")return false;
        if(data[column+'_timer_type'][dayNumber] == null || data[column+'_timer_type'][dayNumber] == "")return false;
        if(data[column+'_note'][dayNumber] == null || data[column+'_note'][dayNumber] == "")return false;
      break;
      case "blog":
        if(data[column][dayNumber] == null || data[column][dayNumber] == "")return false;
        if(data[column+'_timer_type'][dayNumber] == null || data[column+'_timer_type'][dayNumber] == "")return false;
      break;
      }
    return true;
  };
  const handleClose = () => {
    setOpenFirst(false);
    setOpenBlock(false);
    setOpenBlog(false);
  };
  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  const handleSave = () => {
    setOpenFirst(false);
    setOpenBlock(false);
    setOpenBlog(false);
    $submitContent();
  };
  const handleChange = event => {
    $updateItemValue('content',event.target.value);
  };
  const handleNoteChange = event => {
    $updateItemValue('note',event.target.value);
  };
  const handleTimerTypeChange = event => {
    $updateItemValue('timerType',event.target.value);
  };
  const handleTimerWorkChange = event => {
    $updateItemValue('timerWork',event.target.value);
  };
  const handleTimerRoundChange = event => {
    $updateItemValue('timerRound',event.target.value);
  };
  const handleTimerRestChange = event => {
    $updateItemValue('timerRest',event.target.value);
  };
  const handleTimerDescriptionChange = event => {
    $updateItemValue('timerDescription',event.target.value);
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
                      blog: activateWorkout(col, row) === false,
                      imperfect:!checkComplete(col, row)
                    })}
                  >
                    {data[row+'_timer_type'] !== undefined &&
                      data[row+'_timer_type'][col] !== undefined && data[row+'_timer_type'][col] !== "" && data[row+'_timer_type'][col] !== "null" && data[row+'_timer_type'][col] !== null && (
                        <div className={classes.timer}>
                          {data[row+'_timer_type'][col]!='tabata'?
                            <>
                              {timeType(data[row+'_timer_type'][col])} {data[row+'_timer_work'][col]}
                            </>
                          :
                            <>
                              {data[row+'_timer_rest'][col]?
                              <>
                                {timeType(data[row+'_timer_type'][col])} {data[row+'_timer_round'][col]}:{data[row+'_timer_work'][col]}:{data[row+'_timer_rest'][col]}
                              </>
                              :
                              <>
                                {timeType(data[row+'_timer_type'][col])} {data[row+'_timer_round'][col]}:{data[row+'_timer_work'][col]}
                              </>}
                            </>
                          }
                          
                        </div>
                      )}
                    {data[row] !== undefined &&
                      data[row][col] !== undefined && data[row][col] !== "" && data[row][col] !== null && (
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
                        {data[row] !== undefined &&
                          data[row][col] !== undefined &&
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
      <WorkoutImageEditDialog 
        open={openFirst} 
        handleClose={handleClose} 
        title={editorDate && editorDate.toLocaleDateString(undefined, labelOptions)}
        subTitle={column && columnLabels[column]} 
        content={content}
        image={image}
        updateImage={$updateImage}
        handleChange={handleChange}
        handleSave={handleSave}
        removeImage={$removeImage}
      />
      <WorkoutEditDialog 
        open={openBlog} 
        handleClose={handleClose} 
        title={editorDate && editorDate.toLocaleDateString(undefined, labelOptions)}
        subTitle={column && columnLabels[column]} 
        imageEnable={weekDate === 3 || weekDate === 6}
        image={image}
        updateImage={$updateImage}
        content={content}
        timerType={timerType}
        work={work}
        round={round}
        rest={rest}
        description={description}
        handleChange={handleChange}
        handleSave={handleSave}
        handleTimerTypeChange={handleTimerTypeChange}
        handleTimerWorkChange={handleTimerWorkChange}
        handleTimerRoundChange={handleTimerRoundChange}
        handleTimerRestChange={handleTimerRestChange}
        handleTimerDescriptionChange={handleTimerDescriptionChange}
      />
      <WorkoutNoteEditDialog 
        open={openBlock} 
        handleClose={handleClose} 
        title={editorDate && editorDate.toLocaleDateString(undefined, labelOptions)}
        subTitle={column && columnLabels[column]} 
        content={content}
        note={note}
        timerType={timerType}
        work={work}
        round={round}
        rest={rest}
        description={description}
        handleChange={handleChange}
        handleNoteChange={handleNoteChange}
        handleTimerTypeChange={handleTimerTypeChange}
        handleTimerWorkChange={handleTimerWorkChange}
        handleTimerRoundChange={handleTimerRoundChange}
        handleTimerRestChange={handleTimerRestChange}
        handleTimerDescriptionChange={handleTimerDescriptionChange}
        handleSave={handleSave}
      />
      <WorkoutPreviewDialog
        open={openPreview} 
        handleClose={handleClosePreview} 
        title={editorDate && editorDate.toLocaleDateString(undefined, labelOptions)}
        subTitle={column && columnLabels[column]} 
        content={previewContent.content}
        whatsapp={previewContent.whatsapp}
      />
    </Paper>
  );
}
const mapStateToProps = state => ({
  pickedDate: state.cms.pickedDate,
  data: state.cms.data,
  editorDate: state.cms.editorDate,
  column: state.cms.column,
  image:state.cms.image,
  content: state.cms.content,
  note: state.cms.note,
  timerType:state.cms.timerType,
  work:state.cms.timerWork,
  round:state.cms.timerRound,
  rest:state.cms.timerRest,
  description:state.cms.timerDescription,
  previewContent: state.cms.previewContent
});
const mapDispatchToProps = {
  $datePicked,
  $openCell,
  $openPreviewCell,
  $updateItemValue,
  $submitContent,
  $updateImage,
  $removeImage,
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
    date.setHours(18);
    let copiedDate = new Date(date.getTime());
    const options = { year: "numeric", month: "short", day: "numeric" };
    const weekDay = copiedDate.getDay();
    var first = copiedDate.getDate() - weekDay; // First day is the day of the month - the day of the week
    if(weekDay === 0){
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
                <span onClick={this.handlePrevWeek()} style={{cursor:"pointer"}}>
                  <i className="la la-angle-left"></i>
                </span>
                &nbsp;&nbsp;
                {this.getWeekDays(this.props.pickedDate)}
                &nbsp;&nbsp;
                <span onClick={this.handleNextWeek()} style={{cursor:"pointer"}}>
                  <i className="la la-angle-right"></i>
                </span>
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
