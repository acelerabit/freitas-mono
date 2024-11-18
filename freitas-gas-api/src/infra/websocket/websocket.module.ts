import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websocket.service';

@Module({
  providers: [WebsocketsGateway],
})
export class WebSocketModule {}
