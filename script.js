function UpdateTheSecondDropdown()
{
    var firstDropdown = document.getElementById("Operateur");
    var secondDropdown = document.getElementById("Zone");

    var selectedValue = firstDropdown.value;
    secondDropdown.innerHTML = "";

    var options = {
        RIA: ["V6 CEMAC", "V8 UEMOA","GUINEE_EQUATORIALE", "TX BENIN", "TW US ET CANADA", "TY FRANCE ET BELGIQUE", "VZ INTERNATIONAL"],
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
function GenerateResults()
{
    var formData = ReadFormData();
    if(formData.Operateur == "RIA")
    {
        if(formData.Zone == "V6 CEMAC")
        {
            if(formData.Montant >=0 && formData.Montant <= 10_000)
            {
                var HT = parseInt(939);
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

                document.getElementById("result").append(TotalTTC);
            }
        }
    }
}

