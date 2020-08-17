import React, { Component,useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import { NavLink } from "react-router-dom";
const useStyles = makeStyles( theme => ({
    root: {
      display: "block",
			flexWrap: "wrap",
    },
		multiImage:	{
			alignContent:"center",
			margin:"15px",
			padding:"4px" ,
			border:"1px solid lightgray",
			borderRadius:"5px",
			boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
		},
		img:	{
			borderRadius:"5px",
			cursor:"pointer",
			'&:hover': {
				opacity:"0.8"
			},
		}
  }));
const Main =() =>{
	const classes = useStyles();
	const product = useSelector(({ product }) => product);
	console.log(product);
	return(
		<>  
			<Paper className={classes.root}>
				<Grid container>
						{product.gallery&&product.gallery.map((list) => (
							<div className={classes.multiImage} key={list.image}>
									<img src={list.image} alt={list.image} className={classes.img}/> 
							</div>
						))}
				</Grid>
			</Paper>
		</>
  );
}
const ViewImages = injectIntl(Main);
function Sub({match,history}) {
	const product = useSelector(({ product }) => product);
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
          <h3 className="kt-subheader__title">View Images</h3>
				<span className="kt-subheader__separator kt-subheader__separator--v" />
				<span className="kt-subheader__desc"></span>
			</div>

			<div className="kt-subheader__toolbar">
				<div className="kt-subheader__wrapper">
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Create"
            to={`/admin/companies`}
          >
            <span className="MuiButton-label">Back&nbsp;</span>
          </NavLink>
				</div>
			</div>
		</>
	);
}
const SubHeaderViewImages = injectIntl(Sub);
export { ViewImages, SubHeaderViewImages };