import { DialogModal } from "App/components";
import React, { useState } from "react";
import { useFacilityContext } from "./FacilityListContext";
import GreenSelectRow from "App/components/Table/GreenSelectRow";
export const SelectFacilities = ({ onClose, formik }) => {
  const { setFieldValue, setFieldTouched, values } = formik || {};

  const { facilityList } = useFacilityContext() || {};

  const [selectedFacility, setSelectedFacility] = useState(
    new Set(values.facilities)
  );

  const handleConfirm = () => {
    setFieldValue("facilities", [...selectedFacility]);

    setFieldValue(
      "facilityListing",
      facilityList
        .filter((facility) => selectedFacility.has(facility.value))
        .map(({ value, label }) => ({ id: value, name: label }))
    );
    setFieldTouched("facilities", true, true);
    onClose();
  };

  const handleFacilityClick = (label, value) => {
    if (selectedFacility.has(value)) {
      setSelectedFacility((prev) => (prev.delete(value), new Set(prev)));
    } else {
      setSelectedFacility((prev) => new Set([...prev, value]));
    }
  };
  return (
    <DialogModal
      heading="Select Facilities"
      onClose={onClose}
      handleConfirm={handleConfirm}
      dialogCls={"dialog-cls-facility"}
      closeTextNeeded={false}
    >
      <div className="mt-20 flex flex-col gap-10">
        {facilityList.map(({ label, value }) => {
          return (
            <div key={value} className="flex justify-between items-center">
              <span>{label}</span>
              <GreenSelectRow
                selected={selectedFacility.has(value)}
                onClick={() => handleFacilityClick(label, value)}
              ></GreenSelectRow>
            </div>
          );
        })}
      </div>
    </DialogModal>
  );
};
