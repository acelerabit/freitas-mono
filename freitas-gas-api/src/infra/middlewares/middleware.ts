import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req, res, next) {
    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');

      /**
       *
       * req.id = token.id
       * req.email = token.email
       */

      return token;
    }

    next();
  }
}
