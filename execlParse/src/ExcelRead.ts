import XLSX from 'xlsx';

export class ExcelRead {
    constructor() {

    }

    public parserHandler(data: any) {
        let lastTime = Date.now();
        let workBook = XLSX.read(data)
        // let names = workBook.SheetNames;
        // let workSheer = workBook.Sheets[names[0]];
        console.log("读取时间",Date.now()-lastTime);
        return workBook;
        // console.log(workSheer.rows);
        // console.log(workBook.SheetNames);
    }

}

const excelRead = new ExcelRead();
export default excelRead;