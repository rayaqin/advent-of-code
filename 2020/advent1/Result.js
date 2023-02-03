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

function processData(data){
    let numbers = new Set();
    data.split('\n').forEach((line)=>{
        numbers.add(parseInt(line.trim()));
    })

    console.log(findThreeNumberComponents(numbers, 2020).reduce((sum, currentPart) => {
        if (sum === 0) { return currentPart }
        else return sum * currentPart;
    }, 0));

}

function findTwoNumberComponents(numberArray, goalNumber){
    let results = [];
    numberArray.forEach((number)=>{
        if(number < goalNumber){
            let counterpart = goalNumber - number;
            if(numberArray.has(counterpart)){
                results = [number, counterpart];
            }
        }
    })
    return results;
}

function findThreeNumberComponents(numberArray, goalNumber){
    let results = [];
    numberArray.forEach((number)=>{
        if(number < goalNumber-1){
            let counterPartSum = goalNumber-number;
            let counterPartComponents = findTwoNumberComponents(numberArray, counterPartSum);
            if(counterPartComponents.length > 0){
                results = [number, counterPartComponents[0], counterPartComponents[1]];
            }
        }
    })
    return results;
}