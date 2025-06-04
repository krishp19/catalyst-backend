import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { JwtPayload } from '../common/interfaces';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap: Map<string, string[]> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }
      
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      if (!payload || !payload.sub) {
        client.disconnect();
        return;
      }
      
      const userId = payload.sub;
      
      // Store socket connection for this user
      if (!this.userSocketMap.has(userId)) {
        this.userSocketMap.set(userId, []);
      }
      
      this.userSocketMap.get(userId).push(client.id);
      
      // Join user to their own room
      client.join(`user-${userId}`);
      
      // Acknowledge connection
      client.emit('connected', { message: 'Connected to notification service' });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove the socket connection
    for (const [userId, sockets] of this.userSocketMap.entries()) {
      const index = sockets.indexOf(client.id);
      
      if (index !== -1) {
        sockets.splice(index, 1);
        
        if (sockets.length === 0) {
          this.userSocketMap.delete(userId);
        }
        
        break;
      }
    }
  }

  sendNotification(userId: string, notification: Notification) {
    this.server.to(`user-${userId}`).emit('notification', notification);
  }
}