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

async function processData(data) {

    let resultArray = getStepsForDimensions(4, [0, 1, -1], 0);
    setTimeout(() => {
        resultArray.forEach(step => { console.log(step) })
    }, 0);
}

getStepsForDimensions = (dimensions, stepTypes, currentIndex) => {
    if (dimensions <= 0) return [];
    var possibilities = [];
    stepTypes.forEach((stepType) => {
        if (currentIndex === dimensions - 1) {
            possibilities.push([stepType]);
        } else {
            let nextNumbers = getStepsForDimensions(dimensions, stepTypes, currentIndex + 1);
            possibilities.push(...nextNumbers.map((combination) => {
                let result = combination;
                result.unshift(stepType);
                return result;
            }))
        }
    })
    return possibilities;
}