import { WebSocketServer } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer | null = null;

export function initWebSocket(server: Server) {
  wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
  
  return wss;
}

export function broadcastFeedbackUpdate(data: any) {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { 
        client.send(JSON.stringify({
          type: 'FEEDBACK_UPDATE',
          data
        }));
      }
    });
  }
}