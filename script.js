//first function
function UpdateTheSecondDropdown()
{
    var firstDropdown = document.getElementById("Operateur");
    var secondDropdown = document.getElementById("Zone");
    var input = document.getElementById("Montant");

    var selectedValue = firstDropdown.value;
    secondDropdown.innerHTML = "";

    var options = {
        RIA: ["V6-CEMAC", "V8-UEMOA","GUINEE-EQUATORIALE", "TX-BENIN", "TW-US-ET-CANADA", "TY-FRANCE-ET-BELGIQUE", "VZ-INTERNATIONAL"],
        MONEYGRAM: ["VY-CANADA-US-UK", "V1-UEMOA", "VM-XAF-COUNTRIES", "VL-ROW", "XZ-NIGERIA", "XY-RDC"],
        WESTERN_UNION: ["Z4-UEMOA-ET-CEMAC", "Z5-RESTE-AFRIQUE", "Z6-EUROPE-USA-ET-CANADA", "Z7-RESTE_MONDE"]
    };

    if(options[selectedValue])//if the selected value is one of the options: RIA, etc
    {
        options[selectedValue].forEach(function(item)
        {
            var option = document.createElement("option");
            option.value = item;
            option.text = item;

            secondDropdown.appendChild(option);
        });
    }
    if(selectedValue == "WESTERN_UNION")
    {
        var elements = document.getElementsByClassName("nomMoneygram");
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].textContent = "WU";
        }
        document.getElementById("MontantAchanger").innerHTML = "5,000,000";
        ResetTable();
        input.disabled = false;
        document.getElementById("WesternUnionPart").innerHTML = "Actual Fee";
    }
    if(selectedValue == "")
    {
        input.disabled = true;
        ResetTable();
        document.getElementById("MontantAchanger").innerHTML = "";
    }
    if(selectedValue != "WESTERN_UNION" && selectedValue != "")
    {
        var elements = document.getElementsByClassName("nomMoneygram");
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].textContent = "MONEYGRAM";
        }
        document.getElementById("MontantAchanger").innerHTML = "1,000,000";
        ResetTable();
        input.disabled = false;
        document.getElementById("WesternUnionPart").innerHTML = "HT";
    }
    if(selectedValue == "MONEYGRAM")
    {
        document.getElementById("WesternUnionPart").innerHTML = "Actual Fee";
    }
    document.getElementById("Zone").addEventListener('change', () =>{
        ResetTable();
    });
}
function ResetTable()
{
    document.getElementById("HT-value").innerText = 0;
    document.getElementById("CD-value").innerText = 0;
    document.getElementById("TVA-value").innerText = 0;
    document.getElementById("TTA-value").innerText = 0;
    document.getElementById("QPBACM-value").innerText = 0;
    document.getElementById("AccompteQPM-value").innerText = 0;
    document.getElementById("QPM-value").innerText = 0;
    document.getElementById("TotalQPM-value").innerText = 0;
    document.getElementById("result").innerText = "";
    document.getElementById("Montant").value = "";
}

function ReadFormData()
{
    var formData = {};
    var Operateur = document.getElementById("Operateur");
    var Zone = document.getElementById("Zone");
    formData["Operateur"] = Operateur.options[Operateur.selectedIndex].text;
    formData["Zone"] = Zone.options[Zone.selectedIndex].text;
    formData["Montant"] = document.getElementById("Montant").value;
    formData["Montant"] = parseInt(formData["Montant"].replaceAll(" ", "").replaceAll(",", ""));
    return formData;
}

async function GetHT(amount, operateur, zone)
{
    return fetch('http://localhost:3000/data')
    .then(res => res.json())
    .then(data => {
        for(let key in data[operateur][zone])
            {
                var pos = parseInt(key.indexOf("A"));
                if(amount <= key.slice(pos+1, key.length))
                {
                    var HT = parseInt(data[operateur][zone][key]);
                    return HT;
                }
            }
            return HT;
    });
}
function printErrorInValue()
{
    var result = document.getElementById("error");
    result.style.display = "block";
    result.innerText = "La valeur entrée n'est pas valide";
    result.style.backgroundColor = "red";
    result.style.fontWeight = "bold";
    result.style.color = "white";
    document.getElementById("Montant").value = "";

    setTimeout(() =>{
        result.style.display = "none";
    }, 3000);
    ResetTable();
}
function printErrorInRange(max)
{
    var result = document.getElementById("error");
    result.style.display = "block";
    result.innerText = `Le montant de la transaction doit être dans l'intervale 0 à ${max.toLocaleString('fr-FR',{
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0,
    })}`;
    result.style.backgroundColor = "red";
    result.style.fontWeight = "bold";
    result.style.color = "white";
    document.getElementById("Montant").value = "";

    setTimeout(() =>{
        result.style.display = "none";
    }, 3000);
    ResetTable();
}
function printErrorSelection()
{
    var result = document.getElementById("error");
    result.style.display = "block";
    result.innerText = "Veuillez sélectionner une option";
    result.style.backgroundColor = "red";
    result.style.fontWeight = "bold";
    result.style.color = "white";

    setTimeout(() => {
        result.style.display = "none";
    }, 3000);
    ResetTable();
}
async function CalculateValuesFillTable(formData, HT)
{
    document.getElementById("loader").style.visibility = "visible";
    setTimeout(() =>{
        document.getElementById("loader").style.visibility = "hidden";
    }, 200);
    var CD = parseInt(Math.round(formData.Montant * 0.0025));
    var TVA = parseInt(Math.round(((formData.Montant * 0.0025) + HT) * 0.1925));
    var TTA = formData.Operateur == "MONEYGRAM" ? 0 : parseInt(Math.round(formData.Montant * 0.002));
    var QPBACM = formData.Operateur == "RIA" ? parseInt(Math.round(HT * 0.3)) : parseInt(Math.round(HT * 0.2));
    var AccompteQPM = formData.Operateur == "RIA" ? parseInt(Math.round(HT * 0.7 * 0.022)) : parseInt(Math.round(HT * 0.8 * 0.022));
    var QPM = formData.Operateur == "RIA" ? parseInt(Math.round((HT * 0.7) - AccompteQPM)) : parseInt(Math.round((HT * 0.8) - AccompteQPM));
    var TotalQPM = parseInt(Math.round(QPM + AccompteQPM));

    var TotalTTC = formData.Montant + HT + CD + TVA + TTA;

    document.getElementById("HT-value").innerText = HT;
    document.getElementById("CD-value").innerText = CD;
    document.getElementById("TVA-value").innerText = TVA;
    document.getElementById("TTA-value").innerText = TTA;
    document.getElementById("QPBACM-value").innerText = QPBACM;
    document.getElementById("AccompteQPM-value").innerText = AccompteQPM;
    document.getElementById("QPM-value").innerText = QPM;
    document.getElementById("TotalQPM-value").innerText = TotalQPM;

    var result = document.getElementById("result");
    result.innerText =`Montant À Payer (TTC) : ${TotalTTC.toLocaleString('fr-FR',{
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0,
    })}`;
    result.style.fontSize = "20px";
    result.style.backgroundColor = "#61d30d";
    result.style.width = "550px";
    result.style.fontWeight = "bold";
    result.style.color = "white";
}
function checkNumberIsValid(input)
{
    var number = Number(input);
    return !isNaN(number); //if the value passed is a real number, isNaN will return false but the ! will make it true
}
async function GenerateResults()
{
    if(document.getElementById("Montant").disabled == true)
    {
        printErrorSelection();
    }
    else if(checkNumberIsValid(document.getElementById("Montant").value.replaceAll(" ", "").replaceAll(",", ""))){
        var formData = ReadFormData();
        if(formData.Operateur == "WESTERN_UNION")
            {
                if(formData.Montant > 5_000_000)
                {
                    printErrorInRange(5_000_000);
                }
                else
                {
                    var HT = await GetHT(formData.Montant, formData.Operateur, formData.Zone);
                    if(HT != 0)
                    {
                        CalculateValuesFillTable(formData, HT);
                    }
                }
            }
            else
            {
                if(formData.Montant >=0 && formData.Montant <= 1_000_000)
                {
                    var HT = await GetHT(formData.Montant, formData.Operateur, formData.Zone);
                    if(HT != 0)
                    {
                        CalculateValuesFillTable(formData, HT);
                    }
                }
                else
                {
                    printErrorInRange(1_000_000);
                }
            }
    }
    else
    {
        printErrorInValue();
    }
}