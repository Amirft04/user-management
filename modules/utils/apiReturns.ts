export const successMessage = (res: any, message?: string, data?: any) => {
  res.json({
    code: 200,
    message:
      message && message !== "" ? message : "درخواست شما با موفقیت انجام گردید",
    success: true,
    data: data ? data : null,
  });
};

export const catchMessage = (res: any) => {
  return res.json({
    code: 501,
    message: "خطایی رخ داده است لطفا مجددا تلاش نمایید",
    success: false,
  });
};

export const validationMessage = (res: any, error: string) => {
  return res.json({
    code: 406,
    message: error,
    success: false,
  });
};
