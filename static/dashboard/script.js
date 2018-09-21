

$(function () {


    /**
     * Clear tables dummy info
     */
    $("#rules-content").empty();
    $("#companies-content").empty();
    $("#audits-content").empty();

    $.getJSON("https://iush-auditoria-app.herokuapp.comapi/normas", function (data) {
        $("#rules-content").append(generateTableContent(data));
    });

    $.getJSON("https://iush-auditoria-app.herokuapp.comapi/empresas", function (data) {
        $("#companies-content").append(generateTableContent(data));
    });

    $.getJSON("https://iush-auditoria-app.herokuapp.comapi/auditorias", function (data) {
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
            rowContent += "<td><a class='btn btn-primary' href='https://iush-auditoria-app.herokuapp.comresultados?auditoria=" + val.ID + "'>Ver resultados de la auditoria</a></td>";
        }
        
        
        items.push("<tr>" + rowContent + "</tr>");
    });

    return items;

}