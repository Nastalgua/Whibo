const getUserById = "SELECT * FROM users WHERE id = $1";
const getUserByGoogleId = "SELECT * FROM users WHERE google_id = $1";
const addUserFromGoogle = "INSERT INTO users (google_id, username, email) VALUES ($1, $2, $3) RETURNING *";

export default { 
  getUserById,
  getUserByGoogleId, 
  addUserFromGoogle 
};