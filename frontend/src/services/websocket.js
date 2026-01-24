import { io } from 'socket.io-client';

/**
 * WebSocket Service - Manages real-time collaboration via Socket.IO
 */

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect(userId, username, token) {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return this.socket;
    }

    const url = import.meta.env.VITE_WS_URL || 'http://localhost:8000';
    
    this.socket = io(url, {
      auth: {
        user_id: userId,
        username: username,
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket.id);
      this.connected = true;
      this.emit('connected', { sid: this.socket.id });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connected = false;
      this.emit('disconnected');
    });

    this.socket.on('connection_established', (data) => {
      console.log('Connection established:', data);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Room management
  joinCircuit(circuitId) {
    if (!this.isConnected()) {
      console.error('Cannot join circuit: not connected');
      return;
    }
    this.socket.emit('join_circuit', { circuit_id: circuitId });
  }

  leaveCircuit(circuitId) {
    if (!this.isConnected()) return;
    this.socket.emit('leave_circuit', { circuit_id: circuitId });
  }

  // Collaborative editing events
  sendGateAdded(circuitId, gate) {
    if (!this.isConnected()) return;
    this.socket.emit('gate_added', {
      circuit_id: circuitId,
      gate: gate
    });
  }

  sendGateRemoved(circuitId, gateIndex) {
    if (!this.isConnected()) return;
    this.socket.emit('gate_removed', {
      circuit_id: circuitId,
      gate_index: gateIndex
    });
  }

  sendGateMoved(circuitId, gateIndex, newPosition) {
    if (!this.isConnected()) return;
    this.socket.emit('gate_moved', {
      circuit_id: circuitId,
      gate_index: gateIndex,
      new_position: newPosition
    });
  }

  sendCursorMove(circuitId, cursor) {
    if (!this.isConnected()) return;
    this.socket.emit('cursor_move', {
      circuit_id: circuitId,
      cursor: cursor
    });
  }

  sendChatMessage(circuitId, message) {
    if (!this.isConnected()) return;
    this.socket.emit('chat_message', {
      circuit_id: circuitId,
      message: message
    });
  }

  sendCircuitUpdate(circuitId, circuitData) {
    if (!this.isConnected()) return;
    this.socket.emit('circuit_update', {
      circuit_id: circuitId,
      circuit_data: circuitData
    });
  }

  requestSync(circuitId) {
    if (!this.isConnected()) return;
    this.socket.emit('request_sync', { circuit_id: circuitId });
  }

  sendSyncResponse(requesterSid, circuitData) {
    if (!this.isConnected()) return;
    this.socket.emit('sync_response', {
      requester_sid: requesterSid,
      circuit_data: circuitData
    });
  }

  // Event listeners
  on(event, callback) {
    if (!this.socket) {
      console.warn('Cannot add listener: socket not initialized');
      return;
    }

    // Store callback for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    // Remove from stored listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit custom events (for internal use)
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Ping/pong for connection health
  ping() {
    if (!this.isConnected()) return;
    this.socket.emit('ping', { timestamp: Date.now() });
  }
}

// Singleton instance
const websocketService = new WebSocketService();

export default websocketService;
