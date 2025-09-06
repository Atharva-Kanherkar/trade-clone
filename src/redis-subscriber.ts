import {Redis} from "ioredis";


const prices :  Record<string, {price : number, decimal : number}>  = {};


const redis = new Redis();

redis.subscribe("price_updates", (err, count)=>{
     if(err){
        console.log("This is the message that we recieved that caused the error", err.message);
     }
     else{
            console.log(`Subscribed successfully Listening to ${count} channel(s).`);

     }
})

redis.on("message", (channel : string, message : string)=>{
      if (channel !== "price_updates") return;

    const price_updates =  JSON.parse(message);
      for(const update of price_updates){
                  const symbol = update.asset; 
         const price = update.price;
         const decimal = update.decimal;
         prices[symbol] = {price, decimal}
      }

          console.log("Received and updated prices:", prices);
    

})