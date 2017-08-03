var fs = require('fs');
var path = require("path");
var xml2js = require('xml2js');
var builder = new xml2js.Builder();  // JSON->xml
var parser = new xml2js.Parser();   //xml -> json


var data = fs.readFileSync(".\\walmarts.xml", "utf-8");
var obj = {},
    series = [],
    timeline = [];
xml2js.parseString(data, { explicitArray: false }, function (err, json) {
    if (err) {
        throw err;
    }
    var daeNodes = json.walmarts.walmart;

    for (var i = 0; i < daeNodes.length; i++) {
        var year = parseFloat(daeNodes[i].opening_date),
            name = daeNodes[i].name,
            lon = parseFloat(daeNodes[i].longitude),
            lat = parseFloat(daeNodes[i].latitude);

        if (timeline.indexOf(year) < 0) {
            timeline.push(year);
            series[timeline.indexOf(year)] = [];
        }
        series[timeline.indexOf(year)].push({
            name: name,
            value: [lon, lat]
        });
    }

    for(var i = 0,length = series.length; i < length; i++) {
        var t = series[i + 1];
        series[i + 1] = series[i].concat(t);
    }
    obj["series"] = series;
    obj["timeline"] = timeline;
    
    fs.writeFileSync('./walmarts_min.json', JSON.stringify(obj), 'utf8');
});