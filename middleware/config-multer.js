const multer = require('multer');
//const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

//Session de stockage et gestion du types/format d'enregistrement de l'image
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '.webp');
    }
});

// Filtre d'image
const filter = (req, file, callback) => {
    if (file.mimetype.split("/")[0] === 'image') {
        callback(null, true);
    } else {
        callback(new Error("Only image files are supported"));
    }
};

//upload module
const upload = multer({ storage: storage, fileFilter: filter }).single('image');

//Module d'optimisation
const optimize = (req, res, next) => {
    if (req.file) {
        const filePath = req.file.path;
        const output = path.join('images', `opt_${req.file.filename}`);
        sharp(filePath)
            .resize({ width: null, height: 568, fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .webp()
            .toFile(output)
            .then(() => {
                fs.unlink(filePath, () => {
                    req.file.path = output;
                    next();
                })
            })
            .catch(err => next(err));
    } else {
        return next();
    }
};



exports.upload = upload;
exports.optimize = optimize;