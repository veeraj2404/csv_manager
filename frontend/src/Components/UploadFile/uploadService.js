import axios from 'axios';

var url = 'http://localhost:5000';
// insert new data in database
export const insertData = async (excelData) => {
    try {
        const response = await axios.post(`${url}/task/saveExcelData`, { excelData });
        console.log(response.data);
        return response.data.id;
      } catch (err) {
        console.error(err);
      }
};

// update data in database
export const updateData = async (data) => {
    try {
        const response = await axios.post(`${url}/task/updateExcelData`, { data });
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
};

//get all data from database
export const fetchData = async () => {
    try {
        const response = await axios.get(`${url}/task/excelData`);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
};

//get data by id from database
export const fetchDataById = async (id) => {
    try {
        const response = await axios.get(`${url}/task/excelDataById/${id}`);
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.error(err);
      }
};

//download excel data from database
export const downloadData = async (id, filename) => {
    try {
      const response = await axios.get(`${url}/task/downloadExcel/${id}`, {
        responseType: 'blob',
      });
      
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading CSV:', err);
    }
};

