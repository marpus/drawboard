/**
 * Des String Parser
 * Author Maple Joe
 */

export default (tmpl, obj) => {
    console.log('parser');
    tmpl = `<ul>
                ##for(obj) {
                <li>{{aaa}}</li>
                }##
            </ul>`;
    obj = [
        {
            aaa: 'aaa'
        },
        {
            aaa: 'bbb'
        }
    ];
    if(!tmpl) return; 
    var p = function() {return parser;}();
    if(/\#\#for/.test(tmpl)) {
        tmpl = p.parserFor(tmpl, obj);
    }
    console.log('tmpl', tmpl);
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
    parserIf: function() {
    
    },
    parserFor: function(tmpl, obj) {
        var str = [], temp = '',
            pattern = /(<.*>)?\s*##for.*\{\s*(.*)\s*\}##\s*(<.*>)?/igm;
        
        pattern.test(tmpl);
        for(let i=1; i<4; i++) {
            str[i] = RegExp['$' + i];
            if(i !== 1 && i !== i.length-1) { 
                temp += this.parserVar(str[i], obj);
            } else {
                temp += str[i];
            }
        }
        return temp;
    },
    each: function() {
        
    }
};





