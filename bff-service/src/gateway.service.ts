
import { Injectable } from '@nestjs/common';
import axios, { AxiosError, Method } from 'axios';

export interface Data {
  data: any;
  headers: any;
  status: number;
}

@Injectable()
export class GatewayService {
  getData(
    url: string,
    method: Method,
    body: any,
  ): Promise<Data> {
    return axios({
      url,
      method,
      ...(Object.keys(body || {}).length > 0 ? { data: body } : {}),
    })
      .then((data) => ({
        headers: data.headers,
        status: data.status,
        data: data.data,
      }))
      .catch((err: AxiosError) => {
        console.log('Error in service request', err);
        throw new Error('Error in service request');
      });
  }
}
