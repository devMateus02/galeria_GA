import axios from "axios";

const Api = axios.create({
    baseURL: 'https://galeria-ga.onrender.com'
})


export default Api