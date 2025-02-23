import { Toast } from "../App/components";

export const apiErrorHandler = (error) => {
  if (error.status !== 500) {
    if ([400, 405, 422, 403,404].includes(error?.data?.statusCode)) {
      Toast.showErrorToast(error?.data?.error?.message[0]);
    }
  } else {
    Toast.showErrorToast("Something went wrong.");
  }
};
