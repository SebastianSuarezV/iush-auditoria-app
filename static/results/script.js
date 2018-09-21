$(function() {
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
    
    var canvas = document.getElementById("myChart");
    var ctx = canvas.getContext('2d');
    var data = [];
    var yesPercentage = "Si: ";
    var noPercentage = "No: ";
    var naPercentage = "N/A: ";
    
    canvas.width = 100; // in pixels
    canvas.height = 40; // in pixels
    
    
    
    var auditoria = getUrlParameter('auditoria');
    
    
    $.getJSON("http://https://iush-auditoria-app.herokuapp.com:3000/api/auditorias/" + auditoria, function (result) {
        console.log(result);
        $("#audit-info").append("Resultados en <strong>" + result[0].norma + "</strong> para <strong>" + result[0].empresa + "</strong>. Auditado por <strong>" + result[0].auditor + "</strong>");
        $("#audit-info").append("</br><strong>Auditado: </strong>" + result[0].auditado);
        $("#audit-info").append("</br><strong>Objetivo de la auditoria: </strong>" + result[0].objetivo);
        console.log(result);
        $("#audit-info").append("</br> <strong>Porcentaje de cumplimiento:</strong> <span style='font-size:25px'>" + result[0].si / (result[0].si + result[0].no + result[0].na) * 100 + "%</span>");
        yesPercentage += result[0].si / (result[0].si + result[0].no + result[0].na) * 100 + "%";
        noPercentage += result[0].no / (result[0].si + result[0].no + result[0].na) * 100 + "%";
        naPercentage += result[0].na / (result[0].si + result[0].no + result[0].na) * 100 + "%";
        data.push(result[0].si);
        data.push(result[0].no);
        data.push(result[0].na);

        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [yesPercentage, noPercentage, naPercentage],
                datasets: [{
                    label: 'Resultados',
                    data: data,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                    ]
                }]
            }
        });

    });
    
});