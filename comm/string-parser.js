/**
 * Des String Parser
 * Author Maple Joe
 */

export default (tmpl, obj) => {
    console.log('parser');
    console.log('yy')
    tmpl = `##if(obj.aaa) {
            <ul>
                ##for(obj) {
                <li>{{aaa}}</li>
                }##
            </ul>
            }##
            ##if(obj.bbb) {
            <ul>
                ##for(obj) {
                <li>{{aaa}}</li>
                }##
            </ul>
            }##
            `;
    obj = [
        {
            aaa: 'aaa'
        },
        {
            aaa: 'bbb'
        }
    ];
    if(!tmpl) return; 

    // 自执行解析对象
    var p = function() {return parser;}(), split, 
        pattern = /##(for|if)\((.+?)\)/g;
    
    // 根据匹配解析相应原则
    for(tmpl = p.removeTrim(tmpl); pattern.exec(tmpl); ) { 
        p.method('parser', RegExp.$1, undefined, undefined,[tmpl, obj]);
    }

    // if(/\#\#for/igm.test(tmpl)) {
    //     tmpl = p.parserFor(tmpl, obj);
    // } 
    // if(/\#\#if/igm.test(tmpl)) {
    //     tmpl = p.parseif(tmpl, obj);
    // }
    // if(/\#\#\-/igm.test(tmpl)) {
    //     tmpl = p.parseStatement(tmpl, obj);
    // } 
    // if(/\{\{/gm.test(tmpl)){
    //     tmpl = p.parseVar(tmpl, obj);
    // } 
    console.log('tmpl', tmpl);
    return tmpl;
};

const parser = {
    parserVar: function(tmpl, obj) {
        var temp = '';
        for(let i=0; i<obj.length; i++) {
            for(let j in obj[i]) {
                temp += tmpl.replace(new RegExp('\{\{' + j + '\}\}', 'igm'), obj[i][j]);
            }
        }
        return temp;
    },
    parserIf: function(tmpl, obj) {
    
    },
    parserFor: function(tmpl, obj) {
        var str = [], temp = '',
            pattern = /(<.*>)?\s*##for.*\{\s*(.*)\s*\}##\s*(<.*>)?/igm,
            split;
        
        split = pattern.exec(tmpl);
        // for(let i=1; i<split.length; i++) {
        //     if(i !== 1 && i !== split.length-1) { 
        //         temp += this.parserVar(split[i], obj);
        //         continue;
        //     }
        //     temp += split[i];
        // }
        return temp;
    },
    parseStatement: function(tmpl, obj) {

    },
    removeTrim: function(tmpl) {
        return tmpl.replace(/\s*/gm, '');
    },
    getMethodFn: function(method, args) {
        return this[method](args);
    },
    method: function(base, change, type = 'camel', split = '', args = []) {
        console.log(this.getMethodName(base, change, type, split));
        return this.getMethodFn(this.getMethodName(base, change, type, split), args);
    },
    getMethodName: function(base, change, type, s) {
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
    }
};





