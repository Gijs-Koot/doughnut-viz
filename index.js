var width = 960,
    height = 500;

var color = d3.scale.category20();
var arc = d3.svg.arc();
var pie = d3.layout.pie()
    .sort(null);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// calculating inner arcs

var innerValues = d3.range(5).map(function(n, i){
    return {
        value: Math.random(),
        label: "label",
        slug: "inner-" + i
    }
});

var innerOuterRadius = 130,
    radiusPadding = .1,
    outerOuterRadius = 200,
    innerInnerRadius = 25,
    outerInnerRadius = 80;

var nin = innerValues.length;
var innerArclength = (Math.PI * 2 - nin * radiusPadding) / nin;

var innerArcdata = innerValues.map(function(v, i){
    r = {
        startAngle: i * (innerArclength + radiusPadding),
        endAngle: (i + 1) * innerArclength + i * radiusPadding,
        innerRadius: innerInnerRadius + v.value * (outerInnerRadius - innerInnerRadius),
        outerRadius: outerInnerRadius
    }

    for (key in v){
        r[key] = v[key]
    }

    return r
});

// calculation of outer arcs

var outerValues = d3.range(7).map(function(n, i){
    return {
        value: Math.random(),
        label: "outerlabel",
        slug: "outer-" + i
    }
});

var nout = outerValues.length;
var outerArclength = (Math.PI * 2 - nout * radiusPadding) / nout;

var outerArcdata = outerValues.map(function(v, i){
    r = {
        startAngle: i * (outerArclength + radiusPadding),
        endAngle: (i + 1) * outerArclength + i * radiusPadding,
        innerRadius: innerOuterRadius,
        outerRadius: innerOuterRadius + v.value * (outerOuterRadius - innerOuterRadius)
    }

    for (key in v){
        r[key] = v[key]
    }

    return r
});

var centerTransform = "translate(" + width / 2 + "," + height / 2 + ")"

svg.selectAll(".arc-inner")
    .data(innerArcdata)
    .enter().append("g")
    .attr("class", "arc-inner")
    .attr("transform", centerTransform)
    .append("path")
    .attr("fill", function(d, i) {return color(i);})
    .attr("id", function(d){return d.slug})
    .attr("d", arc)

var outerEnterG = svg.selectAll(".arc-outer")
    .data(outerArcdata)
    .enter().append("g");

outerEnterG.attr("class", "arc-outer")
    .attr("transform", centerTransform)
    .append("path")
    .attr("fill", function(d, i) { return color(i); })
    .attr("id", function(d){return d.slug})
    .attr("d", arc)

outerEnterG.append("text")
    .append("textPath")
    .text(function(d){return d.label})
    .attr("startOffset","20%")
    .style("text-anchor","middle")
    .attr("xlink:href", function(d){return "#" + d.slug})
    .attr("fill", "black");

// draw omgevingsplafond

var circlePadding = 10,
    circleRatio = 2;

var circleRadius = (outerInnerRadius - innerOuterRadius - 2 * circlePadding) / (2 + circleRatio),
    bandRadius = 2 * circleRatio;

console.log(circleRadius, bandRadius)

svg.selectAll(".circle-outer")
    .data([{
        outerRadius: innerOuterRadius - circlePadding,
        innerRadius: innerOuterRadius - circlePadding - bandRadius,
        startAngle: 0,
        endAngle: 2 * Math.PI
    }]).enter()
    .append("g")
    .attr("class", "circle-outer")
    .attr("transform", centerTransform)
    .append("path")
    .attr("fill", "green")
    .attr("d", arc)

svg.selectAll(".circle-inner")
    .data([{
        outerRadius: outerInnerRadius + circlePadding,
        innerRadius: outerInnerRadius + circlePadding + bandRadius,
        startAngle: 0,
        endAngle: 2 * Math.PI
    }]).enter()
    .append("g")
    .attr("class", "circle-inner")
    .attr("transform", centerTransform)
    .append("path")
    .attr("fill", "green")
    .attr("d", arc)

svg.selectAll(".band")
    .data([{
        outerRadius: innerOuterRadius - circlePadding - bandRadius,
        innerRadius: outerInnerRadius + circlePadding + bandRadius,
        startAngle: 0,
        endAngle: 2 * Math.PI
    }]).enter()
    .append("g")
    .attr("class", "band")
    .attr("transform", centerTransform)
    .append("path")
    .attr("fill", "lightgreen")
    .attr("d", arc)
