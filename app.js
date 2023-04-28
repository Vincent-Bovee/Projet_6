const express = require('express');
const app = express();
const path = require('path');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')

app.use(express.json());


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


// const apiRequestLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 10, // limit each IP to 10 requests per windowMs
//     handler: function (req, res, /*next*/) {
//         return res.status(429).json({
//           error: 'Vous avez envoyé trop de demandes. Veuillez patienter un moment puis réessayer'
//         })
//     }
// })

// Connection BDD 
const mongoose = require('mongoose');
// MongoDB > Database > Connect > Connect your application
mongoose.connect('mongodb+srv://vincentb:HpVNWLzuJSottFLP@cluster0.rnanxfc.mongodb.net/?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.disable('x-powered-by');

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());

// app.use(apiRequestLimiter);

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;