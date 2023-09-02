import axios from 'axios'

const makeGetRequest = ({
    url,
    params,
    headers
  }) => {
    const config = {
        params: params
    }
    headers?config['headers'] = headers: void 0;
    return axios.get(url, config)
        .then(function (response) {
            return {data: response.data, statusCode: 200, code: "SUCCESS"};
        })
        .catch(function (error) {
            console.error("requester.makeGetRequest | error: ", error.message)
            return {data: error.message, statusCode: error.response.status, code: error.code};
        })
        .finally(function () {
            // always executed
        });
}

const makePostRequest = ({
    url,
    body,
    headers
  }) => {
    return axios.post(url, body, {headers:headers})
        .then(function (response) {
            return {data: response.data, statusCode: 200, code: "SUCCESS"};
        })
        .catch(function (error) {
            console.error("requester.makePostRequest | error: ", error.message)
            return {data: error.message, statusCode: error.response.status, code: error.code};
        })
        .finally(function () {
            // always executed
        });
}
  
export {makeGetRequest, makePostRequest};