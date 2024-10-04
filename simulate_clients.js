const axios = require('axios');

const sendRequest = async (clientNumber) => {
    try {
        const response = await axios.get('http://localhost:4000/read-file');
        console.log(`Client ${clientNumber}:`, response.data);
    } catch (error) {
        console.error(`Client ${clientNumber} Error:`, error.message);
    }
};

for (let i = 1; i <= 10; i++) {
    sendRequest(i);
}