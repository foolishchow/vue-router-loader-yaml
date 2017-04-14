var assert = require('assert');
var loader = require('../')
describe('common', function() {
    it('should return an config of vue-router', function() {
        var result = loader(`
            index:
                path: /
                component: ./platform/system/index/index.vue
            userList:
                path: /users
                component: ./platform/system/users/user.vue
                lazy:  system
        `);
        assert(result != '');
    });
});
describe('lazyload', function() {
    it('should lazy load an router with an given Name', function() {
        var result = loader(`
            index:
                path: /
                component: ./platform/system/index/index.vue
            userList:
                path: /users
                component: ./platform/system/users/user.vue
                lazy:  system
        `);
        var lazy = result.indexOf(`const userList = r=>require.ensure([],()=>r(require('./platform/system/users/user.vue')),'system');`)>-1;
        if(lazy) lazy = result.indexOf(`import index from './platform/system/index/index.vue';`)>-1
        if(!lazy) console.error(`
didn't lazy load an router with an given Name
result:
    ${result}
        `)
        assert(lazy);
    });
});

describe('Nested router', function() {
    it('should resolve Nested router', function() {
        var result = loader(`
            index:
                path: /
                component: ./platform/system/index/index.vue
                children:
                    userList:
                        path: /users
                        component: ./platform/system/users/index.vue
                        lazy:  system
                    testList:
                        path: /test
                        component: ./platform/system/test/index.vue
                        lazy:  system
        `);
        assert(result.indexOf('children')>-1);
    });
});
describe('lazyload extends and overwrited', function() {
    it('should extends or overwrited lazyload from parent', function() {
        var result = loader(`
        index:
            path: /
            component: ./platform/system/index/index.vue
            lazy: base
            children:
                users:
                    path: /users
                    component: ./platform/system/users/index.vue
                    lazy:  False
                testList:
                    path: /test
                    component: ./platform/system/test/index.vue
                    lazy:  system
                mainList:
                    path: /main
                    component: ./platform/system/main/index.vue
            `);
        var extend = result.indexOf(`const index = r=>require.ensure([],()=>r(require('./platform/system/index/index.vue')),'base');`) >-1;
        if(extend) extend = result.indexOf(`import users from './platform/system/users/index.vue';`)>-1;
        if(extend) extend = result.indexOf(`const testList = r=>require.ensure([],()=>r(require('./platform/system/test/index.vue')),'system');`)>-1;
        if(extend) extend = result.indexOf(`const mainList = r=>require.ensure([],()=>r(require('./platform/system/main/index.vue')),'base');`)>-1;
        assert(extend);
    });
});
describe('conflict keys', function() {
    it('should resolve conflict keys in deffrence levels', function() {
        var result = loader(`
        index:
            path: /
            component: ./platform/system/index/index.vue
            children:
                index:
                    path: /users
                    component: ./platform/system/users/index.vue
                    lazy:  system
                testList:
                    path: /test
                    component: ./platform/system/test/index.vue
                    lazy:  system
            `);
        assert(result.indexOf('index$1')>-1);
    });
});



