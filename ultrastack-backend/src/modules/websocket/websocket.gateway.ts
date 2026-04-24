import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ServerMetrics } from '../../types/ServerMetrics';
import { NotificationPayload } from '../../types/NotificationPayload';
import { WebsocketService } from './websocket.service';

// Enabled CORS to allow connections from your Next.js frontend
@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('WebsocketGateway');

  constructor(private readonly wsService: WebsocketService) {}

  // Called after the gateway is initialized
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
    
    // Simulate real-time data streaming (e.g., server metrics)
    setInterval(() => {
      const metrics: ServerMetrics = this.wsService.getServerMetrics();
      // Broadcast to all connected clients
      this.server.emit('server-metrics', metrics);
    }, 3000);
  }

  // Handle new client connection
  handleConnection(client: Socket, ...args: unknown[]) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Send a welcome message to the specific client using the service logic
    const welcomeMessage: NotificationPayload = this.wsService.prepareNotification(
      'Welcome to the Real-time Dashboard!',
    );

    client.emit('notification', welcomeMessage);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Listen to 'ping' event from client and respond with 'pong'
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: Record<string, unknown>): void {
    this.logger.log(`Ping received from ${client.id}: ${JSON.stringify(data)}`);
    
    // Reply to the sender only
    client.emit('pong', { 
        reply: 'Server is alive',
        receivedData: data 
    });
  }

  // Join a specific room (useful for private chats or specific entity updates)
  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    
    this.server.to(room).emit('room-notification', `User ${client.id} joined ${room}`);
  }

  // Handle sending message to a specific room
  @SubscribeMessage('message-to-room')
  handleMessageToRoom(
    @MessageBody() payload: { room: string; message: string },
  ): void {
    this.server.to(payload.room).emit('new-room-message', payload.message);
  }

  // Global broadcast method to be used from other services
  sendGlobalNotification(message: string): void {
    const notification = this.wsService.prepareNotification(message, 'GLOBAL_ALERT');
    this.server.emit('notification', notification);
  }
}