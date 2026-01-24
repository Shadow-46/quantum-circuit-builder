import socketio
from typing import Dict, Set
from datetime import datetime
import json

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:5173', 'http://localhost:5174']
)

# Room management
rooms: Dict[str, Set[str]] = {}  # circuit_id -> set of session_ids
user_sessions: Dict[str, dict] = {}  # session_id -> user_info
circuit_cursors: Dict[str, Dict[str, dict]] = {}  # circuit_id -> {user_id -> cursor_pos}

@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    print(f"Client connected: {sid}")
    user_sessions[sid] = {
        'sid': sid,
        'user_id': auth.get('user_id') if auth else None,
        'username': auth.get('username') if auth else 'Anonymous',
        'connected_at': datetime.utcnow().isoformat()
    }
    await sio.emit('connection_established', {'sid': sid}, room=sid)

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"Client disconnected: {sid}")
    
    # Remove from all rooms
    for circuit_id in list(rooms.keys()):
        if sid in rooms[circuit_id]:
            await leave_room_internal(sid, circuit_id)
    
    # Clean up user session
    if sid in user_sessions:
        del user_sessions[sid]

@sio.event
async def join_circuit(sid, data):
    """Join a circuit collaboration room"""
    circuit_id = data.get('circuit_id')
    user_info = user_sessions.get(sid, {})
    
    if not circuit_id:
        await sio.emit('error', {'message': 'Circuit ID required'}, room=sid)
        return
    
    # Add to room
    await sio.enter_room(sid, circuit_id)
    
    if circuit_id not in rooms:
        rooms[circuit_id] = set()
    rooms[circuit_id].add(sid)
    
    # Initialize cursor tracking
    if circuit_id not in circuit_cursors:
        circuit_cursors[circuit_id] = {}
    
    # Notify others in the room
    await sio.emit('user_joined', {
        'user_id': user_info.get('user_id'),
        'username': user_info.get('username'),
        'sid': sid
    }, room=circuit_id, skip_sid=sid)
    
    # Send current room state to the joining user
    room_users = []
    for user_sid in rooms[circuit_id]:
        if user_sid != sid:
            user = user_sessions.get(user_sid, {})
            room_users.append({
                'sid': user_sid,
                'user_id': user.get('user_id'),
                'username': user.get('username')
            })
    
    await sio.emit('room_state', {
        'circuit_id': circuit_id,
        'users': room_users,
        'cursors': circuit_cursors.get(circuit_id, {})
    }, room=sid)

@sio.event
async def leave_circuit(sid, data):
    """Leave a circuit collaboration room"""
    circuit_id = data.get('circuit_id')
    await leave_room_internal(sid, circuit_id)

async def leave_room_internal(sid, circuit_id):
    """Internal helper to leave a room"""
    if circuit_id in rooms and sid in rooms[circuit_id]:
        rooms[circuit_id].remove(sid)
        
        # Remove cursor
        if circuit_id in circuit_cursors and sid in circuit_cursors[circuit_id]:
            del circuit_cursors[circuit_id][sid]
        
        # Notify others
        user_info = user_sessions.get(sid, {})
        await sio.emit('user_left', {
            'user_id': user_info.get('user_id'),
            'username': user_info.get('username'),
            'sid': sid
        }, room=circuit_id)
        
        await sio.leave_room(sid, circuit_id)
        
        # Clean up empty rooms
        if not rooms[circuit_id]:
            del rooms[circuit_id]
            if circuit_id in circuit_cursors:
                del circuit_cursors[circuit_id]

@sio.event
async def gate_added(sid, data):
    """Broadcast gate addition to room"""
    circuit_id = data.get('circuit_id')
    gate_data = data.get('gate')
    user_info = user_sessions.get(sid, {})
    
    await sio.emit('gate_added', {
        'gate': gate_data,
        'user_id': user_info.get('user_id'),
        'username': user_info.get('username'),
        'timestamp': datetime.utcnow().isoformat()
    }, room=circuit_id, skip_sid=sid)

@sio.event
async def gate_removed(sid, data):
    """Broadcast gate removal to room"""
    circuit_id = data.get('circuit_id')
    gate_index = data.get('gate_index')
    user_info = user_sessions.get(sid, {})
    
    await sio.emit('gate_removed', {
        'gate_index': gate_index,
        'user_id': user_info.get('user_id'),
        'username': user_info.get('username'),
        'timestamp': datetime.utcnow().isoformat()
    }, room=circuit_id, skip_sid=sid)

@sio.event
async def gate_moved(sid, data):
    """Broadcast gate movement to room"""
    circuit_id = data.get('circuit_id')
    gate_index = data.get('gate_index')
    new_position = data.get('new_position')
    user_info = user_sessions.get(sid, {})
    
    await sio.emit('gate_moved', {
        'gate_index': gate_index,
        'new_position': new_position,
        'user_id': user_info.get('user_id'),
        'username': user_info.get('username'),
        'timestamp': datetime.utcnow().isoformat()
    }, room=circuit_id, skip_sid=sid)

@sio.event
async def cursor_move(sid, data):
    """Broadcast cursor movement to room"""
    circuit_id = data.get('circuit_id')
    cursor_pos = data.get('cursor')
    user_info = user_sessions.get(sid, {})
    
    # Update cursor position
    if circuit_id in circuit_cursors:
        circuit_cursors[circuit_id][sid] = {
            'x': cursor_pos.get('x'),
            'y': cursor_pos.get('y'),
            'user_id': user_info.get('user_id'),
            'username': user_info.get('username')
        }
        
        await sio.emit('cursor_update', {
            'sid': sid,
            'cursor': circuit_cursors[circuit_id][sid]
        }, room=circuit_id, skip_sid=sid)

@sio.event
async def chat_message(sid, data):
    """Broadcast chat message to room"""
    circuit_id = data.get('circuit_id')
    message = data.get('message')
    user_info = user_sessions.get(sid, {})
    
    await sio.emit('chat_message', {
        'user_id': user_info.get('user_id'),
        'username': user_info.get('username'),
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    }, room=circuit_id)

@sio.event
async def circuit_update(sid, data):
    """Broadcast full circuit state update"""
    circuit_id = data.get('circuit_id')
    circuit_data = data.get('circuit_data')
    user_info = user_sessions.get(sid, {})
    
    await sio.emit('circuit_updated', {
        'circuit_data': circuit_data,
        'user_id': user_info.get('user_id'),
        'username': user_info.get('username'),
        'timestamp': datetime.utcnow().isoformat()
    }, room=circuit_id, skip_sid=sid)

@sio.event
async def request_sync(sid, data):
    """Request circuit sync from room"""
    circuit_id = data.get('circuit_id')
    
    # Ask someone in the room to send their state
    await sio.emit('sync_request', {
        'requester_sid': sid
    }, room=circuit_id, skip_sid=sid)

@sio.event
async def sync_response(sid, data):
    """Send circuit state to requesting user"""
    requester_sid = data.get('requester_sid')
    circuit_data = data.get('circuit_data')
    
    await sio.emit('sync_data', {
        'circuit_data': circuit_data
    }, room=requester_sid)

# Health check
@sio.event
async def ping(sid, data):
    """Respond to ping"""
    await sio.emit('pong', {'timestamp': datetime.utcnow().isoformat()}, room=sid)
