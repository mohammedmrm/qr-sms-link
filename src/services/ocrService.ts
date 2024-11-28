import { data } from '@/demo/demo';
import { OCR_VALIDATION } from '@/types';
import { fakePromiseResolove } from '@/utils';
import { HttpClient } from './httpClient';
export class OcrService {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  getOcrToValidate(): Promise<OCR_VALIDATION> {
    return fakePromiseResolove<OCR_VALIDATION>(data);
  }
}
