import Vue from 'vue'
import VueRouter from 'vue-router'
// import Info from './Info'

Vue.config.debug = true;

/* eslint-disable no-new */
// new Vue({
//    el: 'body',
//    ready: function () {
//        console.dir('main ready');
//    },
//
//    components: {App}
// })
var App = Vue.extend({});
Vue.use(VueRouter);

var router = new VueRouter();
router.map({
    '/info': {
        //          使用动态加载
        component: function (resolve) {
            require(['./components/Info.vue'], resolve)
        },
        subRoutes: {
//            '/': {
//                component: {
//                    template: ''
//                }
//            },
            '/date/:dateStr/:genderStr': {
                name: 'date', // 给这条路径加上一个名字
                component: {}
            }
        }
    },
    '/list': {
        component: function (resolve) {
            require(['./components/More.vue'], resolve)
        },
        subRoutes: {
            '/currDate/:dateStr/:genderStr': {
                name: 'currDate', // 给这条路径加上一个名字
                component: {}
            }
        }
    }
});

router.start(App, 'body');
