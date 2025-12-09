declare module 'socket.io-client' {
  export interface Socket {
    connected: boolean;
    disconnect(): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
    emit(event: string, data?: any): void;
  }

  export interface SocketOptions {
    auth?: {
      token?: string;
    };
    transports?: string[];
    reconnection?: boolean;
    reconnectionDelay?: number;
    reconnectionAttempts?: number;
  }

  export function io(url?: string, options?: SocketOptions): Socket;
  
  export default io;
}

