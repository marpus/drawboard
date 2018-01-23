var assert = require('assert');
import parser from '../comm/string-parser';
const objOne = {a: 'a'};
const unA = {
    tmpl: '<ul>\
                ##if(a) {\
                <li>a</li>\
                }##\
            </ul>',
    res: '<ul><li>a</li></ul>'
};
const unObjA = {
    tmpl: '<ul>\
                ##if(obj.a) {\
                <li>obj.a</li>\
                }##\
            </ul>',
    res: '<ul><li>obj.a</li></ul>'
};
const unThisA = {
    tmpl: '<ul>\
                ##if(this.a) {\
                <li>this.a</li>\
                }##\
            </ul>',
    res: '<ul><li>this.a</li></ul>'
};
const unAA = {
    tmpl: '<ul>\
                ##if(aa) {\
                <li>aa</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const unObjAA = {
    tmpl: '<ul>\
                ##if(obj.aa) {\
                <li>obj.aa</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const unThisAA = {
    tmpl: '<ul>\
                ##if(this.aa) {\
                <li>this.aa</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const wA = {
    tmpl: '<ul>\
                ##if({{a}}) {\
                <li>{{a}}</li>\
                }##\
            </ul>',
    res: '<ul><li>{{a}}</li></ul>'
};
const wObjA = {
    tmpl: '<ul>\
                ##if({{obj.a}}) {\
                <li>{{obj.a}}</li>\
                }##\
            </ul>',
    res: '<ul><li>{{obj.a}}</li></ul>'
};
const wThisA = {
    tmpl: '<ul>\
                ##if({{this.a}}) {\
                <li>{{this.a}}</li>\
                }##\
            </ul>',
    res: '<ul><li>{{this.a}}</li></ul>'
};
const wAA = {
    tmpl: '<ul>\
                ##if({{aa}}) {\
                <li>{{aa}}</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const wObjAA = {
    tmpl: '<ul>\
                ##if({{obj.aa}}) {\
                <li>{{obj.aa}}</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const wThisAA = {
    tmpl: '<ul>\
                ##if({{this.aa}}) {\
                <li>{{this.aa}}</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const AorAA = {
    tmpl: '<ul>\
            ##if({{a}}) {\
                <li>{{a}}</li>\
            }##\
            ##if({{obj.a}}) {\
                <li>{{obj.a}}</li>\
            }##\
            ##if({{this.a}}) {\
                <li>{{this.a}}</li>\
            }##\
            ##if(a) {\
                <li>a</li>\
            }##\
            ##if(obj.a) {\
                <li>obj.a</li>\
            }##\
            ##if(this.a) {\
                <li>this.a</li>\
            }##\
            ##if({{aa}}) {\
                <li>{{aa}}</li>\
            }##\
            ##if({{obj.aa}}) {\
                <li>{{obj.aa}}</li>\
            }##\
            ##if({{this.aa}}) {\
                <li>{{this.aa}}</li>\
            }##\
            ##if(aa) {\
                <li>aa</li>\
            }##\
            ##if(obj.aa) {\
                <li>obj.aa</li>\
            }##\
            ##if(this.aa) {\
                <li>this.aa</li>\
            }##\
        </ul>',
        obj: {
            a: 'aaa'
        },
        res: '<ul><li>{{a}}</li><li>{{obj.a}}</li><li>{{this.a}}</li><li>a</li><li>obj.a</li><li>this.a</li></ul>'
};
describe('parser', function() {
  describe('just if => parserIf', function() {
    it('condition of if is a or obj.a or this.a', function() {
        assert.equal(parser(unA.tmpl, objOne), unA.res);
        assert.equal(parser(unObjA.tmpl, objOne), unObjA.res);
        assert.equal(parser(unThisA.tmpl, objOne), unThisA.res);
    });
    it('condition of if is aa or obj.aa or this.aa', function() {
        assert.equal(parser(unAA.tmpl, objOne), unAA.res);
        assert.equal(parser(unObjAA.tmpl, objOne), unObjAA.res);
        assert.equal(parser(unThisAA.tmpl, objOne), unThisAA.res);
    });
    it('condition of if is {{a}} or {{obj.a}} or {{this.a}}', function() {
        assert.equal(parser(wA.tmpl, objOne), wA.res);
        assert.equal(parser(wObjA.tmpl, objOne), wObjA.res);
        assert.equal(parser(wThisA.tmpl, objOne), wThisA.res);
    });
    it('condition of if is {{aa}} or {{obj.aa}} or {{this.aa}}', function() {
        assert.equal(parser(wAA.tmpl, objOne), wAA.res);
        assert.equal(parser(wObjAA.tmpl, objOne), wObjAA.res);
        assert.equal(parser(wThisAA.tmpl, objOne), wThisAA.res);
    });
    it('condition of if is all', function() {
        assert.equal(parser(AorAA.tmpl, objOne), AorAA.res);
    });
  });
});