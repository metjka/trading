import Binance from "node-binance-api";


function getBinance() {
    const binance = new Binance({
        test: true,
        APIKEY: process.env.BINANCE_API_KEY,
        APISECRET: process.env.BINANCE_API_SECRET,
        useServerTime: true,
        recvWindow: 60000
    });
    return binance;
}

function mapCandle(candle) {
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = candle;
    return {
        time: time,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: volume,
        closeTime: closeTime,
        assetVolume: assetVolume,
        trades: trades,
        buyBaseVolume: buyBaseVolume,
        buyAssetVolume: buyAssetVolume,
        ignored: ignored
    }
}

export async function getHistoryData(symbol, from, to, interval) {
    const binance = getBinance();
    const candles = await binance.candlesticks(symbol, interval, {
        startTime: from,
        endTime: to
    });
    const prices = candles.map(mapCandle);
    if (prices.length) {
        const first = prices[0];
        const last = prices[prices.length - 1];
        const change = first.close - last.close;
        const percent = `${change < 0 ? '+' : `-`}${((change / first.close) * 100).toFixed(2)}%`;
        return {
            prices,
            percent,
        }
    }

    return {
        prices: [],
        percent: '0'
    }
}

