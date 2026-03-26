const photoModel = require('../models/photo');
require('dotenv').config();
const { Readable } = require('stream');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
            return cb(new Error('Type de fichier non autorisé. Seuls jpeg, png, webp et gif sont acceptés.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
    uploadPhoto: async (req, res) => {
        upload.single('image')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: 'Échec du téléchargement du fichier.' });
            }
            try {
                const fileBuffer = req.file.buffer;
                // console.log(fileBuffer);

                // Télécharger l'image sur Cloudinary
                const uploadStream = cloudinary.uploader.upload_stream({ timeout: 120000 }, (error, result) => {
                    if (error) {
                        console.error(`Échec du téléchargement de l'image:`, error);
                        return res.status(500).json({ error: `Échec du téléchargement de l'image` });
                    }

                    const { secure_url: image, public_id } = result;

                    // Une fois le téléchargement réussi, les informations sur l'image sont enregistrées dans la base de données.
                    const newPhoto = new photoModel({
                        url: image,
                        filters: JSON.parse(req.query.filters),
                        public_id: public_id,
                    });

                    const photoSaved = newPhoto.save();
                    if (photoSaved) {
                        console.log('Photo est bien enregistrée');
                        return res.json({ result: true });
                    }
                });

                // Convertir le tampon d'image en flux lisible
                const stream = Readable.from(fileBuffer);

                // Passer le tampon d'image pour télécharger le flux
                stream.pipe(uploadStream);
            } catch (err) {
                return res.status(500).json({ error: err });
            }
        });
    },

    loadPhoto: async (req, res) => {
        try {
            const foundPhoto = await photoModel.find();
            console.log(foundPhoto);
            if (!foundPhoto) {
                return res.json({ result: false, message: 'photo inexistant.' });
            }

            return res.json({ result: true, photos: foundPhoto });
        } catch (error) {
            return res.json({ result: false, error: error });
        }
    },
};
