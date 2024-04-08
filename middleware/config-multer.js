const multer = require('multer');

//Session de stockage en mémoire
const storage = multer.memoryStorage();



exports.upload = multer({ storage: storage}); 