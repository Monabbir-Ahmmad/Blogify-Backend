const convertToHtml = (data) => {
  return data;
};

const convertToXml = (data) => {
  return data;
};

const convertToText = (data) => {
  return data;
};

const sendContentNegotiatedResponse = (req, res, statusCode, data) => {
  let responseData = data;

  switch (req.headers.accept) {
    case "application/html":
      responseData = convertToHtml(data);
      break;
    case "application/xml":
      responseData = convertToXml(data);
      break;
    case "text/plain":
      responseData = convertToText(data);
      break;
  }

  res.status(statusCode).send(responseData);
};

export const responseUtil = {
  sendContentNegotiatedResponse,
};