<template>
  <mask v-if="loading"></mask>
  <div id="app">
    <div class="gallary">
      <div id="wrapper">
        <div id="cover">
          <div class="content">
            <div class="selection">
              <ul>
                <li class="woman" v-bind:class="{enable:isWoman}" v-touch:tap="genderChange('woman')">
                  <a>女士</a>
                </li>
                <li class="man" v-bind:class="{enable:!isWoman}" v-touch:tap="genderChange('man')">
                  <a>男士</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="title">
            <div class="letters">{{mainTitle}}</div>
            <div class="praise" v-bind:class="{hl:praised,pulse:praised}" v-touch:tap="hintPraise">
              <span>{{praiseCount}}</span></div>
            <div class="bLine"></div>
          </div>
          <div class="info"><img id="ci1" v-bind:src="coverImg"></div>
          <div class="tail">
            <template v-if="list.length > 0">
              <div class="his">
                <div style="width: 37%">
                  <hr/>
                </div>
                <div style="width: 26%;font-size: 12px;color: #444">最近推荐</div>
                <div style="width: 37%">
                  <hr/>
                </div>
              </div>
              <div class="pah">
                <template v-if="list[1]">
                  <a v-link="{path:'/info',name:'date',params:{dateStr: appendUrl(list[1].dateTime),genderStr:gender}}"
                     class="hisfig">
                    <div class="thumbnail"><img id="ci2" v-bind:src=" list[1].content[0] "/></div>
                    <div class="old">{{list[1].title}}</div>
                  </a>
                </template>
                <template v-if="list[2]">
                  <a v-link="{path:'/info',name:'date',params:{dateStr: appendUrl(list[2].dateTime),genderStr:gender}}"
                     class="hisfig">
                    <div class="thumbnail"><img v-bind:src=" list[2].content[0] "/></div>
                    <div class="old">{{list[2].title}}</div>
                  </a>
                </template>
                <template v-else>
                  <a></a>
                </template>
              </div>
            </template>
            <div class="morerec">
              <a v-touch:tap="showMore">
                <img src="../assets/imgs/icon_gengduotuijian.png"/>
              </a>
            </div>
            <div class="last">
              <div style="width: 25%">
                <hr/>
              </div>
              <div style="width: 50%;font-size: 12px;color: #98989f;">
                &nbsp;·&nbsp;推荐内容来自XXXXAPP&nbsp;·&nbsp;</div>
              <div style="width: 25%">
                <hr/>
              </div>
            </div>
            <!--<router-view></router-view>-->
          </div>
        </div>
      </div>
    </div>
    <div class="fc" v-bind:style="bgImg"></div>
  </div>
</template>
<!-- 引入外部css -->
<style src="../assets/css/zuida.less" lang="less"></style>

<script>
  import Vue from 'vue'
  import Mask from './Mask.vue'
  import Utils from '../Utils.js'
  import VueTouch from 'vue-touch'
  import IScroll from 'iscroll'

  Vue.use(VueTouch);

  var myScroll;
  var mainReady = false;
  var asideReady = false;
  var manDate = null;
  var womanDate = null;

  var computePageH = function () {
    mainReady = false;
    asideReady = false;
    document.querySelector('#wrapper').style.height = document.querySelector('.fc').offsetHeight + 'px';
    myScroll = new IScroll('#wrapper', {
      preventDefault: false,
      preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/}
    });
//        myScroll.refresh();
    myScroll.scrollTo(0, 0, 800, IScroll.utils.ease.elastic);
    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
  };
  var imgMainReady = function (imgObj, asideImgObj) {
    if (imgObj.complete) {
      mainReady = true;
      if (asideReady || asideImgObj === null) {
        computePageH();
      }
    } else {
      imgObj.onload = function () {
        mainReady = true;
        if (asideReady || asideImgObj === null) {
          computePageH();
        }
      };
    }
  };
  var imgAsideReady = function (imgObj) {
    if (imgObj) {
      if (imgObj.complete) {
        asideReady = true;
        if (mainReady) {
          computePageH();
        }
      } else {
        imgObj.onload = function () {
          asideReady = true;
          if (mainReady) {
            computePageH();
          }
        };
      }
    }
  };

  var queryList = {
    url: 'queryBestMatchInfo.json',
    params: {
      'limit': 6,
      'currDate': Utils.getDateString(0)
    },
    success: function (res) {
      let randomIndex = parseInt(27 * Math.random());
      this.list = res.data.slice(randomIndex, randomIndex + 3);
      this.mainImages = this.list[0]['content'];
      this.mainTitle = this.list[0]['title'];
      this.postId = this.list[0]['postId'];
      this.praiseStatus = parseInt(this.list[0]['praiseStatus']);
      if (this.gender === 'woman') {
        womanDate = res.data[0]['dateTime'];
      } else {
        manDate = res.data[0]['dateTime'];
      }
      var self = this;
      Vue.nextTick(function () {
        imgMainReady(document.querySelector('#ci1'), document.querySelector('#ci2'));
        imgAsideReady(document.querySelector('#ci2'));
        self.loading = false;
      });
      if (!Utils.getCookie('gender')) {
        Utils.setCookie('gender', this.gender, 365);
      }
    }
  };

  var queryPraise = {
    url: 'queryBestMatchPraiseCount.json',
    params: {}
  };

  export default {
    created: function () {
      this.gender = Utils.getCookie('gender') || this.gender;
    },
    ready: function () {
      console.warn('I am ready!')
    },
    data: function () {
      return {
        gender: 'woman',
        list: [],
        mainImages: [],
        mainTitle: '',
        postId: null,
        praiseStatus: 0,
        praiseCount: 0,
        loading: false
      }
    },
    components: {Mask},
    methods: {
      genderChange: function (gd) {
        if (gd !== this.gender) {
          this.gender = gd;
          console.dir(this.$route)
          this.$route.router.go({
            path: '/info',
            name: 'date',
            params: {dateStr: this.appendUrl(), genderStr: this.gender}
          });
        }
      },
      showMore: function () {
        this.$route.router.go({
          path: '/list',
          name: 'currDate',
          params: this.$route.router.params || {dateStr: this.appendUrl(), genderStr: this.gender}
        });
      },
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
      hintPraise: function () {
        var self = this;
        console.warn('占赞');
        Utils.ajax({
          url: 'saveBestMatchPraiseInfo.json',
          params: {postId: self.postId, isPraise: self.praiseStatus}
        }).then(function (res) {
          self.praiseStatus === 0 ? self.praiseStatus = 1 : self.praiseStatus = 0;
        }).catch(function onRejected (error) {
          console.warn(error);
        });
      }
    },
    computed: {
      isWoman: function () {
        return this.gender === 'woman';
      },
      praised: function () {
        return this.praiseStatus > 0;
      },
      bgImg: function () {
        return 'background:url(' + this.mainImages[0] + ') 50% 0% / 100% no-repeat';
      },
      coverImg: function () {
        return this.mainImages[1];
      }
    },
    route: {
      data: function (transition) {
        var self = this;
        if (transition.to.params.genderStr) {
          queryList.params.sexType = transition.to.params.genderStr;
          if (transition.to.params.genderStr !== this.gender) {
            this.gender = transition.to.params.genderStr;
            Utils.setCookie('gender', this.gender, 365);
          }
        } else {
          queryList.params.sexType = this.gender || Utils.getCookie('gender');
        }
        if (queryList.params.sexType === 'woman') {
          queryList.params.currDate = transition.to.params.dateStr ? JSON.parse(transition.to.params.dateStr)[1] : Utils.getDateString(0);
          womanDate = queryList.params.currDate;
          manDate = transition.to.params.dateStr ? JSON.parse(transition.to.params.dateStr)[0] : Utils.getDateString(0);
        } else {
          queryList.params.currDate = transition.to.params.dateStr ? JSON.parse(transition.to.params.dateStr)[0] : Utils.getDateString(0);
          manDate = queryList.params.currDate;
          womanDate = transition.to.params.dateStr ? JSON.parse(transition.to.params.dateStr)[1] : Utils.getDateString(0);
        }
        Utils.ajax(queryList, this).then(function (res) {
          if (res.data.data instanceof Array && res.data.data.length > 0) {
            queryList.success.call(self, res.data);
//                    return Promise.resolve('888888888');  // Promise.resolve() 方法把值传给之后的then方法
//                    return '7777777777';  // return 方法把值传给之后的then方法
            queryPraise.params.postId = self.postId;
            queryPraise.params.sexType = self.gender;
            return Utils.ajax(queryPraise);
          } else {
            return Promise.reject(new Error('出错了,返回的数组为空！'));
          }
        }).then(function (res2) {
          self.praiseCount = res2.data.data.praiseCount;
        }).catch(function onRejected (error) {
          console.warn(error);
        });
        transition.next();
      },
      activate: function (transition) {
        transition.next()
      },
      deactivate: function (transition) {
        transition.next()
      }
    }
  }
</script>

