import { API, ENDPOINTS } from "api/apiService";

class FacilityService {

  static getInstance() {
    if (!FacilityService.instance) {
      FacilityService.instance = new FacilityService();
    }
    return FacilityService.instance;
  }

  async fetchFacilityList() {
    try {
      const response = await API.get(ENDPOINTS.OWNER_FACILITY_LISTING);
      if (response.success) {
        return response.data;
      } else {
        throw new Error("Failed to fetch facility list");
      }
    } catch (error) {
      throw new Error(error.data?.error?.message[0] || "Unknown error");
    }
  }
}

export default FacilityService.getInstance();
