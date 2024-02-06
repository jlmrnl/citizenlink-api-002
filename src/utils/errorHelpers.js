function handleServerError(res, error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
  function handleNotFoundError(res, message) {
    res.status(404).json({ error: message });
  }
  
  module.exports = { handleServerError, handleNotFoundError };
  