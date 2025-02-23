import React, { useRef, useState } from "react";
import { Grid } from "@material-ui/core";
import { AddRecipient } from "./AddRecipient";
import { capitalizeFirstLetter } from "utils/textUtils";

export const SingleRecipient = ({
  recipient,
  rIndex,
  setAllRecipients,
  allRecipients,
  editId,
  setEditId,
}) => {
  const {
    name = "",
    email = "",
    timeFrame = [],
    facilityListing = [],
  } = recipient || {};

  const [edit, setEdit] = useState(false);
  const formRef = useRef(null);

  const handleEdit = () => {
    setEditId(rIndex);
    setEdit(true);
  };

  const handleCancel = () => {
    setEdit(false);
    setEditId(null);
  };

  const handleDelete = () => {
    const newRIndex = allRecipients.findIndex(
      (reci) => reci.uniqueId === recipient.uniqueId
    );

    setAllRecipients((prev) => prev.filter((_, index) => index !== newRIndex));
  };

  const handleSave = () => {
    formRef.current.click();
  };

  const recipientEdit = edit && editId === rIndex;

  return (
    <>
      <Grid
        container
        key={email}
        className="flex flex-nowrap gap-10 text-14 text-400 items-baseline single-rec"
      >
        <Grid item xs={10}>
          {!recipientEdit ? (
            <Grid container spacing={1}>
              <Grid item xs={3} className="ellipsis">
                {name}
              </Grid>
              <Grid item xs={4} className="text-center ellipsis">
                {email}
              </Grid>
              <Grid item xs={3} className="text-center flex gap-4 items-center">
                <span className="ellipsis">{`${facilityListing[0].name}`}</span>
                {facilityListing?.length > 1 && (
                  <span className="facilities-count">
                    {` +${facilityListing?.length - 1}`}
                  </span>
                )}
              </Grid>
              <Grid item xs={2} className="text-right">
                {timeFrame.map((time) => time.label).join(", ")}
              </Grid>
            </Grid>
          ) : (
            <>
              <AddRecipient
                allRecipients={allRecipients}
                setAllRecipients={setAllRecipients}
                recipient={recipient}
                isEdit={true}
                rIndex={rIndex}
                formRef={formRef}
                handleCancel={handleCancel}
              />
            </>
          )}
        </Grid>

        <Grid item xs={2} className="flex flex-nowrap">
          <Grid item xs={6}>
            <span
              className="grey-btn"
              onClick={!recipientEdit ? handleEdit : handleSave}
            >
              {!recipientEdit ? "Edit" : "Save"}
            </span>
          </Grid>
          <Grid item xs={6}>
            <span
              className="grey-btn"
              onClick={() => {
                if (recipientEdit) handleCancel();
                else handleDelete(rIndex);
              }}
            >
              {recipientEdit ? "Cancel" : "Delete"}
            </span>
          </Grid>
        </Grid>
      </Grid>

      <div className="horizontal-divider"></div>
    </>
  );
};
