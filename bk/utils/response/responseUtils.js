const sendResponseWithData = (res, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(data));
    res.end();
  }
  
  const handleError = (res, error) => {
    console.error('handleError', error);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: error,
      })
    );
  }
  
  module.exports = { sendResponseWithData, handleError };