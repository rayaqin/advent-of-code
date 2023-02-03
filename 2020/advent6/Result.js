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

function processData(rawData){
    console.log(rawData.split('\r\n\r\n')[1])
    let yesTotalCount = 0;
    let allYesTotalCount = 0;
    let groups = rawData.split('\n').map((line) => {
        if (line.length === 1) {
            return "[divide]";
        } else {
            return line;
        }
    }).join(' ').split('[divide]').map((line)=>{
        let headCount = line.trim().split(' ').length;
        let answerSet = new Set();
        let allYesCount = 0;
        line.split('').forEach((answer)=>{
            if (answer.trim() !== ""){
                if (!answerSet.has(answer) && countOccurances(line.split(''), answer) === headCount){
                    allYesCount++;
                }
                countOccurances(line.split(''), answer);
                answerSet.add(answer);
            }
        })
        let yesCount = answerSet.size;
        yesTotalCount += yesCount;
        allYesTotalCount += allYesCount;
        return {
            headCount: headCount,
            answerSet: answerSet,
            yesCount: yesCount,
            allYesCount: allYesCount
        }
    });

    console.log("Anyone yes: ", yesTotalCount);
    console.log("Everyone yes: ", allYesTotalCount);
    console.log(groups);
}

function countOccurances(arr, val){
    return arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
}