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
  },
  metadata: {
    width: "100%",
  },
  closeButton: {
    float: "right",
    cursor: "pointer",
  },
});

const FilePreview = ({ file, id, progress = false, onRemove, style }) => {
  const classes = useStyles();

  useEffect(() => {
    const reader = new FileReader();
    const preview = document.getElementById("image-" + id);

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        //preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [file]);
  return (
    <div className={classes.root} style={{ width: "100%", ...style }}>
      {/* <img src={null} className={classes.image} id={"image-" + id} /> */}
      <div className={classes.metadata}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: progress ? 14 : 0,
          }}
        >
          <Typography variant="button" align="center">
            {ellipsizeText(file.name, 16)}
          </Typography>
          <img
            src={CloseIcon}
            className={classes.closeButton}
            onClick={onRemove}
            alt="file"
          />
        </div>
        <div>
          {progress ? (
            <LinearProgress
              variant="determinate"
              color="primary"
              style={{ borderRadius: 4 }}
              value={80}
            />
          ) : (
            <Typography variant="button" className="text-muted">
              {convertToHumanSize(file.size)}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
