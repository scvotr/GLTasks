const formidable = require('formidable');

function getPostDataset(req) {
  return new Promise((resolve, reject) => {
    try {
      const contentType = req.headers['content-type'];

      if (contentType.startsWith('multipart/form-data')) {
        const form = new formidable.IncomingForm();
        form.multiples = true;
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              fields,
              files
            });
          }
        });

      } else if (contentType === 'application/json') {
        let postBodyPayload = '';
        req.on('data', chunk => {
          postBodyPayload += chunk.toString();
        });
        req.on('end', () => {
          try {
            resolve(postBodyPayload);
            // resolve(JSON.parse(postBodyPayload));
          } catch (error) {
            reject(new Error('Invalid JSON payload'));
          }
        });
      } else {
        reject(new Error(`Unsupported content type: ${contentType}`));
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getPostDataset,
};