function handleServerError(res, error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
  function handleNotFoundError(res, message) {
    res.status(404).json({ error: message });
  }

  function handleMongoDBError(err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
  
  module.exports = { handleServerError, handleNotFoundError, handleMongoDBError };
  