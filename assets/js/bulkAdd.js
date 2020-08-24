const readExcelFile = () => {
    const myFileInput = document.querySelector("#myFile")
    myFileInput.addEventListener("input", (e) => {
        const files = myFileInput.files
        if (files.lenght === 0) return
        const file = files[0]
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, {
                type: 'binary'
            });
            const sheetNames = workbook.SheetNames;
            const worksheet = workbook.Sheets[sheetNames[0]];
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log(json)
            myFileInput.value = null; //Clear after reading
        }
    })
}

readExcelFile()