const Sequelize = require('sequelize');

const databaseUrl = 'postgres://postgres:secret@localhost:5432/postgres';
const db = new Sequelize(databaseUrl);

const Movie = db.define('movies', {
    title: { type: Sequelize.TEXT, allowNull: false },
    yearOfRelease: Sequelize.INTEGER,
    synopsis: Sequelize.TEXT
});

// Left the force: true in on purpose for test reasons, and so you can reuse your postgres db (if settings are the same) when you check multiple homework assigments
db.sync({ force: true })
    .then(() => {
        console.log('Database connected and schema updated');
        Movie.create({
            title: 'The Avengers',
            yearOfRelease: 2012,
            synopsis: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity."
        });
        Movie.create({
            title: 'Avengers: Age of Ultron',
            yearOfRelease: 2015,
            synopsis: "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan."
        });
        Movie.create({
            title: 'Avengers: Infinity War',
            yearOfRelease: 2018,
            synopsis: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe."
        });
    })
    .catch(console.error);

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/movies', (req, res, next) => {
    const { title, yearOfRelease, synopsis } = req.body;
    if (title && yearOfRelease && synopsis) {
        Movie.create({ title, yearOfRelease, synopsis })
            .then(result => res.status(201).send(result))
            .catch(next);
    } else {
        res.status(400).end();
    }
});
app.get('/movies', (req, res, next) => {
    Movie.findAll()
        .then(result => res.status(200).send(result))
        .catch(next)
});
app.get('/movies/:id', (req, res, next) => {
    Movie.findByPk(req.params.id)
        .then(movie => {
            if (movie) {
                res.status(200).send(movie)
            } else {
                res.status(404).end();
            }
        })
        .catch(next)
});
app.put('/movies/:id', (req, res, next) => {
    Movie.findByPk(req.params.id)
        .then(movie => {
            if (movie) {
                movie.update(req.body)
                    .then(movie => res.send(movie))
            } else {
                res.status(404).end();
            }
        })
        .catch(next);
});
app.delete('/movies/:id', (req, res, next) => {
    Movie.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            if(result > 0 ) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }
        })
        .catch(next);
});
app.listen(port, console.log(`App listening to port ${port}`));
