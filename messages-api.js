const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/messages', (req, res) => {
    const { text } = req.body;
    if (text && typeof text === 'string' && text.length > 0) {
        res.status(200).send({
            message: text
        });
    } else {
        res.status(400).end();
    }
})
app.listen(port, console.log(`App listening to port ${port}`));