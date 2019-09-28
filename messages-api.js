const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const reqLimit = 5;
let reqRemaining = reqLimit;

const reqMiddleware = (req, res, next) => {
    console.log(reqRemaining);
    if (reqRemaining > 0) {
        reqRemaining = reqRemaining - 1;
        return next();
    } else {
        resetReqRemaining();
        return res.status(429).send('Requests blocked for 60 seconds');
    }
}
const resetReqRemaining = () => {
    console.log('time out set')
    setTimeout(() => { reqRemaining = reqLimit; console.log('Request limit reset') }, 60000);
}

app.use(bodyParser.json(), reqMiddleware);

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