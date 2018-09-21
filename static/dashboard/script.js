

$(function () {


    /**
     * Clear tables dummy info
     */
    $("#rules-content").empty();
    $("#companies-content").empty();
    $("#audits-content").empty();

    $.getJSON("http://https://iush-auditoria-app.herokuapp.com:3000/api/normas", function (data) {
        $("#rules-content").append(generateTableContent(data));
    });

    $.getJSON("http://https://iush-auditoria-app.herokuapp.com:3000/api/empresas", function (data) {
        $("#companies-content").append(generateTableContent(data));
    });

    $.getJSON("http://https://iush-auditoria-app.herokuapp.com:3000/api/auditorias", function (data) {
        $("#audits-content").append(generateTableContent(data));
    });

});

function generateTableContent(data) {

    var items = [];

    $.each(data, function (key, val) {
        var rowContent = "";
        $.each(val, function (k, v) {
            if (k != "ID") {
                if(k == "fecha") {
                    v = v.slice(0,10);
                }

                rowContent += "<td>" + v + "</td>";
            }
        });
        if(val.auditor != undefined) {
            rowContent += "<td><a class='btn btn-primary' href='http://https://iush-auditoria-app.herokuapp.com:3000/resultados?auditoria=" + val.ID + "'>Ver resultados de la auditoria</a></td>";
        }
        
        
        items.push("<tr>" + rowContent + "</tr>");
    });

    return items;

}