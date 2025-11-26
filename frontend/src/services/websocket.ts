import { io, Socket } from "socket.io-client";
import { env } from "../config/env";

/**
 * WebSocket Service
 * Manages Socket.io connection for real-time features
 */

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  /**
   * Initialize WebSocket connection
   */
  connect(token?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const tokenFromStorage = localStorage.getItem("token");
    const authToken = token || tokenFromStorage;

    this.socket = io(env.wsUrl, {
      auth: {
        token: authToken,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      console.log("WebSocket disconnected");
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("WebSocket connection error:", error);
      this.isConnected = false;
    });

    return this.socket;
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Emit event
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("WebSocket not connected. Cannot emit event:", event);
    }
  }

  /**
   * Listen to event
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
