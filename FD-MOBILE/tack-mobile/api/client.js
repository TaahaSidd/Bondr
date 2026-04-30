import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/Tack';
const BASE_URL = 'http://192.168.1.8:8080/Tack';
//const BASE_URL = 'https://francisca-overjocular-cheryle.ngrok-free.dev/Tack';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default apiClient;