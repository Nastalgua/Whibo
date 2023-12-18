import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';

import { DrawLine } from '../types/drawing.js';
import { SocketUser } from '../types/socketUser.js';
import { generateUsername } from "unique-username-generator";

const users = new Map<string, SocketUser>(); // <socketId, SocketUser>
const rooms = new Map<string, Array<string>>(); // <roomId, userId[]>

export const startSocketServer = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    cors: {
      origin: '*'
    }
  });

  io.on("connect", startListeners);

  return io;
}

const startListeners = (socket: Socket) => {
  const roomId: string = socket.handshake.query['rid'] as string; // roomId <--> boardId
  const userId: string = socket.handshake.query['uid'] as string;
  const userUsername: string = socket.handshake.query['uUsername'] as string;

  socket.on("handshake", (callback : () => void) => {
    // check if this user is anonymous
    const sUser: SocketUser = {
      id: userId,
      username: userUsername.length > 0 ? userUsername : generateUsername()
    }

    // add to mappings of users and rooms
    users.set(socket.id, sUser);
    if (!rooms.has(roomId)) { rooms.set(roomId, []); }
    rooms.get(roomId).push(socket.id);

    console.log("Handshake received from " + socket.id);
    sendRoomMessage(socket, "user-connected", roomId, { user: getUsersInRoom(roomId) });
  });

  socket.on("disconnect", () => {
    // remove the remove from the map when there is no one in the room
    if (rooms.get(roomId).length <= 0) { rooms.delete(roomId); }
    users.delete(socket.id);
  });

  // Draws line only in the room passed in query.
  socket.on("draw-line", ({ prevPoint, currentPoint, color } : DrawLine) => {
    socket.in(roomId).emit('draw-line', { prevPoint, currentPoint, color })
  });
}

/**
 * Emits to all users connected to room with id, [roomId].
 * @param socket Socket.io socket.
 * @param name Name of event.
 * @param roomId Id of room.
 * @param payload Information to pass to all other users in the room.
 */
const sendRoomMessage = (socket: Socket, name: string, roomId: string, payload: Object) => {  
  socket.in(roomId).emit(name, payload);
}

/**
 * Gives back all the users in that room.
 * @param roomId Id of the room.
 * @returns An array of socket users.
 */
const getUsersInRoom = (roomId: string) : Array<SocketUser> => {
  const room = rooms.get(roomId);
  return room.map((userId: string) => users.get(userId));
}
