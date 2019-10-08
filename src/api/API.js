const axios = require('axios');
const baseURL = 'http://localhost:4000/api/v1/';
const API = {
 storeLyric: ( lyricData ) => {
    return axios.post( baseURL+'lyrics', lyricData.data )
 }
}
module.exports =  API ;