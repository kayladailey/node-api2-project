const express = require ('express');
const server = express();
const postRoutes = require('./posts/postRoutes');



 server.use ('/api', postRoutes);


server.listen(8000, () => console.log('API running on port 8000'));