import { HttpClient } from './httpClient';
import { OcrService } from './ocrService';

const baseUrl = import.meta.env.VITE_API_URL;
const httpClient = new HttpClient(baseUrl);
const ocrService = new OcrService(httpClient);

export { ocrService };
