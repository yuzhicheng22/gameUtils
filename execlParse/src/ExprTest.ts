// import {ExpressionParser} from "./ExpressionParser";
//
// const expression = new ExpressionParser('@load+3');
// expression.onError((message:string, index:number, ch:string) => {
//     console.log(message, index, ch);
// })
// expression.parse();
// console.log(expression.tokens);
// console.log(expression.valueOf({load: 2}));
// console.log(expression.valueOf1({load: 4}));

import PlayerTaskCondParser from "./PlayerTaskCondParser";

const exprTest = new PlayerTaskCondParser("0");
exprTest.parse();
console.log(exprTest.tokens);
