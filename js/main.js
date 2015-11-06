var scriptsLoaded = 0;

document.addEventListener("DOMContentLoaded", function() {
  var css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "css/main.css"); 
  css.addEventListener("load", loadCount);
  document.querySelector("head").appendChild(css);
  var jq = document.createElement("script");
  jq.addEventListener("load", loadCount);
  jq.setAttribute("src","//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
  document.querySelector("head").appendChild(jq);
});

function buildWidget(container) {
    $.ajax({
        url: "https://api.forecast.io/forecast/07d46afa175283585f2ddf2b3d1dc17f/45.348391,-75.757045?units=ca",
        type: "GET",
        dataType: "jsonp"
    }).done(function(response) {
        displayWidget(response.currently,response.hourly,container); 
        console.log(response.currently,response.hourly,container);
    }).fail(function() {
        alert("An error occurred, please try again.");
    });
}

function displayWidget(current,hourly,container) {
    var today = new Date();
    $("<p>").text("Current Conditions for today, " + today.getMonth() + "/" + today.getDate()).appendTo(container);
    $("<i>").addClass("wi wi-forecast-io-" + current.icon).addClass("current").appendTo(container);
    $("<p>").text("Temperature " + current.temperature + " \xB0C").appendTo(container);
    $("<p>").text(current.summary).appendTo(container);
    var table = $("<table>");
    for (var i = 0; i < hourly.data.length; i++) {
        var hourlyData = hourly.data[i];
        var time = new Date(hourlyData.time * 1000);
        if (time.getDate() === today.getDate()) {
            time = time.getHours() + ":00";
            var tr = $("<tr>");
            $("<td>").text(time).appendTo(tr);
            $("<td>").text(hourlyData.humidity.toString().split(".")[1] + "%").appendTo(tr);
            if (hourlyData.cloudCover == 1) {
                $("<td>").text("100%").appendTo(tr);
            } else if (hourlyData.cloudCover == 0) {
                $("<td>").text("0%").appendTo(tr);
            } else {
                $("<td>").text(hourlyData.cloudCover.toString().split(".")[1] + "%").appendTo(tr);
            }
            $("<td>").text(hourlyData.temperature + " \xB0C").appendTo(tr);
            $("<td>").text(hourlyData.windSpeed + " km/h").appendTo(tr);
            $("<td>").html($("<i>").addClass("wi wi-forecast-io-" + hourlyData.icon)).appendTo(tr);
            $("<td>").text(hourlyData.summary).appendTo(tr);
            tr.appendTo(table);
        }
    }
    table.appendTo(container);
}

function loadCount() {
    scriptsLoaded++;
    if (scriptsLoaded === 2) {
        buildWidget(".weather-forecast");
    }
}