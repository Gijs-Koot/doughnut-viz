var width = 700,
    height = 700;

var color = d3.scale.category20();
var arc = d3.svg.arc();
var pie = d3.layout.pie()
    .sort(null);

var centerTransform = "translate(" + width / 2 + "," + height / 2 + ")"

var innerOuterRadius = 200,
    radiusPadding = .1,
    outerOuterRadius = 250,
    innerInnerRadius = 50,
    outerInnerRadius = 100;

var textPadding = 10;

var circlePadding = 0,
    circleRatio = 2;

var circleRadius = (innerOuterRadius - outerInnerRadius - 2 * circlePadding) / (2 + circleRatio),
    bandRadius = 2 * circleRadius;

var randomValues = function(){

    var innerValues = d3.range(5).map(function(n, i){
        return {
            value: Math.random(),
            label: "label"
        }
    });

    var outerValues = d3.range(7).map(function(n, i){
        return {
            value: Math.random(),
            label: "outer label"
        }
    });

    return {
        innerValues: innerValues,
        outerValues: outerValues
    }


}

var refresh = function(data){

    console.log("hi");
    console.log(data);
    
    var innerValues = data.innerValues,
        outerValues = data.outerValues;

    innerValues.map(function(v, i){
        v.slug = v.label + "-" + i;
    });

    outerValues.map(function(v, i){
        v.slug = v.label + "-" + i;
    });
    
    var svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "doughnut");

    drawInnerCircle(svg);
    drawOuterCircle(svg);
    
    svg.selectAll(".band")
        .data([{
            outerRadius: innerOuterRadius - circlePadding - circleRadius,
            innerRadius: outerInnerRadius + circlePadding + circleRadius,
            startAngle: 0,
            endAngle: 2 * Math.PI
        }]).enter()
        .append("g")
        .attr("class", "band")
        .attr("transform", centerTransform)
        .append("path")
        .attr("d", arc)

    var nin = innerValues.length;
    var innerArclength = (Math.PI * 2 - nin * radiusPadding) / nin;

    var innerArcdata = innerValues.map(function(v, i){
        r = {
            startAngle: i * (innerArclength + radiusPadding),
            endAngle: (i + 1) * innerArclength + i * radiusPadding,
            innerRadius: outerInnerRadius - v.value * (outerInnerRadius - innerInnerRadius),
            outerRadius: outerInnerRadius
        }
        for (key in v){
            r[key] = v[key]
        }
        return r
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

    var innerEnterG = svg.selectAll(".arc-inner")
        .data(innerArcdata)
        .enter().append("g")
        .attr("class", "arc-inner")
        .attr("transform", centerTransform);

    // fill
    innerEnterG.append("path")
        .attr("d", arc)

    // text path
    innerEnterG.append("path")
        .attr("id", function(d){return d.slug})
        .attr("d", function(d){
            var r = (innerOuterRadius + outerInnerRadius) / 2
            return arc({
                innerRadius: r,
                outerRadius: r,
                startAngle: d.startAngle,
                endAngle: d.endAngle
            })
        });

    innerEnterG.append("text")
        .append("textPath")
        .attr("startOffset","25%")
        .style("text-anchor","middle")
        .attr("xlink:href", function(d){return "#" + d.slug })
        .text(function(d, i){return d.label});

    var outerEnterG = svg.selectAll(".arc-outer")
        .data(outerArcdata)
        .enter().append("g");

    outerEnterG.attr("class", "arc-outer")
        .attr("transform", centerTransform)
        .append("path")
        .attr("d", arc)



    outerEnterG.attr("class", "arc-outer")
        .attr("transform", centerTransform)
        .append("path")
        .attr("id", function(d){return d.slug})
        .attr("d", function(d){
            var r = d.outerRadius + textPadding;

            return arc({
                innerRadius: r,
                outerRadius: r,
                startAngle: d.startAngle,
                endAngle: d.endAngle
            })
        })

    tPath = outerEnterG.append("text")
        .append("textPath")
        .attr("startOffset","25%")
        .style("text-anchor","middle")
        .attr("href", function(d){return "#" + d.slug})
        .text(function(d){return d.label})

}

function drawInnerCircle(svg){

    var circleInnerG = svg.selectAll(".circle-inner")
        .data([{
            outerRadius: outerInnerRadius + circlePadding,
            innerRadius: outerInnerRadius + circlePadding + circleRadius,
            startAngle: 0,
            endAngle: 2 * Math.PI
        }]).enter()
        .append("g")
        .attr("class", "circle-inner")
        .attr("transform", centerTransform);

    // fill

    circleInnerG.append("path").attr("d", arc);

    // textpath

    circleInnerG.append("path")
        .attr("d", function(d){
            var r = (d.innerRadius + d.outerRadius) / 2
            return arc({
                innerRadius: r,
                outerRadius: r,
                startAngle: 0,
                endAngle: Math.PI * 2
            })
        })
        .attr("id", "circle-inner");

    circleInnerG.append("text")
        .append("textPath")
        .attr("xlink:href", "#circle-inner")
        .text("Bedrijvigheidsbasis")

}

function drawOuterCircle(svg){
    var circleOuterG = svg.selectAll(".circle-outer")
        .data([{
            outerRadius: innerOuterRadius - circlePadding,
            innerRadius: innerOuterRadius - circlePadding - circleRadius,
            startAngle: 0,
            endAngle: 2 * Math.PI
        }]).enter()
        .append("g")
        .attr("class", "circle-outer")
        .attr("transform", centerTransform);

    // outline

    circleOuterG.append("path")
        .attr("d", arc)

    // textgroup

    circleOuterG.append("path")
        .attr("d", function(d){
            var r = (d.innerRadius + d.outerRadius) / 2
            return arc({
                innerRadius: r,
                outerRadius: r,
                startAngle: 0,
                endAngle: Math.PI * 2
            })
        })
        .attr("id", "circle-outer")


    circleOuterG.append("text")
        .append("textPath")
        .attr("xlink:href", "#circle-outer")
        .text("Omgevingsplafond")
    
}


