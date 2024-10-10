/**
 * ${ClassName}
 */
export default class DemoClass{
    public value!:string;

    public parseData(data:any[]){
        this.value = data[1];
    }
}