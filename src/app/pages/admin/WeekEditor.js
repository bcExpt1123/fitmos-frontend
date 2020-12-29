import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import {Table, TableHead, TableBody, TableCell, TableRow, Paper, IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import classnames from "classnames";
import {
    $fetchRequestCms,
    $openCell,
    $openPreviewCell,
    $updateItemValue,
    $submitContent,
    $updateImage
  } from "../../../modules/subscription/weekWorkout";
import WorkoutEditDialog from "./dialog/WorkoutEditDialog";
import WorkoutImageEditDialog from "./dialog/WorkoutImageEditDialog";
import WorkoutNoteEditDialog from "./dialog/WorkoutNoteEditDialog";
import WorkoutPreviewDialog from "./dialog/WorkoutPreviewDialog";
import {timeType} from "../../../_metronic/utils/utils";
  
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
  weekDay,
  history,
  match  
}) {
  const classes = useStyles();
  const weeks = [0, 1, 2, 3, 4, 5, 6];
  const data = useSelector(({ weekWorkout }) => weekWorkout.data);
  const column = useSelector(({ weekWorkout }) => weekWorkout.column);
  const content = useSelector(({ weekWorkout }) => weekWorkout.content);
  const image  = useSelector(({ weekWorkout }) => weekWorkout.image);
  const note  = useSelector(({ weekWorkout }) => weekWorkout.note);
  const timerType  = useSelector(({ weekWorkout }) => weekWorkout.timerType);
  const work  = useSelector(({ weekWorkout }) => weekWorkout.timerWork);
  const round  = useSelector(({ weekWorkout }) => weekWorkout.timerRound);
  const rest  = useSelector(({ weekWorkout }) => weekWorkout.timerRest);
  const description = useSelector(({ weekWorkout }) => weekWorkout.timerDescription);
  const day = useSelector(({ weekWorkout }) => weekWorkout.day);
  const previewContent = useSelector(({ weekWorkout }) => weekWorkout.previewContent);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($fetchRequestCms(history,match.params.id));
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const updateImage = (image)=>{
    dispatch($updateImage(image));
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
  const [weekDate, setWeekDate] = useState(false);
  const handleClickOpen = (day, column) => {
    if (activateWorkout(day, column)) {
      if(column === 'comentario'){
        setOpenFirst(true);
      }else if(column === 'blog'){
        setOpenBlog(true);
      }else{
        setOpenBlock(true);
      }
      setWeekDate(day);
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
        if (column === "blog" || column === "activo" || weekDay>dayNumber) return false;
        break;
      case 1:
        if (column === "blog" || weekDay>dayNumber) return false;
        break;
      case 2:
        if (column === "blog" || column === "activo" || weekDay>dayNumber) return false;
        break;
      case 3:
        if (column !== "blog" || weekDay>dayNumber) return false;
        break;
      case 4:
        if (column === "blog" || weekDay>dayNumber) return false;
        break;
      case 5:
        if (column === "activo" || weekDay>dayNumber) return false;
        break;
      case 6:
        if (column !== "blog" || weekDay>dayNumber) return false;
        break;
      default:  
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
    dispatch($submitContent(weekDay));
  };
  const handleChange = event => {
    dispatch($updateItemValue('content',event.target.value));
  };
  const handleNoteChange = event => {
    dispatch($updateItemValue('note',event.target.value));
  };
  const handleTimerTypeChange = event => {
    dispatch($updateItemValue('timerType',event.target.value));
  };
  const handleTimerWorkChange = event => {
    dispatch($updateItemValue('timerWork',event.target.value));
  };
  const handleTimerRoundChange = event => {
    dispatch($updateItemValue('timerRound',event.target.value));
  };
  const handleTimerRestChange = event => {
    dispatch($updateItemValue('timerRest',event.target.value));
  };
  const handleTimerDescriptionChange = event => {
    dispatch($updateItemValue('timerDescription',event.target.value));
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
                      blog: activateWorkout(col, row) === false
                    })}
                  >
                    {data[weekDay]&&data[weekDay][col] !== undefined &&
                      data[weekDay][col][row+'_timer_type'] !== undefined && data[weekDay][col][row+'_timer_type'] !== "" && data[weekDay][col][row+'_timer_type'] !== null && (
                        <div className={classes.timer}>
                          {data[weekDay][col][row+'_timer_type']!='tabata'?
                            <>
                              {timeType(data[weekDay][col][row+'_timer_type'])} {data[weekDay][col][row+'_timer_work']}
                            </>
                          :
                            <>
                              {data[weekDay][col][row+'_timer_rest']?
                              <>
                                {timeType(data[weekDay][col][row+'_timer_type'])} {data[weekDay][col][row+'_timer_round']}:{data[weekDay][col][row+'_timer_work']}:{data[weekDay][col][row+'_timer_rest']}
                              </>
                              :
                              <>
                                {timeType(data[weekDay][col][row+'_timer_type'])} {data[weekDay][col][row+'_timer_round']}:{data[weekDay][col][row+'_timer_work']}
                              </>}
                            </>
                          }
                        </div>
                      )}
                    {data[weekDay]&&data[weekDay][col] !== undefined &&
                      data[weekDay][col][row] !== undefined && data[weekDay][col][row] !== "" && data[weekDay][col][row] !== null && (
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
                        {data[weekDay]&&data[weekDay][col] !== undefined &&
                          data[weekDay][col][row] !== undefined &&
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
      <WorkoutImageEditDialog 
        open={openFirst} 
        handleClose={handleClose} 
        title={weekdates[weekDay] + "'s " + weekdates[day]}
        subTitle={column && columnLabels[column]} 
        content={content}
        image={image}
        updateImage={updateImage}
        handleChange={handleChange}
        handleSave={handleSave}
      />
      <WorkoutEditDialog 
        open={openBlog} 
        handleClose={handleClose} 
        title={weekdates[weekDay] + "'s " + weekdates[day]}
        subTitle={column && columnLabels[column]} 
        imageEnable={weekDate==3 || weekDate==6}
        image={image}
        updateImage={updateImage}
        content={content}
        timerType={timerType}
        work={work}
        round={round}
        rest={rest}
        description={description}
        handleChange={handleChange}
        handleTimerTypeChange={handleTimerTypeChange}
        handleTimerWorkChange={handleTimerWorkChange}
        handleTimerRoundChange={handleTimerRoundChange}
        handleTimerRestChange={handleTimerRestChange}
        handleTimerDescriptionChange={handleTimerDescriptionChange}
        handleSave={handleSave}
      />
      <WorkoutNoteEditDialog 
        open={openBlock} 
        handleClose={handleClose} 
        title={weekdates[weekDay] + "'s " + weekdates[day]}
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
        title={weekdates[weekDay] + "'s " + weekdates[day]}
        subTitle={column && columnLabels[column]} 
        content={previewContent.content}
        whatsapp={previewContent.whatsapp}
      />
    </Paper>
  );
}
const WeekEditor = injectIntl(
  withRouter(Main)
);
export default WeekEditor;