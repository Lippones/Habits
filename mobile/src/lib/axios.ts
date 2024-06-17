import axios from 'axios'
export const api = axios.create({
    baseURL: 'https://habits.lippe.dev',
    // baseURL: 'http://192.168.1.64:3333',
})