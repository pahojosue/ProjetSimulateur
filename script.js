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
    return fetch('./data.json')
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

async function CalculateAndFill(formData, HT)
{
            var CD = parseInt(Math.round(formData.Montant * 0.0025));
            var TVA = parseInt(Math.round((CD + HT) * 0.1925));
            var TTA = parseInt(Math.round(formData.Montant * 0.002));
            var QPBACM = parseInt(Math.round(HT * 0.3));
            var AccompteQPM = parseInt(Math.round(HT * 0.7 * 0.022));
            var QPM = parseInt(Math.round((HT * 0.7) - AccompteQPM));
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

            document.getElementById("result").innerText = TotalTTC;
}
async function GenerateResults()
{
    var formData = ReadFormData();
    var HT = await GetHT(formData.Montant, formData.Operateur, formData.Zone);
    CalculateAndFill(formData, HT);
}
    