<template>
  <mask v-if="loading"></mask>
  <div class="fixedBar">
    <div class="nav">
      <a data-gender="woman" v-bind:class="{'hl':isWoman}" v-touch:tap="genderChange('woman')">女士</a>
      <a data-gender="man" v-bind:class="{'hl':!isWoman}" v-touch:tap="genderChange('man')">男士</a>
    </div>
    <div class="navhl" v-bind:class="{'man':!isWoman}"></div>
  </div>
  <div class="stopdiv">
    <div class="gallary sec" v-bind:class="{woman:!isWoman}" id="womanGallary" style="overflow-y:auto;"
         data-full="yes">
      <div id="womanWrapper" v-touch:swipeleft="genderChange('man')">
        <div class="reclist">
          <list v-for="item in womanItems" v-bind:item="item" v-bind:date="appendUrl(item.dateTime)"
                v-bind:gender="gender"></list>
        </div>
      </div>
    </div>
    <div class="gallary sec" v-bind:class="{man:isWoman}" id="manGallary" style="overflow-y:auto;" data-full="yes">
      <div id="manWrapper" v-touch:swiperight="genderChange('woman')">
        <div class="reclist">
          <list v-for="item in manItems" v-bind:item="item" v-bind:date="appendUrl(item.dateTime)"
                v-bind:gender="gender"></list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Mask from './Mask.vue'
  import Utils from '../Utils.js'
  import List from './List.vue'
  import VueTouch from 'vue-touch'
  import IScroll from 'iscroll'

  Vue.use(VueTouch);
  var manDate = null;
  var womanDate = null;
  var queryList = {
    url: 'queryBestMatchInfo.json',
    params: {
      'sexType': 'woman',
      'limit': 32,
      'currDate': Utils.getDateString(0)
    },
    success: function (res) {
      var self = this;
      if (this.gender === 'woman') {
        let randomIndex = parseInt(14 * Math.random());
        this.womanItems = res.data.slice(randomIndex, randomIndex + 16);
        Vue.nextTick(function () {
          document.querySelector('#womanWrapper > .reclist').style.height = self.womanItems.length * (10 + document.querySelector('.desc').offsetHeight + document.querySelector('.stopdiv').offsetWidth * 1.06) + 'px';
          var womanWrapper = new IScroll('#womanWrapper', {
            scrollbars: true,
            preventDefault: false,
            preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/}
          });
          console.warn('#woman_' + womanDate);
          scrollToImg(document.querySelector('#woman_' + womanDate + '>img'), womanWrapper, self);
        });
      } else {
        this.manItems = res.data;
        Vue.nextTick(function () {
          document.querySelector('#manWrapper > .reclist').style.height = self.womanItems.length * (10 + document.querySelector('.desc').offsetHeight + document.querySelector('.stopdiv').offsetWidth * 1.06) + 'px';
          var manWrapper = new IScroll('#manWrapper', {
            scrollbars: true,
            preventDefault: false,
            preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/}
          });
          console.warn('#man_' + manDate);
          scrollToImg(document.querySelector('#man_' + manDate + '>img'), manWrapper, self);
        });
      }
      document.addEventListener('touchmove', function (e) {
        e.preventDefault();
      }, false);
    }
  };

  var scrollToImg = function (imgObj, wrapper, vueObject) {
    if (imgObj) {
      if (imgObj.complete) {
        wrapper.scrollToElement(imgObj.parentNode, 500);
        vueObject.loading = false;
      } else {
        imgObj.onload = function () {
          wrapper.scrollToElement(imgObj.parentNode, 500);
          vueObject.loading = false;
        };
      }
    } else {
      vueObject.loading = false;
    }
  };

  var moreVue = Vue.extend({
    created: function () {
      this.gender = Utils.getCookie('gender') || this.gender;
    },
    ready: function () {

    },
    data: function () {
      return {
        manItems: [],
        womanItems: [],
        gender: 'woman',
        loading: false
      }
    },
    components: {List, Mask},
    watch: {
      'manItems': function () {
        console.warn('男士列表更新')
      },
      'womanItems': function () {
        console.warn('女士列表更新')
      }
    },
    computed: {
      isWoman: function () {
        return this.gender === 'woman';
      }
    },
    methods: {
      appendUrl: function (dateStr) {
        if (this.gender === 'woman') {
          let currentDate = womanDate || Utils.getDateString(0);
          if (dateStr) {
            currentDate = dateStr;
          }
          return manDate ? JSON.stringify([manDate, currentDate]) : JSON.stringify([Utils.getDateString(0), currentDate]);
        } else {
          let currentDate = manDate || Utils.getDateString(0);
          if (dateStr) {
            currentDate = dateStr;
          }
          return womanDate ? JSON.stringify([currentDate, womanDate]) : JSON.stringify([currentDate, Utils.getDateString(0)]);
        }
      },
      genderChange: function (gd) {
        if (gd !== this.gender) {
          this.gender = gd;
          queryList.params.sexType = this.gender;

          if (this.gender === 'woman') {
            if (this.womanItems.length > 0) {
              return;
            }
          } else {
            if (this.manItems.length > 0) {
              return;
            }
          }
          this.loading = true;
          var self = this;
          Utils.ajax(queryList).then(function (res) {
            if (res.data.data instanceof Array && res.data.data.length > 0) {
              queryList.success.call(self, res.data);
            } else {
              return Promise.reject(new Error('出错了,返回的数组为空！'));
            }
          }).catch(function onRejected (error) {
            console.warn(error);
          });
        }
      }
    },
    route: {
      data: function (transition) {
        if (transition.to.params.genderStr) {
          queryList.params.sexType = transition.to.params.genderStr;
          if (transition.to.params.genderStr !== this.gender) {
            this.gender = transition.to.params.genderStr;
            Utils.setCookie('gender', this.gender, 365);
          }
        } else {
          queryList.params.sexType = this.gender || Utils.getCookie('gender');
        }
        if (transition.to.params.dateStr) {
          manDate = JSON.parse(transition.to.params.dateStr)[0];
          womanDate = JSON.parse(transition.to.params.dateStr)[1];
        } else {
          manDate = womanDate = Utils.getDateString(0);
        }
        if ((this.gender === 'man' && this.manItems.length > 0) || (this.gender === 'woman' && this.womanItems.length > 0)) {
          return;
        }
        this.loading = true;
        var self = this;
        Utils.ajax(queryList).then(function (res) {
          if (res.data.data instanceof Array && res.data.data.length > 0) {
            queryList.success.call(self, res.data);
          } else {
            return Promise.reject(new Error('出错了,返回的数组为空！'));
          }
        }).catch(function onRejected (error) {
          console.warn(error);
        });
        transition.next();
      }
    }
  });

  export default moreVue
</script>
<!-- 引入外部css -->
<style src="../assets/css/zuida.less" lang="less"></style>
