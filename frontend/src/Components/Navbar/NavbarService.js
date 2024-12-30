import axios from 'axios';

var url = 'http://localhost:5000';

//get all data from database
export const fetchDataCount = async (userId) => {
    try {
        const res = await axios.get(`${url}/task/excelDataCount/${userId}`);
        // const res = response.data[0].totalCount;
        // console.log(res.data);
        if(res.data){
          return res.data;
        }
      } catch (err) {
        console.error(err);
      }
};