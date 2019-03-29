export const getDataWithParams = async (urlParams, numOfItems) => {
  const urlParamStr = urlParams
    .map(param => {
      switch (param) {
        case "fullName":
          return "name";
        case "city":
          return "location";
        case "username":
          return "login";
        default:
          return param;
      }
    })
    .join(",");
  console.log("urlParamStr", urlParamStr);
  const url = `https://randomuser.me/api/?inc=${urlParamStr}&results=${numOfItems}`;
  console.log("url", url);
  const data = await getData(url);
  return data;
};

const getData = async url => {
  let payload;
  try {
    const res = await fetch(url);
    payload = await res.json();
  } catch (e) {
    payload = { error: true, message: e };
  }

  return payload;
};
