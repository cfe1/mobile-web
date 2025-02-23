import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import { makeStyles } from "@material-ui/core/styles";

import { convertToHumanSize } from "../../utils/fileUtils";
import { ellipsizeText } from "../../utils/textUtils";

import CloseIcon from "../assets/icons/close.svg";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#F5F6FA",
    borderRadius: 14,
    padding: 8,
    display: "flex",
  },
  image: {
    width: 54,
    height: 54,
    objectFit: "cover",
    marginRight: 16,
    borderRadius: 6,
  },
  metadata: {
    width: "100%",
  },
  closeButton: {
    float: "right",
    cursor: "pointer",
  },
});

const ImageViewer = ({
  file,
  src,
  name,
  size,
  id,
  progress = false,
  onRemove = null,
  style,
}) => {
  const classes = useStyles();

  useEffect(() => {
   
    const reader = new FileReader();
    const preview = document.getElementById("image-" + id);
    if (src) {
     
      preview.src = src;
      return;
    }

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [file]);
  return (
    <div
      className={classes.root}
      style={{ width: "100%", minWidth: 230, ...style }}
    >
      <img src={null} className={classes.image} id={"image-" + id} />
      <div className={classes.metadata}>
        <div
          style={{
            display: "flex",
            minWidth: 150,
            justifyContent: "space-between",
            paddingBottom: progress ? 14 : 0,
          }}
        >
          <Typography variant="button" align="left">
            {ellipsizeText(size ? name : file?.name ?? "", 16)}
          </Typography>
          {onRemove && (
            <img
              src={CloseIcon}
              className={classes.closeButton}
              onClick={onRemove}
            />
          )}
        </div>
        <div>
          <Typography variant="button" className="text-muted">
            {convertToHumanSize(size ? size : file.size)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
