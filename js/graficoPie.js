google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {


    var catData = [
        ['Categoria', 'Títulos']
    ]
    var jsonResponse = $.ajax({
        type: "GET",
        url: "http://192.168.160.58/netflix/api/Categories?page=1&pagesize=10",
        async: false
    }).responseText;

    var jsonResponse = JSON.parse(jsonResponse).Categories

    jsonResponse.forEach(e => {
        var tmp = []
        tmp[0] = e.Name
        tmp[1] = e.Titles
        catData.push(tmp)
    });

    var data = google.visualization.arrayToDataTable(catData);



    var options = {
        backgroundColor: {
            fill: 'transparent'
        },
        is3D: true,
        legend: {
            textStyle: {
                color: '#FFF'
            }
        },
        slices: {
            0: {
                color: '#d80032'
            },
            1: {
                color: '#8d99ae'
            },
            2: {
                color: '#087e8b'
            },
            3: {
                color: '#ffbc42'
            },
            4: {
                color: '#73d2de'
            },
            5: {
                color: '#55a630'
            },
            6: {
                color: '#1f0322'
            },
            7: {
                color: '#ff5714'
            },
            8: {
                color: '#f4a698'
            },
            9: {
                color: '#631a86'
            }
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}


