const getBoardsByUidQuery = "SELECT * FROM boards WHERE user_id = $1";
const addBoard = "INSERT INTO boards (title, user_id, content) VALUES ($1, $2, $3) RETURNING *";
const getBoardById = "SELECT * FROM boards WHERE id = $1";
const updateBoardContent = "UPDATE boards SET content = $2 WHERE id = $1";
const updateBoardTitle = "UPDATE boards SET title = $2 WHERE id = $1";

export default { getBoardsByUidQuery, addBoard, getBoardById, updateBoardContent, updateBoardTitle };