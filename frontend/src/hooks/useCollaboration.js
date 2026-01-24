import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocket';
import useAuthStore from '../store/authStore';

/**
 * useCollaboration - Custom hook for real-time circuit collaboration
 */
export const useCollaboration = (circuitId) => {
  const { user, isAuthenticated, token } = useAuthStore();
  const [connected, setConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [messages, setMessages] = useState([]);
  const [syncRequired, setSyncRequired] = useState(false);
  const listenersRegistered = useRef(false);

  // Connect to WebSocket
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    websocketService.connect(user.id, user.username, token);
    setConnected(websocketService.isConnected());

    const handleConnected = () => setConnected(true);
    const handleDisconnected = () => setConnected(false);

    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);

    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
    };
  }, [isAuthenticated, user, token]);

  // Join/leave circuit room
  useEffect(() => {
    if (!connected || !circuitId) return;

    websocketService.joinCircuit(circuitId);

    return () => {
      if (circuitId) {
        websocketService.leaveCircuit(circuitId);
      }
    };
  }, [connected, circuitId]);

  // Register event listeners
  useEffect(() => {
    if (!connected || listenersRegistered.current) return;

    const handleUserJoined = (data) => {
      setRoomUsers(prev => [...prev, data]);
      setMessages(prev => [...prev, {
        type: 'system',
        text: `${data.username} joined`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleUserLeft = (data) => {
      setRoomUsers(prev => prev.filter(u => u.sid !== data.sid));
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[data.sid];
        return newCursors;
      });
      setMessages(prev => [...prev, {
        type: 'system',
        text: `${data.username} left`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleRoomState = (data) => {
      setRoomUsers(data.users || []);
      setCursors(data.cursors || {});
    };

    const handleCursorUpdate = (data) => {
      setCursors(prev => ({
        ...prev,
        [data.sid]: data.cursor
      }));
    };

    const handleChatMessage = (data) => {
      setMessages(prev => [...prev, {
        type: 'chat',
        user_id: data.user_id,
        username: data.username,
        text: data.message,
        timestamp: data.timestamp
      }]);
    };

    const handleSyncRequest = () => {
      setSyncRequired(true);
    };

    websocketService.on('user_joined', handleUserJoined);
    websocketService.on('user_left', handleUserLeft);
    websocketService.on('room_state', handleRoomState);
    websocketService.on('cursor_update', handleCursorUpdate);
    websocketService.on('chat_message', handleChatMessage);
    websocketService.on('sync_request', handleSyncRequest);

    listenersRegistered.current = true;

    return () => {
      websocketService.off('user_joined', handleUserJoined);
      websocketService.off('user_left', handleUserLeft);
      websocketService.off('room_state', handleRoomState);
      websocketService.off('cursor_update', handleCursorUpdate);
      websocketService.off('chat_message', handleChatMessage);
      websocketService.off('sync_request', handleSyncRequest);
      listenersRegistered.current = false;
    };
  }, [connected]);

  // Collaboration actions
  const sendCursor = useCallback((x, y) => {
    if (!connected || !circuitId) return;
    websocketService.sendCursorMove(circuitId, { x, y });
  }, [connected, circuitId]);

  const sendMessage = useCallback((message) => {
    if (!connected || !circuitId) return;
    websocketService.sendChatMessage(circuitId, message);
  }, [connected, circuitId]);

  const sendGateAdded = useCallback((gate) => {
    if (!connected || !circuitId) return;
    websocketService.sendGateAdded(circuitId, gate);
  }, [connected, circuitId]);

  const sendGateRemoved = useCallback((gateIndex) => {
    if (!connected || !circuitId) return;
    websocketService.sendGateRemoved(circuitId, gateIndex);
  }, [connected, circuitId]);

  const sendGateMoved = useCallback((gateIndex, newPosition) => {
    if (!connected || !circuitId) return;
    websocketService.sendGateMoved(circuitId, gateIndex, newPosition);
  }, [connected, circuitId]);

  const sendCircuitUpdate = useCallback((circuitData) => {
    if (!connected || !circuitId) return;
    websocketService.sendCircuitUpdate(circuitId, circuitData);
  }, [connected, circuitId]);

  const requestSync = useCallback(() => {
    if (!connected || !circuitId) return;
    websocketService.requestSync(circuitId);
  }, [connected, circuitId]);

  const respondSync = useCallback((requesterSid, circuitData) => {
    if (!connected) return;
    websocketService.sendSyncResponse(requesterSid, circuitData);
    setSyncRequired(false);
  }, [connected]);

  return {
    connected,
    roomUsers,
    cursors,
    messages,
    syncRequired,
    sendCursor,
    sendMessage,
    sendGateAdded,
    sendGateRemoved,
    sendGateMoved,
    sendCircuitUpdate,
    requestSync,
    respondSync
  };
};

/**
 * useCollaborativeGates - Hook for listening to gate changes from other users
 */
export const useCollaborativeGates = (circuitId, onGateChange) => {
  const [remoteChanges, setRemoteChanges] = useState([]);

  useEffect(() => {
    if (!circuitId) return;

    const handleGateAdded = (data) => {
      const change = { type: 'add', gate: data.gate, user: data.username, timestamp: data.timestamp };
      setRemoteChanges(prev => [...prev, change]);
      if (onGateChange) onGateChange(change);
    };

    const handleGateRemoved = (data) => {
      const change = { type: 'remove', gateIndex: data.gate_index, user: data.username, timestamp: data.timestamp };
      setRemoteChanges(prev => [...prev, change]);
      if (onGateChange) onGateChange(change);
    };

    const handleGateMoved = (data) => {
      const change = { 
        type: 'move', 
        gateIndex: data.gate_index, 
        newPosition: data.new_position,
        user: data.username, 
        timestamp: data.timestamp 
      };
      setRemoteChanges(prev => [...prev, change]);
      if (onGateChange) onGateChange(change);
    };

    const handleCircuitUpdated = (data) => {
      const change = { 
        type: 'update', 
        circuitData: data.circuit_data,
        user: data.username, 
        timestamp: data.timestamp 
      };
      setRemoteChanges(prev => [...prev, change]);
      if (onGateChange) onGateChange(change);
    };

    websocketService.on('gate_added', handleGateAdded);
    websocketService.on('gate_removed', handleGateRemoved);
    websocketService.on('gate_moved', handleGateMoved);
    websocketService.on('circuit_updated', handleCircuitUpdated);

    return () => {
      websocketService.off('gate_added', handleGateAdded);
      websocketService.off('gate_removed', handleGateRemoved);
      websocketService.off('gate_moved', handleGateMoved);
      websocketService.off('circuit_updated', handleCircuitUpdated);
    };
  }, [circuitId, onGateChange]);

  return { remoteChanges };
};

export default useCollaboration;
