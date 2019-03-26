document.getElementById('button-go').onclick = function(e){
    var data = readData();
    console.log(data);
    removeDoughnut();
    refresh(data);
}

var randomize = function(){
    var data = randomValues();
    emptyText();
    populateData(data);
    removeDoughnut();
    refresh(data);
}


document.getElementById('button-randomize').onclick = randomize;

var emptyText = function(){

    var empty = function(el){
        while(el.firstChild){
            el.removeChild(el.firstChild);
        }
    }

    empty(document.getElementById('outer-data'));
    empty(document.getElementById('inner-data'));
}

var readData = function(){
    var outerString = document.getElementById('outer-data').value;
    var innerString = document.getElementById('inner-data').value;

    return {
        outerValues: blockToValues(outerString),
        innerValues: blockToValues(innerString)
    }
}

var blockToValues = function(block){
    var values = block.split('\n').map(function(r){
        var spl = r.split(':');
        return {
            label: spl[0],
            value: parseFloat(spl[1])
        }
    }).filter(function(el){
        return !!el.label;
    });
    
    return values;
}

var populateData = function(data){
    var innerValues = data.innerValues,
        outerValues = data.outerValues;

    var innerString = "",
        outerString = "";

    innerValues.map(function(it){
        innerString += it.label + ":" + it.value.toFixed(2) + "\n";
    });

    outerValues.map(function(it){
        outerString += it.label + ":" + it.value.toFixed(2) + "\n";
    })
                 
    document.getElementById('outer-data').value = outerString
    

    document.getElementById('inner-data').appendChild(
        document.createTextNode(innerString)
    )
                    
    
}

var removeDoughnut = function(){
    var element = document.getElementById("doughnut");
    if(!!element){
        element.parentNode.removeChild(element);
    }
}

randomize();
