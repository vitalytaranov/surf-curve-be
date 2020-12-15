import { Controller, All, Req, Res, Inject, CACHE_MANAGER, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { Method } from 'axios';
import { Request, Response } from 'express';
import { Cache } from 'cache-manager';

import {Data, GatewayService} from './gateway.service';


@Controller('*')
export class AppController {

  constructor(
    private readonly gatewayService: GatewayService,
    @Inject(CACHE_MANAGER) private _cacheManager: Cache
  ) {}

  @All()
  async handleAllRequests(@Req() request: Request, @Res() response: Response): Promise<void> {
    const [_, serviceName, ...remainingServiceUrl] = request.originalUrl.split('/');
    const serviceUrl = process.env[serviceName];

    console.log('serviceName: ', serviceName);
    console.log('remainingServiceUrl: ', remainingServiceUrl);
    console.log('process.env[serviceName]: ', process.env[serviceName]);
    console.log('serviceUrl: ', serviceUrl);

    if (serviceUrl) {
      const url = `${ serviceUrl }/${ remainingServiceUrl.join('/') }`;
      let serviceResponse = await this._cacheManager.get(url);

      console.log('url: ', url);
      console.log('this._cacheManager.get(url): ', this._cacheManager.get(url));

      if (!serviceResponse) {
        serviceResponse = await this.gatewayService.getData(
          url,
          request.method as Method,
          request.body
        );

        if (serviceName == 'products' && !remainingServiceUrl.length) {
          await this._cacheManager.set(url, serviceResponse, { ttl: 120 });
        }
      }

      response
        .set(serviceResponse.headers)
        .status(serviceResponse.status)
        .send(serviceResponse.data);
    } else {
      response
        .status(502)
        .send({ error: 'Cannot process request' });
    }
  }
}
