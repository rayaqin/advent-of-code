
if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("File APIs are supported in your browser, you may proceed.");
} else {
alert("The File APIs are not fully supported in this browser. The code won't work.");
}


const chooseFile = document.getElementById("chooseFile");

const handleFileSelect = (event) => {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = (e) => solution(e.target.result);
}

chooseFile.addEventListener("change", handleFileSelect, false);



const solution = (source) => {
    console.log(source);
}





