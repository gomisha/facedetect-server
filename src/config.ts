// end points

export const ENDPOINT_GET_HOME = "/";

export const ENDPOINT_GET_PROFILE = "/profile/:id";

export const ENDPOINT_GET_USERS = "/users";

export const ENDPOINT_POST_SIGNIN = "/signin";

export const ENDPOINT_POST_REGISTER = "/register";

export const ENDPOINT_PUT_IMAGE = "/image";


// Clarifai

export const CLARIFAI_KEY = process.env.FD_CLARIFAI_KEY as string

// server

export const PORT = process.env.PORT || 3000;

//database

export const DB_TABLE_LOGIN = process.env.FD_DB_TABLE_LOGIN as string;
export const DB_TABLE_USER = process.env.FD_DB_TABLE_USER as string;

export const DB_HOST = process.env.FD_DB_HOST as string;
export const DB_USER = process.env.FD_DB_USER as string;
export const DB_PASSWORD = process.env.FD_DB_PASSWORD as string;
export const DB_DATABASE = process.env.FD_DB_DATABASE as string;