let data;
//first function called
async function GetTable(){
    document.getElementById("JSON-table").innerHTML = "";
    var formData = ReadFormData();
    fetch('./data.json')
    .then(res =>res.json())
    .then(jsonData =>{
        data = jsonData;
        displayTable(data, formData.Operateur, formData.Zone);
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
    headerCell1.innerHTML = "key";
    var headerCell2 = headerRow.insertCell();
    headerCell2.innerHTML = "Value";

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
        RIA: ["V6CEMAC", "V8UEMOA","GUINEEEQUATORIALE", "TXBENIN", "TWUSETCANADA", "TYFRANCEETBELGIQUE", "VZINTERNATIONAL"],
        MONEYGRAM: [],
        WESTERN_UNION: []
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
    fetch('./data.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(updatedData => {
        console.log("Data saved successfully: ", updatedData);
    })
    .catch(error =>
        console.error('Error saving data: ', error)
    );
}