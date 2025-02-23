import axios from "axios";
import {store} from '../redux/store/index';

const state = store.getState();
const token=state.auth.token;
const baseURL = process.env.REACT_APP_API_ENDPOINT;
const firebasePublicKey = "BPeqNYl5OHdf7UXkCmqpO9q532W9koj2z50IQMUrpt_gGhc8o-x6MoRWNbGDTpaBamwUrMvfHFEhih0cnd78yo0";
const Axios = axios.create({
    baseURL:`${baseURL}`,
  });
const AuthAxios = axios.create({
  baseURL:`${baseURL}`
})
const LAxios = axios.create({
  baseURL:`${baseURL}`
})
export { baseURL, Axios, AuthAxios,LAxios, firebasePublicKey };
