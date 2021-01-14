import React from "react";
const RenderMedia = (file) => {
  return (
    file.type === "image"?<img src={file.url} alt="image" />:<video src={file.url} />
  );
}

export default RenderMedia;