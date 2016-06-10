"use strict";

var width = 960,
    height = 500,
    cellSize = 25; // cell size

var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
var shift_up = cellSize * 3;

var day = function () {
  var func = d3.time.format("%w");
  return function (d) {
    var day = func(d) - 1;
    return day >= 0 ? day : 6;
  };
}(),
    // day of the week
day_of_month = d3.time.format("%e"); // day of the month
day_of_year = d3.time.format("%j");
week = function week(d) {
  return d3.time.mondayOfYear(d);
}, // week number of the year
month = d3.time.format("%m"), // month number
year = d3.time.format("%Y"), percent = d3.format(".1%"), format = d3.time.format("%Y-%m-%d");

var color = d3.scale.quantize().domain([-.05, .05]).range(d3.range(11).map(function (d) {
  return "q" + d + "-11";
}));

var svg = d3.select("#chart").selectAll("svg").data(d3.range(2016, 2017)).enter().append("svg").attr("width", width).attr("height", height).attr("class", "RdYlGn").append("g");

var rect = svg.selectAll(".day").data(function (d) {
  return d3.time.days(new Date(d, 5, 1), new Date(d + 1, 0, 1));
}).enter().append("rect").attr("class", "day").attr("width", cellSize).attr("height", cellSize).attr("x", function (d) {
  var month_padding = 1.2 * cellSize * 7 * ((month(d) - 6) % no_months_in_a_row);
  return day(d) * cellSize + month_padding;
}).attr("y", function (d) {
  var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
  var row_level = Math.ceil((month(d) - 5) / no_months_in_a_row);
  return week_diff * cellSize + row_level * cellSize * 8 - cellSize / 2 - shift_up;
}).attr('class', function (d, i) {
  return 'neighbour neighbour-' + (week(d) - 2) % 4;
}).datum(format);

var month_titles = svg.selectAll(".month-title") // Jan, Feb, Mar and the whatnot
.data(function (d) {
  return d3.time.months(new Date(d, 5, 1), new Date(d + 1, 0, 1));
}).enter().append("text").text(monthTitle).attr("x", function (d, i) {
  var month_padding = 1.2 * cellSize * 7 * ((month(d) - 6) % no_months_in_a_row);
  return month_padding + 60;
}).attr("y", function (d, i) {
  var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
  var row_level = Math.ceil((month(d) - 5) / no_months_in_a_row);
  return week_diff * cellSize + row_level * cellSize * 8 - cellSize - shift_up;
}).attr("class", "month-title").attr("d", monthTitle);

var mondayLabels = svg.selectAll('.monday-label').data(function (d) {
  return d3.time.months(new Date(d, 5, 1), new Date(d + 1, 0, 1));
}).enter().append('text').text('mon').attr('x', function (d) {
  return 1.2 * cellSize * 7 * ((month(d) - 6) % no_months_in_a_row);
}).attr('y', function (d) {
  var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
  var row_level = Math.ceil((month(d) - 5) / no_months_in_a_row);
  return week_diff * cellSize + row_level * cellSize * 8 - cellSize - shift_up;
}).attr("class", "monday-label");

var year_titles = svg.selectAll(".year-title") // Jan, Feb, Mar and the whatnot
.data(function (d) {
  return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1));
}).enter().append("text").text(yearTitle).attr("x", function (d, i) {
  return width / 2 - 100;
}).attr("y", function (d, i) {
  return cellSize * 5.5 - shift_up;
}).attr("class", "year-title").attr("d", yearTitle);

var legend = svg.append('g');

legend.append('rect').attr('x', 715).attr('y', 300).attr('width', cellSize).attr('height', cellSize).attr('class', 'neighbour-0');

legend.append('text').text('40315').attr('x', 750).attr('y', 320);

legend.append('rect').attr('x', 715).attr('y', 340).attr('width', cellSize).attr('height', cellSize).attr('class', 'neighbour-1');

legend.append('text').text('40312').attr('x', 750).attr('y', 360);

legend.append('rect').attr('x', 715).attr('y', 380).attr('width', cellSize).attr('height', cellSize).attr('class', 'neighbour-2');

legend.append('text').text('41336').attr('x', 750).attr('y', 400);

legend.append('rect').attr('x', 715).attr('y', 420).attr('width', cellSize).attr('height', cellSize).attr('class', 'neighbour-3');

legend.append('text').text('40313').attr('x', 750).attr('y', 440);

//  Tooltip Object
var tooltip = d3.select("body").append("div").attr("id", "tooltip").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("a simple tooltip");

function dayTitle(t0) {
  return t0.toString().split(" ")[2];
}
function monthTitle(t0) {
  return t0.toLocaleString("en-us", { month: "long" });
}
function yearTitle(t0) {
  return t0.toString().split(" ")[3];
}
