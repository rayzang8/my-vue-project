/**
 * Created by ray.zang on 2016/3/17.
 */
import Vue from 'vue'
import ajax from 'vue-resource'

Vue.use(ajax);
const host = '/static/json/';

export default {
    ajax: function (query, vueObject) {
        if (vueObject) {
            vueObject.loading = true;
        }
        return Vue.http.get(host + query.url, Object.assign({
            device: 'Android'
        }, query.params));
    },

    /**
     *设置cookie
     */
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires;
    },

    /**
     *获取cookie
     */
    getCookie: function (cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
        }
        return '';
    },
    /**
     *清除cookie
     */
    clearCookie: function (name) {
        this.setCookie(name, '', -1);
    },

    /**
     * 获取日期字符串（yyyy-MM-dd）
     * @param 与当天相差的天数 {number}
     * @return {string}
     */
    getDateString: function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);// 获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;// 获取当前月份的日期
        var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
        return y + '-' + m + '-' + d;
    },

    isObject: function (obj) {
        if (obj.constructor === Object && typeof obj === 'object') {
            return true;
        } else {
            return false;
        }
    }

}

