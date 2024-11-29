import { HttpClient } from './httpClient';

const baseUrl = import.meta.env.VITE_API_URL;
const httpClient = new HttpClient(baseUrl);

export { httpClient };
