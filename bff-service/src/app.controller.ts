import { Controller, Get, Request, Post, UseGuards, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {

  constructor() {}

  @Get([ '', 'ping' ])
  healthCheck(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }
}
