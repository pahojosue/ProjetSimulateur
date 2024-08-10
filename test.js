const fs = require('fs')

fs.readFile("./data.json", "utf-8", (err, jsonString) =>{
        const data = JSON.parse(jsonString);
        for(let key in data.RIA.V6CEMAC)
        {
            var pos = parseInt(key.indexOf("A"));
            if(amount <= key.slice(pos+1, key.length))
            {
                HT = data.RIA.V6CEMAC[key];
                break;
            }
        }
})