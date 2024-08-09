const fs = require('fs')

fs.readFile("./data.json", "utf-8", (err, jsonString) =>{
    if(err){
        console.log(err);
    }
    else{
        const data = JSON.parse(jsonString);
        for(let key in data.RIA.V6CEMAC)
        {
            var pos = parseInt(key.indexOf("A"));
            var amount = parseInt(12000);
            if(amount <= key.slice(pos+1, key.length))
            {
                console.log(data.RIA.V6CEMAC[key]);
                break;
            }
        }
    }
})