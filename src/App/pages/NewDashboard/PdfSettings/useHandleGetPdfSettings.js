import { API, ENDPOINTS } from "api/apiService";
import { useState, useEffect } from "react";
import { WEEKDAYS_MAP } from "App/constants/ObjectConstants";
import { apiErrorHandler } from "utils/apiUtil";
import { capitalizeFirstLetter } from "utils/textUtils";
export const useHandleGetPdfSettings = () => {
  const [allRecipients, setAllRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailyDays, setDailyDays] = useState([]);
  const [weeklyDays, setWeeklyDays] = useState([]);
  const [ownerUpdate, setOwnerUpdate] = useState(false);

  const handleGetPdfSettingsData = async () => {
    try {
      setLoading(true);

      const resp = await API.get(ENDPOINTS.FETCH_PDF_SETTINGS);

      if (resp.success) {
        const {
          pdf_recipients = [],
          daily_days = [],
          weekly_days = [],
          is_owner_recipient,
        } = resp.data || {};
        setAllRecipients(
          pdf_recipients.map((recipient, index) => {
            const { name, email, frequencies, facilities } = recipient || {};

            return {
              uniqueId: Date.now() + index,
              name,
              email,
              facilityListing: facilities,
              facilities: facilities.map((facility) => facility?.id),
              timeFrame: frequencies.map((time) => ({
                label: capitalizeFirstLetter(time),
                value: time,
              })),
            };
          })
        );

        setDailyDays(
          daily_days.map((dayNumber) => ({
            value: dayNumber,
            label: WEEKDAYS_MAP[dayNumber],
          }))
        );

        setWeeklyDays(
          weekly_days.map((dayNumber) => ({
            value: dayNumber,
            label: WEEKDAYS_MAP[dayNumber],
          }))
        );

        setOwnerUpdate(is_owner_recipient);
      }
    } catch (e) {
      apiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetPdfSettingsData();
  }, []);

  return {
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
  };
};
