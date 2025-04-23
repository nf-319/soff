class WebSocketService {
  private socket: WebSocket | null = null;
  private readonly baseUrl: string;

  constructor() {
    const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : ''
    const envUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || ''

    this.baseUrl = `wss://${subdomain}.${envUrl}`
    if (!this.baseUrl) {
      throw new Error('WebSocket base URL is not defined in the environment variables.');
    }
  }

  connect(endpoint: string, onMessage: (data: any) => void, onError: (error: any) => void) {
    if (this.socket) {
      console.warn('WebSocket is already connected!');
      return;
    }

    const url = `${this.baseUrl}${endpoint}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected to', url);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.reason);
    };

    this.socket.onerror = (error) => {
      onError(error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log('WebSocket disconnected');
    }
  }
}

const wsService = new WebSocketService();

export default wsService;
