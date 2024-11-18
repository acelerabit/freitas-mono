import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../database/prisma/prisma.service';

@WebSocketGateway({ cors: true })
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients: Set<Socket> = new Set();

  constructor(private prismaService: PrismaService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
    this.clients.add(client);
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('notify')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  async sendNotification(userId: string, message: string) {
    let toSend: string;
    for (const [socketId, socket] of this.server.of('/').sockets) {
      if (userId === socket.handshake.auth.userId) {
        toSend = socketId;
        break;
      }
    }

    const notification = await this.prismaService.notification.create({
      data: {
        message,
        userId,
      },
    });

    this.server.to(toSend).emit('notify', notification);
  }
}
