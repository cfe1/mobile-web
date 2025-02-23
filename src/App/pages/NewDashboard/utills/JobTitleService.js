import { API, ENDPOINTS } from "api/apiService";

class JobTitleService {

  static getInstance() {
    if (!JobTitleService.instance) {
      JobTitleService.instance = new JobTitleService();
    }
    return JobTitleService.instance;
  }

  async fetchJobTitles() {
    try {
      const response = await API.get(ENDPOINTS.FETCH_JOB_TITLES);
      if (response.success) {
        return response.data;
      } else {
        throw new Error("Failed to fetch job titles");
      }
    } catch (error) {
      throw new Error(error.data?.error?.message[0] || "Unknown error");
    }
  }
}

export default JobTitleService.getInstance();
