const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupère le token et le sépare pour avoir l'ID et le code 
        const token = req.headers.authorization.split(' ')[1];
        // La méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token (sur une requête entrante, par exemple). 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } 
    catch (error) {
        res.status(401).json({
            error
        });
    }
};