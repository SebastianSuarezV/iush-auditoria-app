$(function () {




    getQuestions(1);
    $("#rules-content").on('change', function () {
        getQuestions(this.value);
    });

    /**
     * Clear tables dummy info
     */
    $("#rules-content").empty();
    $("#companies-content").empty();

    $.getJSON("http://https://iush-auditoria-app.herokuapp.com:3000/api/normas", function (data) {
        $("#rules-content").append(generateTableContent(data));
    });

    $.getJSON("http://https://iush-auditoria-app.herokuapp.com:3000/api/empresas", function (data) {
        $("#companies-content").append(generateTableContent(data));
    });



});

function generateTableContent(data) {

    var items = [];

    $.each(data, function (key, val) {
        var rowContent = "<option value='" + val.ID + "'>" + val.nombre + "</option>";
        items.push(rowContent);
    });
    return items;

}

function getQuestions(id) {

    $("#questions-content").empty();
    $.getJSON("http://https://iush-auditoria-app.herokuapp.com:3000/api/preguntas?id=" + id, function (data) {

        var items = [];
        $.each(data, function (key, val) {

            var rowContent = "";
            rowContent += "<td>";
            rowContent += val.texto;
            rowContent += "</td>";
            rowContent += "<td>";
            rowContent += "<select class='form-control' name='preguntas'>";
            rowContent += "<option value='" + val.ID +"-0'>N/A</option>";
            rowContent += "<option value='" + val.ID +"-1'>No</option>";
            rowContent += "<option value='" + val.ID +"-2'>Si</option>";
            rowContent += "</select>";
            rowContent += "</td>";

            items.push("<tr>" + rowContent + "</tr>");
        });
        $("#questions-content").append(items);
    });
}