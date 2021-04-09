import { axios } from "../../axios";
const getFile = function(url) {
  return axios.send({
    method: "get",
    url: "/api/getFile/" + url,
  });
};
export default getFile;
