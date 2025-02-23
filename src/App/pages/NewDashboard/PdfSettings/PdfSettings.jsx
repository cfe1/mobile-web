import React from "react";
import {
  DialogModal,
  ChipMultiSelect,
  Toast,
  SwitchButton,
} from "App/components";
import { AddRecipient } from "./AddRecipient";
import { WEEKDAYS } from "App/constants/SelectConstants";
import { AllRecipients } from "./AllRecipients";
import { apiErrorHandler } from "utils/apiUtil";
import { API, ENDPOINTS } from "api/apiService";
import { useHandleGetPdfSettings } from "./useHandleGetPdfSettings";
export const PdfSettings = ({ onClose }) => {
  // <================= All States =========================>
  const {
    loading,
    setLoading,
    allRecipients,
    setAllRecipients,
    dailyDays,
    setDailyDays,
    weeklyDays,
    setWeeklyDays,
    ownerUpdate,
    setOwnerUpdate,
  } = useHandleGetPdfSettings() || {};

  // <================ All Constants =====================>
  // <================ All API calls =========================>

  // <===================== All Use effects =====================>
  // <==================== All Helper functions =================>

  const getPayload = () => {
    return {
      daily_days: dailyDays.map((day) => day.value),
      weekly_days: weeklyDays.map((day) => day.value),
      is_owner_recipient: ownerUpdate,
      pdf_recipients: allRecipients.map((recipient) => {
        const { name, email, facilities, timeFrame } = recipient || {};
        return {
          name,
          email,
          facilities,
          frequencies: timeFrame.map((time) => time.value),
        };
      }),
    };
  };

  const handleCreatePdfSettings = async () => {
    try {
      setLoading(true);

      const payload = getPayload();

      const resp = await API.patch(ENDPOINTS.FETCH_PDF_SETTINGS, payload);

      if (resp.success) {
        Toast.showInfoToast("Pdf settings updated successfully.");
        onClose();
      }
    } catch (e) {
      apiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorsCheck = () => {
    let hasDaily = false,
      hasWeekly = false;

    for (const recipient of allRecipients) {
      const { timeFrame = [] } = recipient || {};

      if (!hasDaily && timeFrame.some((time) => time.value === "DAILY")) {
        hasDaily = true;
      }

      if (!hasWeekly && timeFrame.some((time) => time.value === "WEEKLY")) {
        hasWeekly = true;
      }

      if (hasDaily && hasWeekly) {
        break;
      }
    }

    const showErrorToast = (message) => {
      Toast.showErrorToast(message);
      return true;
    };

    if (hasDaily && dailyDays.length === 0) {
      return showErrorToast("Please select some days in daily");
    }

    if (hasWeekly && weeklyDays.length === 0) {
      return showErrorToast("Please select some days in weekly");
    }

    if (allRecipients.length === 0) {
      return showErrorToast("Please add atleast one recipient");
    }
  };

  const handleConfirm = () => {
    if (handleErrorsCheck()) return;
    handleCreatePdfSettings();
  };

  return (
    <DialogModal
      heading={"Pdf Settings"}
      onClose={onClose}
      handleConfirm={handleConfirm}
      dialogCls={"dialog-cls"}
      loading={loading}
      closeTextNeeded={false}
    >
      <div className="mt-20 text-grey1 text-16 text-600">
        Enter details of recipients who will receive the pdf
      </div>

      <AddRecipient
        allRecipients={allRecipients}
        setAllRecipients={setAllRecipients}
      />

      <div className="p-12 bg-lt-blue mt-20 rounded-4 flex justify-between items-center">
        <span className="text-16 text-700">
          Should owner received the PDF as well?
        </span>
        <SwitchButton
          value={ownerUpdate}
          onChange={(e) => {
            setOwnerUpdate((prev) => !prev);
          }}
          color={"#FF0083"}
        ></SwitchButton>
      </div>

      <div className="w-full flex flex-col gap-10 mt-30">
        <span className="text-14 text-500">
          When do you wish to receive daily pdf?
          <span className="text-grey ml-10">
            (You will receive 14 days of data on this day)
          </span>
        </span>
        <ChipMultiSelect
          label={"Select days"}
          id="Position_values_multi"
          items={WEEKDAYS}
          selectedItems={dailyDays}
          reset={false}
          isPink={true}
          className={"multiselect-days"}
          onSelect={(value) => setDailyDays(value)}
        />
      </div>

      <div className="w-full flex flex-col gap-10 mt-30">
        <span className="text-14 text-500">
          When do you wish to receive weekly pdf?
          <span className="text-grey ml-10">
            (You will receive 5 weeks of data on this day)
          </span>
        </span>
        <ChipMultiSelect
          label={"Select days"}
          id="Position_values_multi"
          items={WEEKDAYS}
          selectedItems={weeklyDays}
          reset={false}
          isPink={true}
          className={"multiselect-days"}
          onSelect={(value) => setWeeklyDays(value)}
        />
      </div>

      <div className="mt-30 horizontal-divider mb-30 "></div>
      <AllRecipients
        allRecipients={allRecipients}
        setAllRecipients={setAllRecipients}
      />
    </DialogModal>
  );
};
