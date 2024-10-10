import XLSX from 'xlsx';
import excelItemClientTypeParseUtils, {ExcelItemClientTypeData} from "./ExcelItemClientTypeData";
import excelItemUnityClientTypeDataUtils, {ExcelItemUnityClientTypeData} from "@/excelParser/base/ExcelItemUnityClientTypeData";

/**
 * 表格的元数据
 */
export default class ExcelMetaData {
    public excelName!:string;
    public sheetName!: string;
    public sheetData!: XLSX.WorkSheet;
    public itemMetaDataList: ExcelItemMetaData[] = [];
    //列数据
    public colCount: number = 0;
    //排多少排
    public rowCount: number = 0;

    public static parserData(data: XLSX.WorkBook,excelName:string) {
        let metaData = new ExcelMetaData();
        metaData.excelName = excelName;
        metaData.sheetName = data.SheetNames[0];
        metaData.sheetData = data.Sheets[metaData.sheetName];
        let collCounts = metaData.sheetData ["!ref"]!.split(":");
        let rowCount = collCounts[1].replace(/\D+/, "");
        let colName = collCounts[1].replace(/\d+/, "");
        metaData.rowCount = parseInt(rowCount);
        metaData.colCount = ColumnNameList.indexOf(colName);
        metaData.initMetaItemData();
        return metaData;
    }

    public initMetaItemData() {
        let curCount = 0;
        for (let colName of ColumnNameList) {
            curCount++;
            let nameCell = this.getCell(curCount, 1);
            if (!nameCell || !nameCell.v) {
                //第一列没有数据 那就跳出来了
                break;
            }
            let typeNameCell = this.getCell(curCount, 2);
            let typeValueCell = this.getCell(curCount, 3);
            let itemMetaData = ExcelItemMetaData.parseByData(nameCell.v.toString(), typeNameCell.v?typeNameCell.v.toString():"", typeValueCell.v?typeValueCell.v.toString():"string");
            itemMetaData.index = curCount-1;
            this.itemMetaDataList.push(itemMetaData);
        }
        this.colCount = curCount;//设置有多少列 过滤掉不要的
    }

    /**
     *
     * @param row 排
     * @param column 列
     */
    public getCell(column: number, row: number): XLSX.CellObject {
        let columnName = ColumnNameList[column - 1];
        return this.sheetData[columnName + row];
    }

}
export const ColumnNameList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ"]


/**
 * 表格的单个元数据
 */
export class ExcelItemMetaData {
    public index!:number;
    public name!: string;
    public typeStr!:string;
    public typeName!: string;
    public typeNameCS!: string;
    public type!: ExcelItemClientTypeData;
    private _unityType!:ExcelItemUnityClientTypeData;
    public get unityType(): ExcelItemUnityClientTypeData{
        if(this._unityType  == null){
            this._unityType = excelItemUnityClientTypeDataUtils.parseByData(this.typeStr);
        }
        return this._unityType;
    }

    public getClientVar(){
        return `\t//${this.name}\n\tpublic ${this.typeName}!: ${this.type.type};`;
    }

    public getClientParse(){
        return `\t\tthis.${this.typeName} = ${this.type.getParseStr(this.index)};`
    }


    public getUnityClientVar(){
         let summary  = `\t\t/// <summary>\n\t\t/// ${this.name}\n\t\t/// </summary>`;
        return summary+`\n\t\tpublic ${this.unityType.type} ${this.typeNameCS} { get; private set; }`;
    }
    public getClientUnityParse(){
        // if(!json[0].IsInt) { throw new SerializationException(json.ToJson()); }  TypeInt = ((IJsonWrapper)json[0]).GetInt() ;
        return `\t\t\t${this.unityType.getParseStr(this.index).replaceAll("&0&",this.typeNameCS)}`;
    }
    public static parseByData(name: string, typeName: string, type: string) {
        let data = new ExcelItemMetaData();
        data.name = name;
        data.typeName = typeName;
        data.typeNameCS = typeName[0].toUpperCase()+typeName.slice(1);
        data.typeStr  =type;
        data.type = excelItemClientTypeParseUtils.parseByData(type);
        return data;
    }
}
