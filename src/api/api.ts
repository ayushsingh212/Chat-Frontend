import axios from "axios";

export const API_URL = "https://chat-backend-x8yj.onrender.com/api"; // your backend URL

export const signup = (data: { fullName: string; email: string; password: string }) =>
  axios.post(`${API_URL}/user/register`, data,{
    withCredentials:true
  });

export const login = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/user/login`, data,{withCredentials:true});

export const createRoom = (data: { name: string }) =>{
  return axios.post(`${API_URL}/room/createRoom`, data, {withCredentials:true })};

export const getRooms = () =>{
  return axios.get(`${API_URL}/room/getRooms`, {withCredentials:true })};
