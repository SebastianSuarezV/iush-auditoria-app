

$(function () {


    /**
     * Clear tables dummy info
     */
    $("#rules-content").empty();
    $("#companies-content").empty();
    $("#audits-content").empty();

    $.getJSON("https://iush-auditoria-app.herokuapp.com/api/normas", function (data) {
        $("#rules-content").append(generateTableContent(data));
    });

    $.getJSON("https://iush-auditoria-app.herokuapp.com/api/empresas", function (data) {
        $("#companies-content").append(generateTableContent(data));
    });

    $.getJSON("https://iush-auditoria-app.herokuapp.com/api/auditorias", function (data) {
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
            rowContent += "<td><a class='btn btn-primary' href='https://iush-auditoria-app.herokuapp.com/resultados?auditoria=" + val.ID + "'>Ver</a></td>";
            rowContent += "<td><a class='btn btn-primary' href='https://iush-auditoria-app.herokuapp.com/respuestas?auditoria=" + val.ID + "'>Ver</a></td>";
        }
        
        
        items.push("<tr>" + rowContent + "</tr>");
    });

    return items;

}