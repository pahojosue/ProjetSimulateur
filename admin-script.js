let data;
//first function called
async function GetTable(){
    document.getElementById("JSON-table").innerHTML = "";
    var formData = ReadFormData();
    fetch('https://dataserver.glitch.me/data')
    .then(res =>res.json())
    .then(jsonData =>{
        data = jsonData;
        displayTable(data, formData.Operateur, formData.Zone);
        document.getElementById("SaveButton").disabled = false;
    })
}
//second function called
function ReadFormData()
{
    var formData = {};
    var Operateur = document.getElementById("Operateur");
    var Zone = document.getElementById("Zone");
    formData["Operateur"] = Operateur.options[Operateur.selectedIndex].text;
    formData["Zone"] = Zone.options[Zone.selectedIndex].text;
    return formData;
}
//fourth function called
function displayTable(data, operateur, zone)
{
    var table = document.getElementById("JSON-table");
    var keys = Object.keys(data[operateur][zone]);
    var values = Object.values(data[operateur][zone]);

    //creating the table header
    var headerRow = table.insertRow();
    var headerCell1 = headerRow.insertCell();
    headerCell1.innerHTML = "Ranges";
    headerCell1.style.backgroundColor = "gray";
    var headerCell2 = headerRow.insertCell();
    headerCell2.innerHTML = "Value";
    headerCell2.style.backgroundColor = "gray";

    //creating table rows
    keys.forEach((key, index) => {
        var row = table.insertRow();
        var cell1 = row.insertCell();
        cell1.innerHTML = key;
        var cell2 = row.insertCell();
        cell2.contentEditable = true;
        cell2.innerHTML = values[index];

        cell2.addEventListener('input', () =>{
            data[operateur][zone][key] = parseInt(cell2.innerHTML);
        });
    });
}
//third function called
function UpdateTheSecondDropdown()
{
    var firstDropdown = document.getElementById("Operateur");
    var secondDropdown = document.getElementById("Zone");

    var selectedValue = firstDropdown.value;
    secondDropdown.innerHTML = "";

    var options = {
        RIA: ["V6-CEMAC", "V8-UEMOA","GUINEE-EQUATORIALE", "TX-BENIN", "TW-US-ET-CANADA", "TY-FRANCE-ET-BELGIQUE", "VZ-INTERNATIONAL"],
        MONEYGRAM: ["VY-CANADA-US-UK", "V1-UEMOA", "VM-XAF-COUNTRIES", "VL-ROW", "XZ-NIGERIA", "XY-RDC"],
        WESTERN_UNION: ["Z4-UEMOA-ET-CEMAC", "Z5-RESTE-AFRIQUE", "Z6-EUROPE-USA-ET-CANADA", "Z7-RESTE_MONDE"]
    };

    if(options[selectedValue])
    {
        options[selectedValue].forEach(function(item)
    {
        var option = document.createElement("option");
        option.value = item;
        option.text = item;

        secondDropdown.appendChild(option);
    });
    }
}

function SaveData()
{
    const SaveButton = document.getElementById("SaveButton");
    if(!SaveButton.disabled){
    fetch('https://dataserver.glitch.me/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(updatedData => {
        console.log("Data saved successfully: ", updatedData);
        printing = document.getElementById("printing");
        printing.innerHTML = "Data saved successfully";
        printing.style.backgroundColor = "#76f216";
        printing.style.width = "520px";
    })
    .catch(error =>{
        printing = document.createElement("div").style = {
            backgroundColor : "red",
        }
        printing.innerText = "Error saving data";
        console.log("Error saving data ", error);
    });
    }
}