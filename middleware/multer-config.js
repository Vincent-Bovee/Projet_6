const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    // la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
    filename: (req, file, callback) => {
        // Enleve les espaces et les remplace par un "_"
        const name = file.originalname.split(' ').join('_');
        // Extention de fichier
        const extension = MIME_TYPES[file.mimetype];
        // nom + date + extension
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.
module.exports = multer({storage: storage}).single('image');