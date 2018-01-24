/**
 * Des String Parser
 * Author Maple Joe
 */

export default (tmpl, obj) => {
    console.log('parser');

    // tmpl = '<ul>\
    //             ##if(obj.b.aa) {\
    //             <li>obj.b.aa</li>\
    //             }##\
    //         </ul>';
    
    // obj = {
    //     a: 'a',
    //     b: {
    //         aa: true
    //     }
    // };
    
    if(!tmpl) return; 
    
    tmpl = parser.parser(tmpl, obj);

    console.log('tmpl', tmpl);
    return tmpl;
};

const parser = {
    patternIfFor: /##(if|for)/g,
    patternIf: /##if\s*?\(([\S\s]*?)\)\s*\{([\s\S]*)\}##/g,
    patternFor: /##for\s*?\((.*?)\)/g,
    patternVar: /\{\{(?!-)(.*?)\}\}/g,
    patternVarE: /\}\}/g,
    patternE: /[\s\S]*?\}(?=\s*##)/g, 
    patternHash: /##/g,
    patternThis: /this|obj/ig,
    patternG: /^[wg]/ig,
    parser(tmpl, obj) {
        var t = this, arr;
        // 设置全局变量
        t.globalEnv();
        for(tmpl=t.removeTrim(tmpl); arr=t.patternIfFor.exec(tmpl); ) {
            // 跳转if,for方法
            tmpl = t.analysis({
                t: t,
                change: arr[1],
                args: [tmpl, obj]
            });
            // 字符串会发生变动，定位需置0
            t.patternIfFor.lastIndex = 0;
            console.log('tmplP', tmpl);
        }
        return tmpl;
    },
    analysis({t = this, base = 'parser', change, type = 'camel', split = '', args}) {
        return t.analysisFn(t ,t.getMethodName(base, change, type, split), args);
    },
    analysisFn(t, method, args) {
        return t[method](t, ...args);
    }, 
    getMethodName(base, change, type, s) {
        switch(type) {
            case 'camel':
                return [base, 
                        change.substring(0, 1).toUpperCase(),
                        change.substring(1)].join(s);
                break;
            case 'normal':
            default:
                return [base, change].join(s);
                break;
        }
    }, 
    parserIf(t, tmpl, obj) {
        var ifStr, ifCondition = '', ifStatement = '', 
            {bstr, str, astr} = t.analysis({
                base: 'split',
                change: 'template',
                args: [tmpl] 
            });
        t.patternIf.lastIndex = 0;
        ifStr = t.patternIf.exec(str);
        ifCondition = t.removeTrim(ifStr[1]);
        ifStatement = t.removeTrim(ifStr[2]);
        var {cond, arr} = t.analysis({
            base: 'parser',
            change: 'condition',
            args: [ifCondition, obj]
        });
        for(let i=1, len=arr.length; i<len; i++) {
            cond = cond[t.removeTrim(arr[i])];
            if(!cond) break;
        }
        return [bstr, cond ? ifStatement : '', astr].join('');
    },
    parserFor(t, tmpl, obj) {

    },
    parserVar(t, tmpl, obj) {

    },
    parserStatement(t, tmpl, obj) {

    },
    parserCondition(t, cond, obj) {
        var arr;
        t.patternThis.lastIndex = 0;
        t.patternG.lastIndex = 0;
        if(/\.(?![\s\S]*\}\})/.test(cond)) {
            arr = cond.split('.');
            arr[0] = t.removeTrim(arr[0]);
            t.patternThis.test(arr[0]) ? cond = obj :
                t.patternG.test(arr[0]) ? cond = t.g : (obj && obj[arr[0]]) ?
                (cond = obj, arr.unshift('obj')) : cond = eval('(' + arr[0] + ')');
        } else {
            arr = cond.replace(/\{\{|\}\}/g, '').split('.');
            !t.patternThis.test(t.removeTrim(arr[0])) && arr.unshift('obj');      
            cond = obj;
        }
        return {cond, arr};
    },
    removeTrim(tmpl) {
        return tmpl.replace(/^\s*|\s*$/gm, '');
    },
    splitTemplate(t, tmpl) {
        var arr, str;
        t.patternE.lastIndex = 0;
        arr = t.patternE.exec(tmpl);
        str = arr[0].match(t.patternHash);
        t.patternE.lastIndex = 0;
        for(let i=str.length; t.patternE.exec(tmpl); i--) {
            if(1 === i) break;
        }
        return {
            str: t.removeTrim(tmpl.substring(0, t.patternE.lastIndex + 2)),
            bstr: t.removeTrim(tmpl.split('##')[0]),
            astr: t.removeTrim(tmpl.substring(t.patternE.lastIndex + 2))
        };
    },
    globalEnv(t = this) {
        t.g = global || window;
    }
};

// const parser = {
//     parserVar: function(tmpl, obj) {
//         var temp = '';
//         if(/array/i.test(Object.prototype.toString.call(obj))) {
//             for(let i=0; i<obj.length; i++) {
//                 for(let j in obj[i]) {
//                     temp += tmpl.replace(new RegExp('\{\{' + j + '\}\}', 'igm'), obj[i][j]);
//                 }
//             }
//             return temp;
//         }
//         for(let i in obj) {
//             temp += tmpl.replace(new RegExp('\{\{' + i + '\}\}', 'igm'), obj[i]);
//         }
//         return temp;
//     },
//     parserIf: function(tmpl, obj) {
//         var patternS = /##if\((.*?)\)\{(.*?)\}/,
//             patternE = /[\s\S]*?\}(?=.*#)/igm,
//             //patternE = /^##if[\s\S]*?\}(?=.*#)/igm, 
//             str = [], split, theStr, otherStr, arr, tmp, forStr = '',
//             patternSplit = /##/g;
//         out: for(let i=1; split = patternE.exec(tmpl);) {
//             str = split[0].match(/(##[-]?)/igm);
//             patternE.lastIndex = 0;
//             for(let j=str.length; patternE.exec(tmpl); j--) {
//                 if(1 === j) {
//                     theStr = tmpl.substring(0, patternE.lastIndex + 2);
//                     otherStr = tmpl.substring(patternE.lastIndex + 2);
//                     break out;
//                 }
//             } 
//         }
//         split = /##if\((.*)\).*?{/igm.exec(theStr);
//         // 变量解析
//         if(/\./.test(split[1])) {    
//             arr = split[1].split('.');
//             if(/obj/i.test(arr[0])) {
//                 if(/object/.test(obj.toString())) {
//                     patternSplit.exec(tmpl);
//                     var strS = tmpl.substring(0, patternSplit.lastIndex - 2);
//                     for(let i in obj) {
//                         if(obj[i][arr[1]]) {
//                             strS += theStr.match(/^##if.*\{([\s\S]*)\}##/)[1];
//                         } else {
//                             strS += '';
//                         }
//                     }
//                     theStr = strS;
//                 } else {
//                     if(obj[arr[1]]) {
//                         theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
//                     } else {
//                         theStr = '';
//                     }
//                 }
//             } else if(/window|global/i.test(arr[0])){
//                 if(window[arr[1]] || global[arr[1]]) {
//                     theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
//                 } else {
//                     thisStr = ''
//                 }
//             } else {
//                 tmp = eval('(' + arr[0] + ')');
//                 if(tmp[arr[1]]) {
//                     theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
//                 } else {
//                     theStr = '';
//                 }
//             }
//         } else {
//             if(obj[split[1]]) {
//                 theStr = /^##if.*\{([\s\S]*)\}##/.match(theStr)[1];
//             } else {
//                 theStr = '';
//             }
//         }   
//         return theStr + otherStr;
//         // var split = pattern2.exec(tmpl);
//         // for(let i=1; pattern.exec(tmpl); i++) {
//         //     str = tmpl.substring(pattern2.lastIndex, pattern.lastIndex);
            
//         // } 
//     },
//     parserFor: function(tmpl, obj) {
//         var patternS = /##for\((.*)\)\{(.*?)\}/,
//             patternE = /[\s\S]*?\}(?=.*#)/igm,
//             split, str, theStr, theOtherStr, arr = [], len, win, 
//             strS = '', patternSplit = /##/g;
        
//         out: for(;split=patternE.exec(tmpl);) {
//             str = split[0].match(/##/);
//             patternE.lastIndex = 0;
//             for(let j=str.length; patternE.exec(tmpl); j--) {
//                 if(1 === j) {
//                     theStr = tmpl.substring(0, patternE.lastIndex + 2);
//                     theOtherStr = tmpl.substring(patternE.lastIndex + 2);
//                     break out;
//                 }
//             }
//         }
//         split = /##for\((.*)\).*?\{/igm.exec(theStr);
//         // 变量解析
//         if(/\./.test(split[1])) {
//             arr = split[1].split('.');
//             if(/window|global/.test(arr[0])) {
//                 win = !global.process ? window : global;
//                 if(/array/i.test(Object.prototype.toString.call(win[arr[1]]))) {
//                     if(win[arr[1]].length !== 0) {
//                         len = win[arr[1]].length;
//                         str = /^##for.*?\{([\s\S]*?)\}/.exec(theStr);
//                         for(let i=0; i<len; i++) {
//                             if(/\{\{/.test(theStr)) {
//                                 theStr += this.parserVar(str[1], win[arr[1]][i]);           
//                             } else {
//                                 theStr += str[1];
//                             }        
//                         } 
//                     }
//                 }
//             } else if(/obj|this/.test(arr[0])) {
//                 if(/array/i.test(Object.prototype.toString.call(obj[arr[1]]))) {
//                     if(obj[arr[1]].length !== 0) {
//                         len = obj[arr[1]].length;
//                         str = /^##for.*?\{([\s\S]*?)\}/.exec(theStr);
//                         for(let i=0; i<len; i++) {
//                             if(/\{\{/.test(theStr)) {
//                                 theStr += this.parserVar(str[1], obj[arr[1]][i]);
//                             } else {
//                                 theStr += str[1];
//                             }
//                         }
//                     } else {
//                         theStr = str[1];
//                     }
//                 }
//             }
//         } else {
//             if(/array/i.test(Object.prototype.toString.call(obj))) {
//                 if(obj.length !== 0) {
//                     len = obj.length;
//                     str = /##for.*?\{([\s\S]*?)\}(?=#)/.exec(theStr);
//                     patternSplit.exec(theStr);
//                     strS = theStr.substring(0, patternSplit.lastIndex - 2);
//                     for(var i = 0; i<len; i++) {
//                         if(/\{\{/.test(theStr)) {
//                             strS += this.parserVar(str[1], obj[i]);
//                         } else {
//                             strS += str[1];
//                         }
//                     }
//                     theStr = strS;
//                 } else {
//                     theStr = str[1];
//                 }
//             }
//         }
//         return theStr + theOtherStr;

//         // var str = [], temp = '',
//         //     pattern = /(<.*>)?\s*##for.*\{\s*(.*)\s*\}##\s*(<.*>)?/igm,
//         //     split;
        
//         // split = pattern.exec(tmpl);
//         // for(let i=1; i<split.length; i++) {
//         //     if(i !== 1 && i !== split.length-1) { 
//         //         temp += this.parserVar(split[i], obj);
//         //         continue;
//         //     }
//         //     temp += split[i];
//         // }
//         return temp;
//     },
//     parseStatement: function(tmpl, obj) {

//     },
//     removeTrim: function(tmpl) {
//         //return tmpl.replace(/^(\s+)|(\s+)$|(\s+(?=.*?>))/gm, 
//             //(match, p) => '');
//         return tmpl.replace(/^\s+|\s+$/gm, '');
//         //return tmpl.replace(/^\s*|\s*$|>\s*?</gm, '');
//     },
//     getMethodFn: function(method, args) {
//         return this[method](...args);
//         //return this[method].apply(this, args);
//         //return this[method](args);
//     },
//     method: function({base, change, type='camel', split='', args}) {
//         return this.getMethodFn(this.getMethodName(base, change, type, split), args);
//     },
//     // method: function(base, change, type = 'camel', split = '', args = []) {
//     //     return this.getMethodFn(this.getMethodName(base, change, type, split), args);
//     // },
//     getMethodName: function(base, change, type, s) {
//         switch(type) {
//             case 'camel':
//                 return [base, 
//                         change.substring(0, 1).toUpperCase(),
//                         change.substring(1)].join(s);
//                 break;
//             case 'normal':
//             default:
//                 return [base, change].join(s);
//                 break;
//         }
//     }
// };





