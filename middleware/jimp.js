const Jimp = require('jimp');

const uploadAndCompressImg = (req, res, next) => {
  (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
  };
 
  const timestamp = Date.now();
  const name = req.file
    ? `images/${timestamp}-${req.file.originalname
        .split(".")[0]
        .match(/[a-zA-Z0-9]/g)
        .join(" ")}.webp`
    : next();
 
  if (req.file) {
    Jimp.read(req.file.buffer)
      .then(image => {
        return image
          .resize(800, Jimp.AUTO) // Redimensionner l'image à une largeur de max de 800 pixels, en conservant le ratio
          .quality(80) // Qualité de compression à 80
          .write(name); // Écrire l'image compressée sur le disque
      })
      .then(() => {
        // Gestion de la suppression d'image non compressée
        req.file.buffer = null;
        req.file.filename = name;
        next();
      })
      .catch(err => {
        return res.status(500).json({ error: err.message });
      });
  }
};

module.exports = uploadAndCompressImg;