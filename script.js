function UpdateTheSecondDropdown()
{
    var firstDropdown = document.getElementById("Operateur");
    var secondDropdown = document.getElementById("Zone");

    var selectedValue = firstDropdown.value;
    secondDropdown.innerHTML = "";

    var options = {
        RIA: ["V6 CEMAC", "V8 UEMOA","GUINEE EQUATORIALE", "TX BENIN", "TW US ET CANADA", "TY FRANCE ET BELGIQUE", "VZ INTERNATIONAL"],
        MONEYGRAM: [],
        WESTERN_UNION: ["h"]
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
    }
    if(selectedValue != "WESTERN_UNION")
    {
        var elements = document.getElementsByClassName("nomMoneygram");
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].textContent = "MONEYGRAM";
        }
        document.getElementById("MontantAchanger").innerHTML = "1,000,000"
    }
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
async function GetHT(amount)
{
    return fetch('./data.json')
            .then(res => res.json())
            .then(data => {
                for(let key in data.RIA.V6CEMAC)
                    {
                        var pos = parseInt(key.indexOf("A"));
                        if(amount <= key.slice(pos+1, key.length))
                        {
                            var HT = parseInt(data.RIA.V6CEMAC[key]);                            
                            return HT;
                        }
                    }
                    return HT;
            })
}
async function GenerateResults()
{
    var formData = ReadFormData();
    if(formData.Operateur == "RIA")
    {
        if(formData.Zone == "V6 CEMAC")
        {    
            var HT = await GetHT(formData.Montant);
            console.log(HT);
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
        }
    }
    