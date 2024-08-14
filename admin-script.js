let data;
let er;
//first function called
async function GetTable(){
    document.getElementById("loader").style.visibility = "visible";
    setTimeout(() =>{
        document.getElementById("loader").style.visibility = "hidden";
    }, 200);
    document.getElementById("JSON-table").innerHTML = "";
    var formData = ReadFormData();
    fetch('http://localhost:3000/data')
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
    headerCell1.innerHTML = "De";
    headerCell1.style.backgroundColor = "blue";
    headerCell1.style.color = "white";
    headerCell1.style.fontWeight = "bold";
    var headerCell2 = headerRow.insertCell();
    headerCell2.innerHTML = "&Agrave;";
    headerCell2.style.backgroundColor = "blue";
    headerCell2.style.color = "white";
    headerCell2.style.fontWeight = "bold";
    var headerCell3 = headerRow.insertCell();
    headerCell3.innerHTML = "valeur";
    headerCell3.style.backgroundColor = "blue";
    headerCell3.style.color = "white";
    headerCell3.style.fontWeight = "bold";

    //creating table rows
    keys.forEach((key, index) => {
        var row = table.insertRow();

        var posDe = parseInt(key.indexOf("e"));
        var posA = parseInt(key.indexOf("A"));

        var cell1 = row.insertCell();
        cell1.innerHTML = key.slice(posDe+1, posA);
        var cell2 = row.insertCell();
        cell2.innerText = key.slice(posA+1, key.length);
        var cell3 = row.insertCell();
        cell3.contentEditable = true;
        cell3.innerHTML = values[index];
        cell3.addEventListener('input', () =>{
                data[operateur][zone][key] = cell3.innerHTML;
        });
    });
}
function checkValidNumber(input)
{
    var number = Number(input);
    return !isNaN(number); //if the value passed is a real number, isNaN will return false but the ! will make it true
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
function PrintSuccess()
{
    printing = document.getElementById("printing");
    printing.innerHTML = "Data saved successfully";
    printing.style.backgroundColor = "#76f216";
    printing.style.width = "520px";
    printing.style.display = "block";

    setTimeout(() => {
        printing.style.display = "none";
    }, 1500);
}
function PrintFailure()
{
    printing = document.getElementById("printing");
    printing.innerHTML = "Error Saving Data";
    printing.style.backgroundColor = "red";
    printing.style.width = "520px";
    printing.style.display = "block";

    setTimeout(() => {
        printing.style.display = "none";
    }, 1500);
}
function TestData()
{
    var count = 0;
    var formData = ReadFormData();
    for(let value in data[formData.Operateur][formData.Zone])
    {
        if((!checkValidNumber(data[formData.Operateur][formData.Zone][value])) || (parseInt(data[formData.Operateur][formData.Zone][value]) < 0))
        {
            count ++;
        }
        else
        {
            data[formData.Operateur][formData.Zone][value] = parseInt(data[formData.Operateur][formData.Zone][value]);
        }
    }
    return count;
}
function SaveData()
{
    var count = TestData();
    const SaveButton = document.getElementById("SaveButton");
    if(count != 0)
    {
        PrintFailure();
    }
    else if(!SaveButton.disabled){
    fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(updatedData => {
        console.log("Data saved successfully: ", updatedData);
        PrintSuccess();
    })
    .catch(error =>{
        console.log("Error saving data ", error);
    });
    }
}