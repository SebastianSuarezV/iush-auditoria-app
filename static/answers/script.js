$(function () {

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    var auditoria = getUrlParameter('auditoria');


    $("#questions-content").empty();

    $.getJSON("https://iush-auditoria-app.herokuapp.com/api/respuestas/" + auditoria, function (data) {
        $("#questions-content").append(generateTableContent(data));
    });



});

function generateTableContent(data) {

    var items = [];

    $.each(data, function (key, val) {
        var rowContent = "";
        $.each(val, function (k, v) {
            if (k != "ID") {
                
                rowContent += "<td>" + v + "</td>";
            }
        });
        
        
        items.push("<tr>" + rowContent + "</tr>");
    });

    return items;

}