//const sharp = require("sharp");

const uploadAndCompressImg = (req, res, next) =>{
    (err) =>{
        if(err){
            return res.status(400).json({error: err.message});
        }
    };
    //Module sharp pour la compression d'image
    const timestamp = Date.now();
    const name = req.file
    ? `images/${timestamp}-${req.file.originalname
    .split(".")[0]
    .match(/[a-zA-Z0-9]/g)
    .join("")} .webp`
    :next();
    if (req.file) {
        sharp(req.file.buffer)
        .resize(800)// Redimensionner l'image à une largeur de max de 800 pixels
        .webp({ quality: 80}) //Compression des images en webp 
        .toFile(name, (err, info) => { //Stokage de l'image sur le serveur local
            if (err){
                return res.status(500).json({ error: err.message});
            }
            // Gestion de la suppression d'image non compressé
            req.file.buffer = null;
            req.file.filename = name;
            next()
        });
    }
};

module.exports = uploadAndCompressImg;