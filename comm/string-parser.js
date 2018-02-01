/**
 * Des String Parser
 * Author Maple Joe
 */
export default (tmpl, obj) => {
    console.log('parser');

    tmpl = '<ul>\
                ##for(obj.a) {\
                <li>{{id}}</li>\
                <li>{{text}}</li>\
                }##\
            </ul>';
    
    tmpl = '<div>\
                ##for({{obj.b.aa}}) {\
                <ul>\
                    <li>{{id}}</li>\
                    <li>{{text}}</li>\
                </ul>\
                }##\
            </div>';

    obj = {
        a: {
            id: '01',
            text: 'text1'
        },
        b: {
            aa: [
                {
                    id: '01',
                    text: 'text1'
                },
                {
                    id: '02',
                    text: 'text2'
                },
                {
                    id: '03',
                    text: 'text3'
                }
            ]
        }
    }

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
    patternFor: /##for\s*?\(([\S\s]*?)\)\s*{([\S\s]*)\}##/g,
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
        if(cond) {
            for(let i=1, len=arr.length; i<len; i++) {
                cond = cond[t.removeTrim(arr[i])];
                if(!cond) break;
            }
        }
        return [bstr, cond ? ifStatement : '', astr].join('');
    },
    parserFor(t, tmpl, obj) {
        var forStr, forCondition, forStatement, tmp = '',
            {bstr, str, astr} = t.analysis({
            base: 'split',
            change: 'template',
            args: [tmpl]
        });
        t.patternFor.lastIndex = 0;
        forStr = t.patternFor.exec(str);
        forCondition = t.removeTrim(forStr[1]);
        forStatement = t.removeTrim(forStr[2]);
        var {cond, arr} = t.analysis({
            base: 'parser',
            change: 'condition',
            args: [forCondition, obj]
        });
        if(cond) {
            for(let i=1, len=arr.length; i<len; i++) {
                cond = cond[t.removeTrim(arr[i])];
                if(!cond) break;
            }
        }
        if(cond) {
            if(/\{\{(?!-)/g.test(forStatement)) {
                tmp = t.analysis({
                    base: 'parser',
                    change: 'var',
                    args: [forStatement, cond]
                });
            }
        }
        return [bstr, cond ? tmp : '', astr].join('');
    },
    parserVar(t, tmpl, obj) {
        if(!obj) return tmpl;
        var temp = '', str = '';
        if(t.isObject(obj)) {
            for(let j in obj) {
                tmpl = tmpl.replace(new RegExp('\{\{' + j + '\}\}', 'igm'), obj[j]);
            }
            temp = tmpl;
        } else if(t.isArray(obj)) {
            for(let i=0, len=obj.length; i<len; i++) {
                str = tmpl;
                for(let j in obj[i]) {
                    str = str.replace(new RegExp('\{\{' + j + '\}\}', 'igm'), obj[i][j]);
                }
                temp += str;
            }
        }
        return temp;
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
    },
    isObject(obj) {
        return this.is(obj, /object\sobject/i);
    },
    isArray(arr) {
        return this.is(arr, /array/i);
    },
    is(obj, type) {
        if('string' !== typeof type && 'object' !== typeof type) return; 
        if('object' !== typeof obj) {
            obj = typeof obj;
            return -1 !== obj.indexOf(type) ? true : false;
        }
        obj = Object.prototype.toString.call(obj);
        if('string' === typeof type) {
            return new RegExp([type, ']'].join(''), 'i').test(obj) ? true : false;
        }
        return type.test(obj) ? true : false;
    }
};