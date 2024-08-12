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
    if(selectedValue == "WESTERN_UNION")
    {
        var elements = document.getElementsByClassName("nomMoneygram");
        for(var i = 0; i < elements.length; i++)
            {
                elements[i].textContent = "WU";
            }
        document.getElementById("MontantAchanger").innerHTML = "5,000,000";
        ResetTable();
    }
    if(selectedValue != "WESTERN_UNION")
    {
        var elements = document.getElementsByClassName("nomMoneygram");
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].textContent = "MONEYGRAM";
        }
        document.getElementById("MontantAchanger").innerHTML = "1,000,000";
        ResetTable();
    }
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
    formData["Montant"] = parseInt(document.getElementById("Montant").value);
    return formData;
}
async function GetHT(amount, operateur, zone)
{
    console.log(operateur, typeof(operateur),amount);
    console.log(amount >=0 && amount <= 1_000_000);
    if((operateur === "RIA" ||  operateur === "MONEYGRAM") && (amount >=0 && amount <= 1_000_000))
    {
            return fetch('https://dataserver.glitch.me/data')
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
    else if((operateur === "WESTERN_UNION") && (amount >=0 && amount <= 5_000_000))
    {
            return fetch('https://dataserver.glitch.me/data')
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
            })
    }
    else
    {
        printNumberInRange();
        return 0;
    }
}
function PrintErrorMessage()
{
    var result = document.getElementById("error");
    result.style.display = "block";
    result.innerText = "La valeur entree n'est pas valide";
    result.style.backgroundColor = "red";
    result.style.fontWeight = "bold";
    result.style.color = "white";
    document.getElementById("Montant").value = "";

    setTimeout(() =>{
        result.style.display = "none";
    }, 3000);
}
function printNumberInRange()
{
    var result = document.getElementById("error");
    result.style.display = "block";
    result.innerText = "Entrez un monant dans l'intervale";
    result.style.backgroundColor = "red";
    result.style.backgroundColor = "red";
    result.style.fontWeight = "bold";
    result.style.color = "white";
    document.getElementById("Montant").value = "";

    setTimeout(() =>{
        result.style.display = "none";
    }, 3000);
}
async function CalculateAndFill(formData, HT)
{
            var CD = parseInt(Math.round(formData.Montant * 0.0025));
            var TVA = parseInt(Math.round((CD + HT) * 0.1925));
            var TTA = formData.Operateur == "MONEYGRAM" ? 0 : parseInt(Math.round(formData.Montant * 0.002));
            var QPBACM = parseInt(Math.round(HT * 0.3));
            var AccompteQPM = formData.Operateur == "RIA" ? parseInt(Math.round(HT * 0.7 * 0.022)) : parseInt(Math.round(HT * 0.8 * 0.022));
            var QPM = formData.Operateur == "RIA" ? parseInt(Math.round((HT * 0.7) - AccompteQPM)) : parseInt(Math.round((HT * 0.8) - AccompteQPM))
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
            result.innerText =`Montant A Payer(TTC): ${TotalTTC.toLocaleString('fr-FR',{
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
function checkValidNumber(input)
{
    var number = Number(input);
    return !isNaN(number); //if the value passed is a real number, isNaN will return false but the ! will make it true
}
async function GenerateResults()
{
    if(checkValidNumber(document.getElementById("Montant").value)){
        var formData = ReadFormData();
        var HT = await GetHT(formData.Montant, formData.Operateur, formData.Zone);
        if(HT != 0)
        {
            CalculateAndFill(formData, HT);
        }
    }
    else
    {
        PrintErrorMessage();
    }
}