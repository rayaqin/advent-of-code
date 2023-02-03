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

async function processData(seatLinesData) {
    let seatMatrix = [];
    seatLinesData.split('\n').forEach((seatLine)=>{
        if (seatLine) seatMatrix.push(seatLine.trim().split(''));
    })

    let checkAroundSteps = getStepsForDimensions(2, [0, 1, -1], 0).filter((step) => {
        let notZero = 0;
        step.forEach((coordinate) => {
            if (coordinate !== 0) notZero++;
        })
        return notZero > 0;
    });
    console.log("stepping around current selected point to check neighbours by doing these steps: ");
    checkAroundSteps.forEach(line=>console.log(line));

    let resultObject = {state: seatMatrix, changesMade: 1};
    do {
        resultObject = await applyRules(resultObject.state, checkAroundSteps);
    } while (resultObject.changesMade > 0);

    let eqOccupiedSeats = resultObject.state.map((seatLine)=>{
        return seatLine.reduce((sum, seat)=>{
            return sum + (seat==='#' ? 1 : 0);
        }, 0)
    }).reduce((allSum, lineSum)=>{
        return allSum + lineSum;
    },0)

    console.log("number of occupied seats at equilibrium: ", eqOccupiedSeats);
}

async function applyRules(currentState, checkAroundSteps) {
    let changesMade = 0;
    let occupiedSeatsAround = 0;
    var nextState = currentState.map(function (arr) {
        return arr.slice();
    });
    for (let i = 0; i < currentState.length; i++) {
        for (let j = 0; j < currentState[i].length; j++) {
            occupiedSeatsAround = 0;
            if(currentState[i][j] !== '.'){
                checkAroundSteps.forEach((step) => {
                    if (
                        i + step[0] >= 0 && i + step[0] < currentState.length &&
                        j + step[1] >= 0 && j + step[1] < currentState[i].length
                    ){
                        if(currentState[i + step[0]][j + step[1]] === '#'){
                            occupiedSeatsAround++;
                        }
                    }
                });
                if (currentState[i][j] === 'L' && occupiedSeatsAround === 0){
                    nextState[i][j] = '#';
                    changesMade++;
                } else if (currentState[i][j] === '#' && occupiedSeatsAround >= 4){
                    nextState[i][j] = 'L';
                    changesMade++;
                }
            }
        }
    }
    /*console.clear();
    nextState.forEach(line=>console.log(line.join(' ')));
    console.log(changesMade)
    await sleep(600);*/
    return {state: nextState, changesMade: changesMade};
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

getStepsForDimensions = (dimensions, stepTypes, currentIndex) => {
    var possibilities = [];
    stepTypes.forEach((stepType) => {
        if (currentIndex === dimensions - 1) {
            possibilities.push([stepType]);
        } else {
            let nextNumbers = this.getStepsForDimensions(dimensions, stepTypes, currentIndex + 1);
            possibilities.push(...nextNumbers.map((combination) => {
                let result = combination;
                result.unshift(stepType);
                return result;
            }))
        }
    })
    return possibilities;
}