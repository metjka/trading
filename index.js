import express from 'express';
import {z} from "zod";
import {getHistoryData} from "./history.js";

const app = express();


app.use(express.json());
let zodObject = z.object({
    symbol: z.string(),
    interval: z.string(),
    from: z.coerce.number().optional(),
    to: z.coerce.number().optional()
});
app.get('/history', async (req, res) => {
    try {
        let parse = zodObject.parse(req.query);
        let {symbol, from, to, interval} = parse;

        const historyData = await getHistoryData(symbol, from, to, interval);
        res.status(200).send(historyData);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(4001);





