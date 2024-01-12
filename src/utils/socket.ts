import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';

import { DrawLine } from '../types/drawing.js';
import { SocketUser } from '../types/socketUser.js';

import { generateUsername } from "unique-username-generator";
import { v4 as uuidv4 } from 'uuid';

const users = new Map<string, SocketUser>(); // <socketId, SocketUser>
const rooms = new Map<string, Array<SocketUser>>(); // <roomId, SocketUser[]>

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

  const reconnected = Object.values(users).some((user) => user.socketId === socket.id);

  if (!rooms.has(roomId)) { rooms.set(roomId, []); }
  socket.join(roomId);

  socket.on("handshake", (callback : (uid: string, users: SocketUser[]) => void) => {
    if (reconnected) {
      const user = users.get(socket.id);

      if (user) {
        rooms.get(roomId).push(user);
        callback(user.uid, getUsersInRoom(roomId));
        return;
      }
    }

    /** New user */
    const sUser: SocketUser = {
      uid: userId.length > 0 ? userId : uuidv4(), // check if this user is anonymous
      username: userUsername.length > 0 ? userUsername : generateUsername(),
      socketId: socket.id
    }

    // add to mappings of users and rooms
    users.set(socket.id, sUser);
    rooms.get(roomId).push(sUser);

    // call fn of user who started this socket
    callback(sUser.uid, getUsersInRoom(roomId));

    console.log("Handshake received from " + socket.id);

    // send message to everyone else in the room
    sendRoomMessage(socket, "user-connected", roomId, getUsersInRoom(roomId));
  });

  socket.on("disconnect", () => {
    console.log("Disconnection from " + socket.id);

    // remove the remove from the map when there is no one in the room
    users.delete(socket.id);
    const oldRoomUsers = rooms.get(roomId);

    rooms.set(roomId, oldRoomUsers.filter((sUser) => sUser.socketId !== socket.id));
    
    sendRoomMessage(socket, "user-disconnected", roomId, getUsersInRoom(roomId));
    
    // cleanup empty rooms
    if (rooms.has(roomId) && rooms.get(roomId).length <= 0) { rooms.delete(roomId); }
  });

  // Draws line only in the room passed in query.
  socket.on("draw-line", ({ prevPoint, currentPoint, color } : DrawLine) => {
    socket.in(roomId).emit('draw-line', { prevPoint, currentPoint, color });
  });

  socket.on("undraw-line", ({ prevPoint } : DrawLine) => {
    socket.in(roomId).emit('undraw-line', { prevPoint });
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

  if (!room) return [];
  
  return room.map((sUser : SocketUser) => sUser);
}
