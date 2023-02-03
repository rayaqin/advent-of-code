function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var rawData = e.target.result;
        processData(rawData);
    };
    reader.readAsText(file);
}

document.getElementById('file-input').addEventListener('change', readSingleFile, false);

function processData(rawRules){
    var rules = [];
    var ruleMap = new Map();
    rawRules.split("\n").forEach((rawRule)=>{
        let container = rawRule.split("bag")[0].trim(); //splitting the line of rules into an array by every "bag" occurance, and taking the first part
        let valueData = rawRule.replace(container, "").split(','); //the remaining parts of the rule, extracted by removing  the first part and then splitting it into an array by commas
        let valueArray = [];

        valueData.forEach((valueText)=>{ //going over the rules regarding one specific container's contents
            if(valueText.match(/(\d+)/)){ //this will return with not null, if there is a number in the valueText string
                valueArray.push(
                    {
                        //take the part of the valueText starting at the index of the number+1 until the end of it, and remove the bag or bags word from it, and also the dot, if theres one
                        color: valueText.substring(valueText.match(/(\d+)/)['index'] + 1).replace(/\.|bags|bag/g, "").trim(),
                        //take the actual number that has been matched by the regex
                        amount: parseInt(valueText.match(/(\d+)/)[0])
                    });
            }
        })
        ruleMap.set(container, valueArray);
        rules.push({container: container, contents: valueArray});
    })

    console.log(ruleMap);

    let results = new Set();
    findPossibleOuterContainers("shiny gold", ruleMap, results);
    setTimeout(() => {
        console.log("Number of possible outermost boxes: ", results.size);
    }, 0);

    console.log("Number of boxes contained by a shiny gold box: ", countNumberOfContainedBags("shiny gold", ruleMap, 1));

}

function findPossibleContainers(boxColor, rules){
    let possibleContainers = new Set();
    for (let ruleKey of rules.keys()) {
        rules.get(ruleKey).forEach((content)=>{
            if(content.color === boxColor){
                possibleContainers.add(ruleKey);
            }
        })
    }
    return possibleContainers;
}

function findPossibleOuterContainers(boxColor, rules, results){
    let possibleContainers = findPossibleContainers(boxColor, rules);
    if(possibleContainers.size > 0){
        if(boxColor !== "shiny gold") results.add(boxColor);
        possibleContainers.forEach((container)=>{
            findPossibleOuterContainers(container, rules, results)
        })
    } else {
        results.add(boxColor);
    }
}

function countNumberOfContainedBags(boxColor, rules){
    let sum = 0;
    rules.get(boxColor).forEach((innerBox)=>{
        sum += innerBox.amount + innerBox.amount * countNumberOfContainedBags(innerBox.color, rules)
    })
    return sum;
}