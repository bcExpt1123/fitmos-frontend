/* global FileReader */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';

import fileSizeLessThan from './util/fileSizeLessThan';
import fileType from './util/fileType';

class DropNCrop extends Component {
  static propTypes = {
    allowedFileTypes: PropTypes.array,
    canvasHeight: PropTypes.string,
    canvasWidth: PropTypes.string,
    className: PropTypes.string,
    cropperOptions: PropTypes.object,
    instructions: PropTypes.node,
    maxFileSize: PropTypes.number,
    onChange: PropTypes.func,
    onCroped:PropTypes.func,
    value: PropTypes.shape({
      result: PropTypes.string,
      filename: PropTypes.string,
      filetype: PropTypes.string,
      cropper:PropTypes.object,
      src: PropTypes.string,
      error: PropTypes.string,
    }),
  };
  static defaultProps = {
    allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    canvasHeight: '360px',
    canvasWidth: '100%',
    cropperOptions: {
      guides: true,
      viewMode: 0,
      autoCropArea: 1,
    },
    maxFileSize: 3145728,
  };

  onCrop = () => {
    const {
      value,
      onChange,
    } = this.props;
    if (typeof this.cropperRef.getCroppedCanvas() !== 'undefined') {
      onChange({
        ...value,
        result: this.cropperRef.getCroppedCanvas().toDataURL(value.filetype),
        cropper:this.cropperRef
      });
    }
  };

  onDrop = files => {
    const {
      onChange,
      maxFileSize,
      allowedFileTypes,
    } = this.props;
    const fileSizeValidation = fileSizeLessThan(maxFileSize)(files);
    const fileTypeValidation = fileType(allowedFileTypes)(files);

    if (fileSizeValidation.isValid && fileTypeValidation.isValid) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({
          src: reader.result,
          filename: files[0].name,
          filetype: files[0].type,
          result: reader.result,
          error: null,
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      onChange({
        error: !fileTypeValidation.isValid
          ? fileTypeValidation.message
          : !fileSizeValidation.isValid ? fileSizeValidation.message : null, // TODO: Update error state to be an array to handle both messages if necessary
      });
    }
  };
  _crop(){
    if (typeof this.cropperRef.getCroppedCanvas() !== 'undefined') {
      const {
        value,
        onCroped,
      } = this.props;      
      onCroped(
        this.cropperRef
      );
    }
  }
  render() {
    const {
      canvasHeight,
      canvasWidth,
      className,
      cropperOptions,
      instructions,
      allowedFileTypes,
      maxFileSize,
      value,
    } = this.props;

    const dropNCropClasses = {
      'drop-n-crop': true,
      [`${className}`]: className,
    };
    return (
      <div className={classNames(dropNCropClasses)}>
        {value && value.src
          ? <Cropper
              ref={input => {
                this.cropperRef = input;
              }}
              src={value && value.src}
              style={{
                height: canvasHeight,
                width: canvasWidth,
              }}
              crop={this._crop.bind(this)}
              cropend={this.onCrop} // Only use the cropend method- it will reduce the callback/setState lag while cropping
              {...cropperOptions}
            />
          : <Dropzone
              className="dropzone"
              activeClassName="dropzone--active"
              onDrop={this.onDrop}
              style={{
                height: canvasHeight,
                width: canvasWidth,
              }}
            >
              {({getRootProps, getInputProps}) => (
                <div className="dropzone">
                  <div key="dropzone-instructions">
                    {!instructions
                      ? <div className="dropzone-instructions">
                          <div className="dropzone-instructions--main" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <span>Drag-n-drop a file or click to add an image</span>
                          </div>
                        </div>
                      : instructions}
                  </div>
                  {value && value.error
                    ? <div
                        key="dropzone-validation"
                        className="dropzone-validation"
                      >
                        {value && value.error}
                      </div>
                    : null}
                </div>
              )}
            </Dropzone>}
      </div>
    );
  }
}

export default DropNCrop;
