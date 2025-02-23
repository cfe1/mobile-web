import React, { useEffect } from "react";
import ModalImage from "react-modal-image";

import { makeStyles } from "@material-ui/core/styles";

import FacilityDeleteImage from "../../assets/icons/facility-image-delete.svg";

const useStyles = makeStyles({
  facilityImagePreview: {
    borderRadius: 10,
    marginRight: 20,
    height: 82,
    width: 82,
    objectFit: "cover",
  },
});

const FacilityImage = ({ src, file, id, onRemove }) => {
  const classes = useStyles();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      const image = document.getElementById(id);

      reader.addEventListener(
        "load",
        function () {
          // convert image file to base64 string
          image.src = reader.result;
        },
        false
      );
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div>
      {src && (
        <ModalImage
          small={src}
          large={src}
          className={classes.facilityImagePreview}
          showRotate
        />
      )}
      {file && (
        <img src={null} id={id} className={classes.facilityImagePreview} />
      )}
      <div>
        <img
          src={FacilityDeleteImage}
          onClick={onRemove}
          style={{ float: "right", cursor: "pointer", marginRight: 10 }}
        />
      </div>
    </div>
  );
};

export default FacilityImage;
