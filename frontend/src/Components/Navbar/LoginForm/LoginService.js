import axios from 'axios';

var url = 'http://localhost:5000';
// insert new data in database
export const registerUser = async (user) => {
    try {
        const response = await axios.post(`${url}/register`, { user });
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.error(err);
      }
};

// check user exists
export const fetchUser = async (user) => {
        try {
        const response = await axios.post(`${url}/login`, { user });
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.error(err);
      }
};