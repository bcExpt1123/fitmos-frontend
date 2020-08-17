import React, { Component,useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faImage } from '@fortawesome/free-solid-svg-icons';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import {
	$updateItemValue,
	$setNewItem,
	$saveItem,
	$updateItemImage,
  $showProductDetail,
  $deleteImage,
} from "../../../modules/subscription/product";
import { useSelect } from "downshift";
import { iteratee, forEach } from "lodash";
const useStyles = makeStyles( theme => ({
    root: {
      display: "block",
			flexWrap: "wrap",
			minHeight:	"840px"
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    margin: {
      margin: theme.spacing(3)
    },
    input: {
      display: 'none',
		},
		multiImage:	{
			alignContent:"center",
			margin:"10px 2px",
			padding:"4px" ,
			border:"1px solid lightgray",
			borderRadius:"5px",
			boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
		},
		img:	{
			borderRadius:"5px",
			cursor:"pointer",
			width:"80px",
			'&:hover': {
				opacity:"0.8"
			},
		}
  }));
const Main =({history}) =>{
	const classes = useStyles();
	const dispatch=useDispatch();
	useEffect(() => {	dispatch($setNewItem())}, []);
	const product = useSelector(({ product }) => product);
	console.log(product);
	const company = useSelector(({ company }) => company);
	const productData = product.item;
	const [state,setState] = React.useState({
		uploading: false,
		multiFile: [],
		multiImage:[],
	});
	console.log(product);
	const prices = product.item.priceType;
	console.log(state);
	const changeCapture = event =>{
		if(state.uploading=false){
			const files = Array.from(event.target.files);
			const multiImage = []; 
			files.forEach(item=>{
				multiImage.push(item)
			});
      setState({...state,uploading:true});
      dispatch($updateItemImage(multiImage));
		}
		else{
			const files = Array.from(event.target.files);
			files.forEach(item=>{
				state.multiImage.push(item)
			});
      setState({...state,uploading:true})
      dispatch($updateItemImage(state.multiImage));
		}
		for(let i=0;i<state.multiImage.length;i++){
			state.multiFile[i] = URL.createObjectURL(state.multiImage[i]);
		}
		console.log(state);
	}
	const handleChange = (name) => {
    return event => {
      dispatch($updateItemValue(name, event.target.value));
    };
	}
	const handleOnSubmit = event => {
    event.preventDefault();
    if (!state.uploading&&!product.item.id) {
      alert("Please upload image");
      return false;
    }
    dispatch($saveItem(history));
    return false;
	}
	const removeImage = (event) =>{
		const mulImage = state.multiImage;
		const filterImage = state.multiFile;
		var arrayLength = state.multiFile.length;
		var index;
    for (var j = -1; j < arrayLength; j++) {
			if(filterImage[j] == event.target.src){
				index = j;
			}
		}
		if(index==(arrayLength-1)){
      if(index==0){
        setState({
          uploading: false,
		      multiFile: [],
		      multiImage:[],
        })
      }
      else{
        mulImage.pop();
        filterImage.pop();
        setState({
          uploading:true,
          multiFile:filterImage,
          multiImage:mulImage
        });
      }
      dispatch($updateItemImage(mulImage));
		} else{
			mulImage.splice(index, 1);
			filterImage.splice(index,1);
			setState({
				uploading:true,
				multiFile:filterImage,
				multiImage:mulImage
			});
			dispatch($updateItemImage(mulImage));
		}
  }
  const deleteAction =(event) =>{
    console.log(event.target.src);
    dispatch($deleteImage(event.target.src));
  }
	console.log(state);
	return(
		<>  
			{company.item.productId?(
			<Grid  container>
				<Grid item xs className={classes.margin}>
					<form
						id="product-form"
						onSubmit={handleOnSubmit}
						className={classes.root}
						autoComplete="off"
					>
						<Paper className={classes.root} style={{ padding: "25px",borderRadius:"15px"}}>
							<Grid item xs={12}  className={classes.margin}>
								<TextField
									required
									id="name"
									label="Name"
									type="text"
									value={productData.name}
									fullWidth
									style={{alignContent:"center"}}
									onChange={handleChange("name")}
								/>
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								<FormControl component="fieldset" style={{alignItems:"center"}}>
									<FormLabel component="legend" >Price Type</FormLabel>
									<RadioGroup row aria-label="position" 
										style={{marginLeft:"25px"}} 
										value={productData.price_type}
										onChange={handleChange("price_type")}>
											<FormControlLabel 
												value="offer" 
												control={<Radio color="primary" />} 
												label="Offer" />
											<FormControlLabel 
												value="discounted" 
												control={<Radio color="primary" />} 
												label="Discounted" />
									</RadioGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								{productData.price_type=="discounted"&&(
									<TextField
										required
										id="discountValue"
										label="Discount"
										type="number"
										value={productData.discount}
										fullWidth
										onChange={handleChange("discount")}
									/>
								 )}
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								{productData.price_type=="offer"&&(
									<TextField
										required
										id="regularPrice"
										label="Regular Price"
										type="number"
										fullWidth
										value={productData.regular_price}
										onChange={handleChange("regular_price")}
									/>
								)}
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								{productData.price_type=="offer"&&(
									<TextField
										required
										id="salePrice"
										label="Sale Price"
										type="number"
										fullWidth
										value={productData.price}
										onChange={handleChange("price")}
									/>
								)}
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								<FormControl component="fieldset" style={{alignItems:"center"}} >
									<FormLabel component="legend" >Voucher Type</FormLabel>
									<RadioGroup 
										row aria-label="position" 
										style={{marginLeft:"25px"}}  
										value={productData.voucher_type}
										onChange={handleChange("voucher_type")}>
										<FormControlLabel 
											value="once" 
											control={<Radio color="primary" />} 
											label="Once" />
										<FormControlLabel 
											value="unlimited" 
											control={<Radio color="primary" />} 
											label="Unlimited" />
									</RadioGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} className={classes.margin}>
                <TextField
                  id="codigo"
                  label="codigo"
                  fullWidth
                  value={productData.codigo}
                  onChange={handleChange("codigo")}
                />
							</Grid>
							<Grid item xs={12} className={classes.margin}>
                <TextField
                  id="link"
                  label="Ecommerce Link"
                  fullWidth
                  value={productData.link}
                  onChange={handleChange("link")}
                />
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								<TextField
									id="expirationDate"
									label="Expiration Date"
									type="date"
									InputLabelProps={{
										shrink: true,
									}}
									fullWidth
									value={productData.expiration_date}
									onChange={handleChange("expiration_date")}
								/>
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								<TextField
									required
									id="description"
									label="Description"
									multiline={true}
									rows={13}
									rowsMax={15}
									value={productData.description}
									onChange={handleChange("description")}
									margin="normal"
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={12} className={classes.margin}>
								<input
									accept="image/*"
									className={classes.input}
									id="multi-image"
									multiple
									type="file"
									onChange={changeCapture}
								/>
							</Grid>
						</Paper>
					</form>
				</Grid>
				<Grid item xs className={classes.margin} >
					<Paper className={classes.root}  style={{ padding: "25px",borderRadius:"15px" }}>
						<Grid container xs={12} item>
							<label htmlFor='multi-image' style={{textAlign:"center"}}>
								<FontAwesomeIcon icon={faImage} 
									style={{cursor:"pointer"}} 
									color='#6d84b4' 
									size='4x' />
							</label>
						</Grid>		
						<Box display="flex" flexWrap="wrap" justifyContent="flex-start">
							
							{product.item.id?(
							<>
                {product.gallery&&product.gallery.map((list) => (
                  <Tooltip title="Delete" key={list.image}>
                    <div className={classes.multiImage}  onClick={deleteAction}>
                      <img src={list.image} alt={list.image} className={classes.img}/> 
                    </div>
                  </Tooltip>
							  ))}
                {state.uploading&&state.multiFile.map((list) => (
                  <Tooltip title="Delete" key={list}>
                    <div className={classes.multiImage} onClick={removeImage}>
                      <img src={list} alt={list} className={classes.img}/> 
                    </div>
                  </Tooltip>
							  ))}
              </>):(
                <>
                {state.uploading&&state.multiFile.map((list) => (
                  <Tooltip title="Delete" key={list}>
                    <div className={classes.multiImage} onClick={removeImage}>
                      <img src={list} alt={list} className={classes.img}/> 
                    </div>
                  </Tooltip>
                ))}
                </>
              )}
						</Box>					
					</Paper>
				</Grid>
			</Grid>
			):(
				<>
				<Paper>
					<h3 className="kt-subheader__title" style={{ padding: "25px" }}>
						The Item doesn't exist
					</h3>
				</Paper>
				</>
			)};
		</>
	);
};
const ProductCreate = injectIntl(Main);

function Sub({match,history}) {
	const product = useSelector(({ product }) => product);
	const dispatch=useDispatch();
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
				{product.item.name ? (
              <h3 className="kt-subheader__title">
                 {product.item.name}
              </h3>
            ) 
           : (
              <h3 className="kt-subheader__title">New Product</h3>
            )}
				<span className="kt-subheader__separator kt-subheader__separator--v" />
				<span className="kt-subheader__desc"></span>
			</div>

			<div className="kt-subheader__toolbar">
				<div className="kt-subheader__wrapper">
					<Button
						type="button"
						className="btn kt-subheader__btn-primary btn-primary"
						form="product-form"
						type="submit"
					>
						Submit &nbsp;
					</Button>
					<Button
						type="button"
						className="btn kt-subheader__btn-primary btn-primary"
						onClick={history.goBack}
					>
						Back &nbsp;
					</Button>
				</div>
			</div>
		</>
	);
}
const SubHeaderProductCreate = injectIntl(Sub);
export { ProductCreate, SubHeaderProductCreate };