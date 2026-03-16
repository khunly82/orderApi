import express, { json } from 'express';
import mongoose from 'mongoose';
import promBundle from 'express-prom-bundle';

const metricsMiddleware = promBundle({
 includeMethod: true, 
 includePath: true, 
 includeStatusCode: true, 
 includeUp: true,
 promClient: {
    collectDefaultMetrics: {
    }
 }
});

const app = express();

app.use(metricsMiddleware);

mongoose.connect(process.env.MONGO_URI);

const schema = new mongoose.Schema({
    date: { type: Date },
    lines: { type: Array }
});

const model = mongoose.model('orders', schema);

app.use(json());

app.post('/order', async (req, res) => {
    console.log(req.body)
    await model.create({ ...req.body, date: new Date() });
    res.sendStatus(200);
});

app.get('/order', async (req, res) => {
    res.send(await model.find());
})

app.listen(3000, () => console.log('server is running and is listening port 3000'))