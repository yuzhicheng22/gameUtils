import ExcelMetaData from "./base/ExcelMetaData";

export class ExcelParser {

    public parserMetaData(data:any):ExcelMetaData{
         return ExcelMetaData.parserData(data)
    }
}

const excelParser = new ExcelParser();
export default excelParser;

