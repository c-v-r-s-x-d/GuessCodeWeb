import * as signalR from '@microsoft/signalr';
import { ActivityStatus } from './api.generated';
import { tokenService } from './tokenService';

class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  public async startConnection() {
    try {
      const userId = tokenService.getUserId();
      if (!userId) {
        console.error('No user ID found for SignalR connection');
        return;
      }

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_API_URL + `/status-hub?userId=${userId}`)
        .withAutomaticReconnect()
        .build();

      await this.hubConnection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('Error establishing SignalR connection:', err);
    }
  }

  public async stopConnection() {
    try {
      if (this.hubConnection) {
        await this.hubConnection.stop();
        console.log('SignalR Disconnected');
      }
    } catch (err) {
      console.error('Error stopping SignalR connection:', err);
    }
  }
}

export const signalRService = new SignalRService(); 