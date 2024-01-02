import { Router } from "express";
import { checkAuth } from "./authRoute";

import pool from '../config/db';

import BoardQueries from '../config/queries/boardQueries';
import { IBoard } from "../types/board";

import { validate } from 'uuid';

const router = Router();

router.post('/create-board', checkAuth, async (req, res) => {
  const user_id = req.query.user_id;
  const content = ""; // default is empty content
  const title = "Untitled Board"

  const board = (await pool.query(BoardQueries.addBoard, [title, user_id, content])).rows[0];
  const filteredBoard : IBoard = {
    id: board.id,
    title: board.title,
    userId: board.user_id,
    content: board.content,
    createdAt: board.created_at
  }

  res.status(200).json({ board: filteredBoard });
});

router.get('/own-boards', checkAuth, async (req, res) => {
  const user_id = req.query.user_id;
  let boards = (await pool.query(BoardQueries.getBoardsByUidQuery, [user_id])).rows;

  boards = boards.map((board) => {
    return {
      id: board.id,
      title: board.title,
      userId: board.user_id,
      content: board.content,
      createdAt: board.created_at
    }
  });

  res.status(200).json({ boards });
});

router.get('/board-info', async (req, res) => {
  const board_id: string = req.query.board_id as string;

  if (!validate(board_id)) {
    return res.status(200).json({ board: null });
  }

  const response = (await pool.query(BoardQueries.getBoardById, [board_id]));

  if (response.rowCount <= 0) {
    return res.status(200).json({ board: null });
  }

  const board = response.rows[0];
  const filteredBoard : IBoard = {
    id: board.id,
    title: board.title,
    userId: board.user_id,
    content: board.content,
    createdAt: board.created_at
  }

  return res.status(200).json({ board: filteredBoard });
});

export default router;