export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const response = error?.response;
  const backendMessage = response?.data?.message;

  if (response) {
    return backendMessage || fallback;
  }

  if (error?.request) {
    return 'Unable to connect to the server. Please make sure the backend is running.';
  }

  return error?.message || fallback;
};
