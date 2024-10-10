const OPEN_PAREN_CODE = 40; // ( 左括号
const CLOSE_PAREN_CODE = 41; // ) 右括号
const SPACE_CODES = [32, 9, 10, 13]; // 空格

const OPERATOR_ADD_CODES = 38;
const OPERATOR_OR_CODES = 124;
const OPERATOR_ADD = "&&";
const OPERATOR_OR = "||";


//只有两个操作服务
const OPERATORS = [OPERATOR_ADD, OPERATOR_OR];
//二元操作运算符 对应的优先级
const BINARY_OPERATORS: { [key: string]: number } = {
    '||': 1,
    '&&': 2,
    // '===': 6, '!==': 6,
    // '<': 7, '>': 7, '<=': 7, '>=': 7,
    // '+': 9, '-': 9,
    // '*': 10, '/': 10, '%': 10,
    // 'include': 11,
};
// 获取对象键的最大长度
const getMaxKeyLen = function (obj: any) {
    let max = 0;
    Object.keys(obj).forEach((key) => {
        if (key.length > max && obj.hasOwnProperty(key)) {
            max = key.length;
        }
    });
    return max;
}
//最大操作符的长度
const maxOperatorLen = getMaxKeyLen(BINARY_OPERATORS);
/**
 * 玩家任务条件解析
 */
export default class PlayerTaskCondParser {
    /**
     * 是否解析过
     */
    public parsed: boolean = false;
    private readonly expr: string;
    private readonly exprLen: number;
    private index: number = 0;

    constructor(expr: string) {
        // if (typeof expr !== 'string') {
        //     throw new Error(`[expression-parser] constructor need a string parameter, but get [${typeof expr}]`);
        // }
        this.expr = expr;
        this.exprLen = expr.length;
    }

    public tokens?: PlayerTaskValueToken;
    public onErrorCallback?: Function;

    /**
     * 解析表达式
     */
    public parse() {
        this.index = 0;
        try {
            this.tokens = this.eatExpression()!;
            if (this.index < this.exprLen) {
                throw new Error(`非法字符"${this.charAt(this.index)}"`);
            }
            if(this.tokens.type == PlayerTaskExprTokenEnum.VARIABLE){//
                this.tokens.type = PlayerTaskExprTokenEnum.NULL;
            }
            // @ts-ignore
        } catch (error: Error) {
            this.tokens = undefined;
            if (typeof this.onErrorCallback === 'function') {
                this.onErrorCallback(error.message, this.index, this.charAt(this.index));
            } else {
                throw new Error(error.message);
            }
        }
    }

    public eatExpression(): PlayerTaskValueToken | null {
        let left = this.eatToken();
        let operator = this.eatBinaryOperator();
        if (!operator) {
            return left;
        }
        let right: any = this.eatToken();
        if (!right) {//获取右边token
            throw new Error(`"${operator}"运算符后应该为表达式`);
        }
        let operatorInfo = this.getOperatorPrecedenceInfo(operator);
        const stack = [left, operatorInfo, right];
        // 获取下一个运算符
        while (operator = this.eatBinaryOperator()) {
            //优先级
            const precedenceInfo = this.getOperatorPrecedenceInfo(operator);
            // 如果遇到了非法的运算符
            if (precedenceInfo.precedence === 0) {
                break;
            }
            // 判断优先级 如果有 左边优先级 大于 右边 左边先入栈
            while (stack.length > 2 && (stack[stack.length - 2] as PlayerTaskCondOperatorInfo).precedence > precedenceInfo.precedence) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                const node = this.createNode(operator as string, left!, right);
                stack.push(node);
            }
            const node = this.eatToken();
            if (!node) {
                throw new Error(`"${operator}"运算符后应该为表达式`);
            }
            stack.push(precedenceInfo, node);
        }
        // 计算优先级 来判断  右边向左边来判断 如果依次入栈
        // todo 这个好像不太对了 没有 做解析数据
        let index = stack.length - 1;
        let node = stack[index];
        while (index > 1) {
            node = this.createNode(stack[index - 1].value, stack[index - 2], node);
            index -= 2;
        }
        // if(index!= -1){
        //     debugger;
        // }
        return node;
    }

    /**
     * 解析token
     */
    public eatToken(): PlayerTaskValueToken | null {
        this.eatSpaces();
        const ch = this.charCodeAt(this.index);//获取第一个数值
        if (ch === OPEN_PAREN_CODE) {
            // 括号 得到
            return this.eatGroup();
        } else {
            return this.eatVariable();
        }

    }

    /**
     * 解析变量
     */
    public eatVariable() {
        const ch = this.charAt(this.index);
        const start = this.index;

        while (this.index < this.exprLen) {
            const chCode = this.charCodeAt(this.index);
            if (this.notOptPart(chCode)) {
                this.index++;
            } else {
                break;
            }
        }
        const identifier = this.expr.slice(start, this.index);
        let data = new PlayerTaskValueToken();
        data.type = PlayerTaskExprTokenEnum.VARIABLE;
        data.value = identifier;
        data.raw = identifier;
        return data;
    }

    /**
     * 解析表达式
     */
    public eatGroup() {
        this.index++; // eat "("
        const node = this.eatExpression();
        this.eatSpaces();
        const ch = this.charCodeAt(this.index);
        if (ch !== CLOSE_PAREN_CODE) {
            throw new Error('括号没有闭合');
        } else {
            this.index++; // eat ")"
            return node;
        }
        let data = new PlayerTaskValueToken();
        data.type = PlayerTaskExprTokenEnum.NULL;
        return data;
    }

    /**
     * 判断是否是操作符的部分
     *
     * @param ch
     */
    notOptPart(ch: number) {
        return ch != OPERATOR_ADD_CODES && ch != OPERATOR_OR_CODES && ch != CLOSE_PAREN_CODE;
    }


    /**
     * 解析二元操作符
     * 其实应该添加一个解析数据 来做二元解析
     */
    public eatBinaryOperator() {
        this.eatSpaces();
        //得到二元操作符的最大数据
        let toCheck = this.expr.slice(this.index, this.index + maxOperatorLen);
        let toCheckLength = toCheck.length;
        while (toCheckLength) {
            if (
                this.index + toCheckLength <= this.exprLen && //超过了
                OPERATORS.indexOf(toCheck) >= 0 //在表达式里面
            ) {
                this.index += toCheckLength;
                return toCheck;
            }
            //减少一个数据
            toCheck = toCheck.slice(0, -1);
            toCheckLength--;
        }

        return false;

    }

    charAt(index: number) {
        return this.expr.charAt(index);
    }

    charCodeAt(index: number) {
        return this.expr.charCodeAt(index);
    }

    // /**
    //  * 获取操作符的优先级
    //  * @param operator
    //  */
    // getOperatorPrecedence(operator: string) {
    //     return BINARY_OPERATORS[operator] || 0;
    // }
    getOperatorPrecedenceInfo(operator: string) {
        return new PlayerTaskCondOperatorInfo(BINARY_OPERATORS[operator] || 0, operator);
        // return new PlayerTaskCondOperatorInfo(this.getOperatorPrecedence(operator),operator);
    }

    //判断是否空格 空格 就接着下一个
    public eatSpaces() {
        let ch = this.charCodeAt(this.index);
        while (SPACE_CODES.indexOf(ch) !== -1) {
            ch = this.charCodeAt(++this.index);
        }
    }

    /**
     * 创建节点
     * @param operator
     * @param left
     * @param right
     */
    createNode(operator: string, left: PlayerTaskValueToken, right: PlayerTaskValueToken) {
        const type = PlayerTaskExprTokenEnum.BINARY_EXPR;
        let data = new PlayerTaskExprToken();
        data.type = type;
        data.operator = operator;
        data.right = right;
        data.left = left;
        return data;
    }

}

/**
 * token类型
 *  现在只有一元操作符
 */
enum PlayerTaskExprTokenEnum {
    NULL,//为空
    VARIABLE,//变量
    BINARY_EXPR,//二元操作
}

/**
 * 用户任务条件优先级
 */
class PlayerTaskCondOperatorInfo {
    //优先级
    precedence: number;//
    //值
    value: string;//
    constructor(precedence: number, value: string) {
        this.precedence = precedence;
        this.value = value;
    }
}

/**
 * 变量或者值得token
 */
class PlayerTaskValueToken {
    type?: PlayerTaskExprTokenEnum;
    value?: any;
    raw?: any;
    operator?: string
}

/**
 * 表达式token
 */
class PlayerTaskExprToken extends PlayerTaskValueToken {
    left!: PlayerTaskValueToken;
    right!: PlayerTaskValueToken;
}
