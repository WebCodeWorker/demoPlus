import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'lib-flexible/flexible'
import VueLazyload from 'vue-lazyload'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts

Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('./assets/images/loading.gif'),
  attempt: 1
})

import{
  NavBar,
  Tabbar, 
  TabbarItem,
  Search,
  Tab, 
  Tabs,
  Toast,
  Icon,
  Grid, 
  GridItem,
  DropdownMenu, 
  DropdownItem,
  Cell,
  Popup,
  Field,
  Button,
  Tag,
  ShareSheet,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  ActionSheet,
  Swipe, 
  SwipeItem,
  Lazyload,
  Skeleton,
  Rate,
  Empty,
  Checkbox, 
  CheckboxGroup,
  Form,
  Stepper,
  SwipeCell,
  SubmitBar,
  AddressList,
  AddressEdit,
  Area,
  Uploader,
  Overlay
} from 'vant'

Vue
  .use(NavBar)
  .use(Tabbar)
  .use(TabbarItem)
  .use( Search)
  .use(Tab)
  .use(Tabs)
  .use(Toast)
  .use(Icon)
  .use(Grid)
  .use(GridItem)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Cell)
  .use(Popup)
  .use(Field)
  .use( Button)
  .use(Tag)
  .use(ShareSheet)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(ActionSheet)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Skeleton)
  .use(Rate)
  .use(Empty)
  .use(Form)
  .use(Checkbox, CheckboxGroup)
  .use(Stepper)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(AddressList)
  .use(AddressEdit)
  .use(Area)
  .use(Uploader)
  .use(Overlay)
Vue.use(VueAxios, axios)
//设置请求基础路径
axios.defaults.baseURL = 'https://route.showapi.com';

//设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//添加一个Vue的原型属性
Vue.prototype.showapi_appid = '346578'
Vue.prototype.secret = 'b462a95f21eb4676b0845008e9d276f0';

//全局注册过滤器, 一般用于格式化数据
Vue.filter('formatDate', (value, format) => {
  //value: 需要格式化的数据
  //format: 指定格式 yyyy-MM-dd hh:mm:ss

  //  

  let date = new Date(value);

  //获取年份
  let year = date.getFullYear();
  //  
  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    let content = RegExp.$1;
    //  
    format = format.replace(content, year.toString().slice(4 - content.length));

    //  
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in o) {
    //构造动态正则
    let reg = new RegExp(`(${key}+)`);
    //  
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      //  
      let k =  o[key] >= 10 ? o[key] : content.length == 2 ? '0' + o[key] : o[key];
      //  
      format = format.replace(content, k);
      //  
    }
  }

  return format;
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
