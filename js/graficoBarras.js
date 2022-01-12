
google.charts.load("current", {
    packages: ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var ratData = [
        ['Rating', 'Títulos']
    ]

    var jsonResponse = $.ajax({
        type: "GET",
        url: "http://192.168.160.58/netflix/api/Ratings/",
        async: false
    }).responseText;

    var jsonResponse = JSON.parse(jsonResponse)

    jsonResponse.forEach(e => {
        var tmp = []
        tmp[0] = e.Code
        tmp[1] = e.Titles
        ratData.push(tmp)
    });

    var data = google.visualization.arrayToDataTable(ratData);





    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1]);

    var options = {
        width: 600,
        height: 400,
        bar: {
            groupWidth: "95%"
        },
        legend: {
            position: "none"
        },
        backgroundColor: {
            fill: 'transparent'
        },
        colors: ['#E50914'],
        hAxis: {
            textStyle: {
                color: '#FFF'
            }
        },
        vAxis: {
            textStyle: {
                color: '#FFF'
            }
        }



    };
    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
    chart.draw(view, options);
}