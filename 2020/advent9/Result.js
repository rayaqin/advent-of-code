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

function processData(numbersData) {
    let preambleSize = 25;
    let numbers = numbersData.split('\n');
    let numbersWithPreamble = [];
    for (let i = preambleSize; i<numbers.length; i++){
        let preamble = [];
        for (let j = i - preambleSize; j<i; j++){
            preamble.push(parseInt(numbers[j]));
        }
        numbersWithPreamble.push({number: parseInt(numbers[i]), preamble: preamble});
    }
    console.log(numbers.map(n => parseInt(n)));

    numbersWithPreamble.forEach((nwp)=>{
        if(!doesCombinationExist(nwp)){
            let comboChain = findComboChain(nwp.number, numbers.map(n => parseInt(n)));
            console.log(
                "invalid number: ",nwp.number,
                "\nCombo Chain: ", comboChain,
                "\nComboChainCheckSum: ", comboChain.reduce((acc, cval)=>{return acc+cval},0),
                "\nSolution: ", comboChain.sort()[0] + comboChain.sort()[comboChain.length-1]
            );
        }
    })
}



function doesCombinationExist(nwp){
    let combination;
    nwp.preamble.forEach((preNum)=>{
        for(let i=0; i<nwp.preamble.length;i++){
            if(preNum != nwp.preamble[i] && preNum+nwp.preamble[i] == nwp.number){
                combination = [preNum, nwp.preamble[i]];
                break;
            }
        }
    })
    return combination;
}

function findComboChain(number, listOfNumbers){
    let tempSum = 0;
    let tempComboChain = [];
    let result;
    for(let i=0; i<listOfNumbers.length;i++){
        if(listOfNumbers[i] < number){
            tempComboChain.push(listOfNumbers[i]);
            tempSum+=listOfNumbers[i];
            for(let j=i+1; j<listOfNumbers.length; j++){
                let previousTempSum = tempSum;
                tempSum+=listOfNumbers[j]
                if(tempSum<number){
                    tempComboChain.push(listOfNumbers[j]);
                } else if (tempSum == number) {
                    tempComboChain.push(listOfNumbers[j]);
                    result = [...tempComboChain];
                    console.log("--Found the right combo chain--\n" + result);
                } else {
                    console.log("--Went over goal--\ni: ", i,"j :", j, "tcc: ", tempComboChain, "tsc: ", tempSum, "tsp: ",  previousTempSum, "number: ", number)
                    break;
                }
            }
        }
        tempComboChain = [];
        tempSum = 0;
    }
    return result;
}
