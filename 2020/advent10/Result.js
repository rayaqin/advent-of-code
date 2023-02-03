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

function processData(adapterData) {
    let adapters = adapterData.split("\n").map((adapter)=>{
        return adapter ? parseInt(adapter) : 0;
    })
    adapters.sort((a, b) =>  {
        return a - b;
    });
    adapters.push(adapters[adapters.length-1]+3);
    console.log(
        "number of possible combinations: ", allCombinationsCount(adapters),
        "\nfull chain diff result: ", fullChainDiff(adapters)
    );
}

function fullChainDiff(adapters){
    let oneDiffCount = 0;
    let threeDiffCount = 0;
    for(let i=1; i<adapters.length; i++){
        if(adapters[i]-adapters[i-1] === 1){
            oneDiffCount++;
        } else if(adapters[i] - adapters[i - 1] === 3){
            threeDiffCount++;
        };
    }
    return oneDiffCount * threeDiffCount;
}

function allCombinationsCount(adapters){
    let adapterToCombination = new Map();
    let waysToGetThere;
    var t0 = performance.now();
    for(let i = 0; i<adapters.length; i++){
        waysToGetThere = 0;
        for(let j = 0; j<i; j++){
            if(adapters[i] - adapters[j] <= 3){
                waysToGetThere += adapterToCombination.get(adapters[j]);
            }
        }
        if(waysToGetThere === 0) waysToGetThere++;
        adapterToCombination.set(adapters[i], waysToGetThere);
    }
    var t1 = performance.now();
    console.log("allCombinationsCount took " + (t1 - t0) + " milliseconds to complete.");
    return adapterToCombination.get(adapters[adapters.length-1]);
}
