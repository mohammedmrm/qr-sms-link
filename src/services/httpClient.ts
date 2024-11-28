import { Err } from '@/types';
import { z } from 'zod';
import { error_GD00401, error_GD1003 } from '../utils/errors';

const SubMWError = z.object({
  loc: z.string().array(),
  msg: z.string(),
  type: z.string(),
});
const MWError = z.object({
  messaggioErrore: z.string().nullish(),
  codiceErrore: z.string().nullish(),
  detail: SubMWError.array().optional(),
});

const MWResponse = z
  .object({
    output: MWError.or(z.array(MWError.or(z.any())).length(1)),
  })
  .passthrough();
export class HttpClient {
  baseURL: string | undefined;

  constructor(baseURL: string | undefined) {
    this.baseURL = baseURL;
  }

  private authHeaders() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      return {
        Authorization: `Bearer ${jwt}`,
      };
    }
    return { Authorization: '' };
  }

  private prepare_request(input: any, headers = {}, method = 'POST') {
    // let body = {
    //   richiesta: [input],
    //   formatoOutput: 'JSON',
    // };
    let body = input;
    let requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...this.authHeaders(),
      },
      body: JSON.stringify(body),
    };

    return requestOptions;
  }
  private prepare_request_get(headers = {}, method = 'GET') {
    let requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...this.authHeaders(),
      },
    };

    return requestOptions;
  }

  private parse_response<
    TT extends z.ZodRawShape,
    TUN extends z.UnknownKeysParam,
    TCAT extends z.ZodTypeAny,
    TO,
    TI,
    T extends z.ZodObject<TT, TUN, TCAT, TO, TI>
  >(json: any, t: T): TO {
    MWResponse.parse(json);
    const output = json.output;
    if ('codiceErrore' in output) {
      throw output as Err;
    }

    const resp = output[0]; // FIXME: do not cast, use zod instead

    if ('codiceErrore' in resp) {
      throw resp as Err;
    }
    return t.parse(resp);
  }

  post<
    TT extends z.ZodRawShape,
    TUN extends z.UnknownKeysParam,
    TCAT extends z.ZodTypeAny,
    TO,
    TI,
    T extends z.ZodObject<TT, TUN, TCAT, TO, TI>
  >(endPoint: string, body: object = {}, t: T, headers = {}): Promise<TO> {
    const _url = this.baseURL + endPoint;

    return fetch(_url, this.prepare_request(body, headers))
      .then((resp) => {
        if (resp.status == 401) {
          throw { messaggioErrore: 'session expired', codiceErrore: error_GD00401 } as Err;
        }
        return resp.json();
      })
      .then((json) => {
        const resp: TO = this.parse_response(json, t);
        return resp;
      })
      .catch((err) => {
        throw err;
      });
  }
  get<
    TT extends z.ZodRawShape,
    TUN extends z.UnknownKeysParam,
    TCAT extends z.ZodTypeAny,
    TO,
    TI,
    T extends z.ZodObject<TT, TUN, TCAT, TO, TI>
  >(endPoint: string, searchquery: Object = {}, t: T): Promise<TO> {
    let str =
      '?' +
      Object.entries(searchquery)
        .map(([key, val]) => val && `${key}=${val}`)
        .join('&');
    const _url = this.baseURL + endPoint + str;

    return fetch(_url, this.prepare_request_get())
      .then((resp) => resp.json())
      .then((json) => {
        const resp: TO = this.parse_response(json, t);
        console.log('parse zod: ', resp);
        return resp;
      })
      .catch((err) => {
        throw err;
      });
  }

  postWithFileUpload<
    TT extends z.ZodRawShape,
    TUN extends z.UnknownKeysParam,
    TCAT extends z.ZodTypeAny,
    TO,
    TI,
    T extends z.ZodObject<TT, TUN, TCAT, TO, TI>
  >(endPoint: string, formData: FormData, t: T, onProgress?: (progress: number) => void): Promise<TO> {
    const _url = this.baseURL + endPoint;

    return new Promise<TO>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', _url, true);
      //xhr.setRequestHeader('Authorization', this.authHeaders().Authorization);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };

      // Attach a callback to handle the response
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const json = JSON.parse(xhr.responseText);
            const resp: TO = this.parse_response(json, t);
            resolve(resp);
          } catch (parseError) {
            reject(parseError);
          }
        } else if (xhr.status === 401) {
          reject({
            messaggioErrore: 'session expired',
            codiceErrore: error_GD00401,
          } as Err);
        } else if (xhr.status === 413) {
          reject({
            messaggioErrore: 'Too larg file',
            codiceErrore: error_GD1003,
          } as Err);
        } else {
          reject({
            codiceErrore: 'GD1001',
            messaggioErrore: `Unexpected response status: ${xhr.status}`,
          } as Err);
        }
      };

      // Attach a callback to handle network errors
      xhr.onerror = () => {
        reject({
          codiceErrore: 'GD1001',
          messaggioErrore: 'Network error',
        } as Err);
      };

      // Send the FormData with the file
      xhr.send(formData);
    });
  }
}
