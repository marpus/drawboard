var assert = require('assert');
import parser from '../comm/string-parser';
// 一层对象
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
// 两层对象
const objTwo = {
    a: 'a',
    b: {
        aa: true
    }
};
const unTwoA = {
    tmpl: '<ul>\
                ##if(b.aa) {\
                <li>b.aa</li>\
                }##\
            </ul>',
    res: '<ul><li>b.aa</li></ul>'
};
const unTwoObjA = {
    tmpl: '<ul>\
                ##if(obj.b.aa) {\
                <li>obj.b.aa</li>\
                }##\
            </ul>',
    res: '<ul><li>obj.b.aa</li></ul>'
};
const unTwoThisA = {
    tmpl: '<ul>\
                ##if(this.b.aa) {\
                <li>this.b.aa</li>\
                }##\
            </ul>',
    res: '<ul><li>this.b.aa</li></ul>'
};
const unTwoAA = {
    tmpl: '<ul>\
                ##if(a.aa) {\
                <li>a.aa</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const unTwoObjAA = {
    tmpl: '<ul>\
                ##if(obj.a.aa) {\
                <li>obj.a.aa</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const unTwoThisAA = {
    tmpl: '<ul>\
                ##if(this.a.aa) {\
                <li>this.a.aa</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const wTwoA = {
    tmpl: '<ul>\
                ##if({{b.aa}}) {\
                <li>{{b.aa}}</li>\
                }##\
            </ul>',
    res: '<ul><li>{{b.aa}}</li></ul>'
};
const wTwoObjA = {
    tmpl: '<ul>\
                ##if({{obj.b.aa}}) {\
                <li>{{obj.b.aa}}</li>\
                }##\
            </ul>',
    res: '<ul><li>{{obj.b.aa}}</li></ul>'
};
const wTwoThisA = {
    tmpl: '<ul>\
                ##if({{this.b.aa}}) {\
                <li>{{this.b.aa}}</li>\
                }##\
            </ul>',
    res: '<ul><li>{{this.b.aa}}</li></ul>'
};
const wTwoAA = {
    tmpl: '<ul>\
                ##if({{a.aa}}) {\
                <li>{{a.aa}}</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const wTwoObjAA = {
    tmpl: '<ul>\
                ##if({{obj.a.aa}}) {\
                <li>{{obj.a.aa}}</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const wTwoThisAA = {
    tmpl: '<ul>\
                ##if({{this.a.aa}}) {\
                <li>{{this.a.aa}}</li>\
                }##\
            </ul>',
    res: '<ul></ul>'
};
const TwoAorAA = {
    tmpl: '<ul>\
            ##if({{obj.b.aa}}) {\
                <li>{{obj.b.aa}}</li>\
            }##\
            ##if({{c.aa}}) {\
                <li>{{c.aa}}</li>\
            }##\
            ##if(a.aa) {\
                <li>a.aa</li>\
            }##\
            ##if({{this.a.aa}}) {\
                <li>{{this.a.aa}}</li>\
            }##\
            ##if({{this.b.aa}}) {\
                <li>{{this.b.aa}}</li>\
            }##\
            ##if({{b.aa}}) {\
                <li>{{b.aa}}</li>\
            }##\
            ##if({{obj.a.aa}}) {\
                <li>{{obj.a.aa}}</li>\
            }##\
            ##if(obj.b.aa) {\
                <li>obj.b.aa</li>\
            }##\
            ##if(b.aa) {\
                <li>b.aa</li>\
            }##\
            ##if(this.b.aa) {\
                <li>this.b.aa</li>\
            }##\
            ##if(obj.a.aa) {\
                <li>obj.a.aa</li>\
            }##\
            ##if(this.a.aa) {\
                <li>this.a.aa</li>\
            }##\
        </ul>',
        res: '<ul><li>{{obj.b.aa}}</li><li>{{this.b.aa}}</li><li>{{b.aa}}</li><li>obj.b.aa</li><li>b.aa</li><li>this.b.aa</li></ul>'
};
describe('parser', function() {
  describe('just if => parserIf', function() {
    // it('condition of if is a or obj.a or this.a', function() {
    //     assert.equal(parser(unA.tmpl, objOne), unA.res);
    //     assert.equal(parser(unObjA.tmpl, objOne), unObjA.res);
    //     assert.equal(parser(unThisA.tmpl, objOne), unThisA.res);
    // });
    // it('condition of if is aa or obj.aa or this.aa', function() {
    //     assert.equal(parser(unAA.tmpl, objOne), unAA.res);
    //     assert.equal(parser(unObjAA.tmpl, objOne), unObjAA.res);
    //     assert.equal(parser(unThisAA.tmpl, objOne), unThisAA.res);
    // });
    // it('condition of if is {{a}} or {{obj.a}} or {{this.a}}', function() {
    //     assert.equal(parser(wA.tmpl, objOne), wA.res);
    //     assert.equal(parser(wObjA.tmpl, objOne), wObjA.res);
    //     assert.equal(parser(wThisA.tmpl, objOne), wThisA.res);
    // });
    // it('condition of if is {{aa}} or {{obj.aa}} or {{this.aa}}', function() {
    //     assert.equal(parser(wAA.tmpl, objOne), wAA.res);
    //     assert.equal(parser(wObjAA.tmpl, objOne), wObjAA.res);
    //     assert.equal(parser(wThisAA.tmpl, objOne), wThisAA.res);
    // });
    // it('condition of if is all', function() {
    //     assert.equal(parser(AorAA.tmpl, objOne), AorAA.res);
    // });
    // it('condition of if is b.aa or obj.b.aa or this.b.aa', function() {
    //     assert.equal(parser(unTwoA.tmpl, objTwo), unTwoA.res);
    //     assert.equal(parser(unTwoObjA.tmpl, objTwo), unTwoObjA.res);
    //     assert.equal(parser(unTwoThisA.tmpl, objTwo), unTwoThisA.res);
    // });
    // it('condition of if is a.aa or obj.a.aa or this.a.aa', function() {
    //     assert.equal(parser(unTwoAA.tmpl, objTwo), unTwoAA.res);
    //     assert.equal(parser(unTwoObjAA.tmpl, objTwo), unTwoObjAA.res);
    //     assert.equal(parser(unTwoThisAA.tmpl, objTwo), unTwoThisAA.res);
    // });
    // it('condition of if is {{b.aa}} or {{obj.b.aa}} or {{this.b.aa}}', function() {
    //     assert.equal(parser(wTwoA.tmpl, objTwo), wTwoA.res);
    //     assert.equal(parser(wTwoObjA.tmpl, objTwo), wTwoObjA.res);
    //     assert.equal(parser(wTwoThisA.tmpl, objTwo), wTwoThisA.res);
    // });
    // it('condition of if is {{a.aa}} or {{obj.a.aa}} or {{this.a.aa}}', function() {
    //     assert.equal(parser(wTwoAA.tmpl, objTwo), wTwoAA.res);
    //     assert.equal(parser(wTwoObjAA.tmpl, objTwo), wTwoObjAA.res);
    //     assert.equal(parser(wTwoThisAA.tmpl, objTwo), wTwoThisAA.res);
    // });
    // it('condition of if is all of two floors', function() {
    //     assert.equal(parser(TwoAorAA.tmpl, objTwo), TwoAorAA.res);
    // });
  });
});