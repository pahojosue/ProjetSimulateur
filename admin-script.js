let data;
let er;
let Operator;
let Place;
//first function called
async function GetTable(){
    document.getElementById("loader").style.visibility = "visible";
    setTimeout(() =>{
        document.getElementById("loader").style.visibility = "hidden";
    }, 200);
    document.getElementById("JSON-table").innerHTML = "";
    document.getElementById("JSON-table2").innerHTML= "";
    document.getElementById("Intervales").innerHTML = "";
    var formData = ReadFormData();
    Operator = formData.Operateur;
    Place = formData.Zone;
    fetch('http://localhost:3000/data')
    .then(res =>res.json())
    .then(jsonData =>{
        data = jsonData;
        displayTable(data, formData.Operateur, formData.Zone);
        document.getElementById("toggler").style.visibility = "visible";
        UpdatingTable(data);
        UpValue();
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
    var table2 = document.getElementById("JSON-table2");
    var keys = Object.keys(data[operateur][zone]);
    var values = Object.values(data[operateur][zone]);
    //creating the table header
    var headerRow = table.insertRow();
    var headerCell1 = headerRow.insertCell();
    headerCell1.innerHTML = "De (FCFA)";
    headerCell1.style.backgroundColor = "blue";
    headerCell1.style.color = "white";
    headerCell1.style.fontWeight = "bold";
    var headerCell2 = headerRow.insertCell();
    headerCell2.innerHTML = "&Agrave; (FCFA)";
    headerCell2.style.backgroundColor = "blue";
    headerCell2.style.color = "white";
    headerCell2.style.fontWeight = "bold";
    var headerCell3 = headerRow.insertCell();
    headerCell3.innerHTML = "valeur";
    headerCell3.style.backgroundColor = "blue";
    headerCell3.style.color = "white";
    headerCell3.style.fontWeight = "bold";
    //
    var headerRow = table2.insertRow();
    var headerCell1 = headerRow.insertCell();
    headerCell1.innerHTML = "De (FCFA)";
    headerCell1.style.backgroundColor = "blue";
    headerCell1.style.color = "white";
    headerCell1.style.fontWeight = "bold";
    var headerCell2 = headerRow.insertCell();
    headerCell2.innerHTML = "&Agrave; (FCFA)";
    headerCell2.style.backgroundColor = "blue";
    headerCell2.style.color = "white";
    headerCell2.style.fontWeight = "bold";
    var headerCell3 = headerRow.insertCell();
    headerCell3.innerHTML = "valeur";
    headerCell3.style.backgroundColor = "blue";
    headerCell3.style.color = "white";
    headerCell3.style.fontWeight = "bold";
    document.getElementById("JSON-table2").style.visibility = "hidden";

    var count = 0;
    //creating table rows
    keys.forEach((key, index) => {
        if(count < (parseInt(keys.length)/2))
        {
            var row = table.insertRow();

            var posDe = parseInt(key.indexOf("e"));
            var posA = parseInt(key.indexOf("A"));

            var cell1 = row.insertCell();
            cell1.style.backgroundColor = "#aeb6bf";
            c1 = parseInt(key.slice(posDe+1, posA));
            cell1.innerText = c1.toLocaleString('fr-FR', {maximumFractionDigits: 0})
            var cell2 = row.insertCell();
            cell2.style.backgroundColor = "#aeb6bf";
            c2 = parseInt(key.slice(posA+1, key.length));
            cell2.innerText = c2.toLocaleString('fr-FR', {maximumFractionDigits: 0})
            var cell3 = row.insertCell();
            cell3.innerHTML = values[index];
            cell3.style.backgroundColor = "#aeb6bf";
            count++;
        }
        else
        {
            document.getElementById("JSON-table2").style.visibility = "visible";
            var row2 = table2.insertRow();

            var posDe = parseInt(key.indexOf("e"));
            var posA = parseInt(key.indexOf("A"));

            var cell4 = row2.insertCell();
            cell4.style.backgroundColor = "#aeb6bf";
            c4 = parseInt(key.slice(posDe+1, posA));
            cell4.innerText = c4.toLocaleString('fr-FR', {maximumFractionDigits: 0})
            var cell5 = row2.insertCell();
            cell5.style.backgroundColor = "#aeb6bf";
            c5 = parseInt(key.slice(posA+1, key.length));
            cell5.innerText = c5.toLocaleString('fr-FR', {maximumFractionDigits: 0})
            var cell6 = row2.insertCell();
            cell6.style.backgroundColor = "#aeb6bf";
            cell6.innerHTML = values[index];
            count++;
        }
        
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
        GetTable();
    })
    .catch(error =>{
        console.log("Error saving data ", error);
    });
    }
}
function togglePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('show');
}

function UpdatingTable(data)
{
    var keys = Object.keys(data[Operator][Place]);
    keys.forEach((key) => {
        var posDe = key.indexOf("e");
        var posA = key.indexOf("A");
        var first = parseInt(key.slice(posDe+1, posA));
        var second = parseInt(key.slice(posA+1, key.length));
        var options = document.createElement("option");
        options.value = key;
        options.text = first.toLocaleString('fr-FR', {maximumFractionDigits: 0})+" - "+second.toLocaleString('fr-FR', {maximumFractionDigits: 0});
        document.getElementById("Intervales").appendChild(options);
    })
    document.getElementById("valeur").value = "";
}
function SaveValue()
{
    if(document.getElementById("valeur").value == "")
    {
        PrintFailure();
    }
    else
    {
        data[Operator][Place][document.getElementById("Intervales").value] = document.getElementById("valeur").value;
        SaveData();
        
    }
}
function UpValue()
{
    document.getElementById("valeur").value = data[Operator][Place][document.getElementById("Intervales").value];
}