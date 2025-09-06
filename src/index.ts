 import WebSocket  from "ws";
import {Redis} from "ioredis";


const redis = new Redis();
const ws = new WebSocket("wss://ws.backpack.exchange/");
 const latestPrices: Record<string, { price: number, decimal: number }> = {};


ws.on("open", () => {
  console.log("Connected to server ✅");
   ws.send(JSON.stringify({
  method: "SUBSCRIBE",
  params: [
    "bookTicker.BTC_USDC",
    "bookTicker.ETH_USDC",
    "bookTicker.SOL_USDC"
  ],
  id: 1
}));
  
});


ws.on("message", (rawData)=>{
const receivedData = JSON.parse(rawData.toString());
const symbol = receivedData.data.s;
  const bestAsk = parseFloat(receivedData.data.a);
  const bestBid = parseFloat(receivedData.data.b);

  const price = (bestAsk + bestBid)/2;

  latestPrices[symbol] = { price : price, decimal : 1};
   

})


setInterval(()=>{
    if(Object.keys.length === 0
    ) return;
   const priceUpdates = Object.entries(latestPrices).map(([asset, data]) => ({
    asset : asset.slice(0,3),
    price: data.price,
    decimal: data.decimal
  }));

  redis.publish("price_updates", JSON.stringify(priceUpdates));
console.log("Published to Redis:", priceUpdates);


},100)