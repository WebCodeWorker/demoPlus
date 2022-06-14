<template>
  <div class="new-address">
    <van-nav-bar :title="aid ? '编辑地址' : '新增地址'" left-arrow :fixed="true" @click-left="back" />

    <van-address-edit
      show-postal
      :show-delete="aid"
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      :area-list="areaList"
      :tel-maxlength="11"
      :address-info="addressInfo"
      @save="saveAddress"
      @delete="removeAddress"
    />
  </div>
</template>

<script>
import "../assets/less/newAddress.less";
import areaList from "../assets/js/arealist";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      areaList,
      //地址数据初始值
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false,
      },

      aid: "",
    };
  },

  created() {
    //获取aid
    this.aid = this.$route.query.aid;

    if (this.aid) {
      this.getAddressDataByAid();
    }
  },

  methods: {
    //返回地址管理
    back() {
      this.$router.push({ name: "Address" });
    },

    //新增地址
    newAddress(address) {
      

      //  判断本地是否有数据
      let isData = JSON.parse(localStorage.getItem("address"));
      
      if (isData == null) {
        //存储json数据
        let data = [];
        localStorage.setItem("address", JSON.stringify(data));
      }

      //当需要添加、更新数据，获取本地json、解析、编辑，再放回本地
      let content = Object.assign({}, address);
      let datas = JSON.parse(localStorage.getItem("address"));
      
      datas.unshift(content);
      
      
      localStorage.setItem("address", JSON.stringify(datas));

      this.$toast.success("新增地址成功");

      this.$router.push({name:"Shopbag"});
    },

    //编辑地址
    editAddress(content) {
      //获取token字符串
      // let tokenString = localStorage.getItem("CSTK");
      // if (!tokenString) {
      //   return this.$router.push({ name: "Login" });
      // }
      //判断地址是否被修改
      
      let isModify = false;
      for (let key in this.addressInfo) {
        if (this.addressInfo[key] != content[key]) {
          //已经被修改
          isModify = true;
          break;
        }
      }

      if (isModify) {
        //修改地址
        let tel = this.$route.query.tel;

        let address = JSON.parse(localStorage.getItem("address"));
        address.map((v,i) => {
          if (v.tel == tel) {
            address.splice(i,1,content);
          }
          return;
        });
       localStorage.setItem("address",JSON.stringify(address))

        this.$router.push({ name: "Address" });
      }
    },

    //保存地址
    saveAddress(address) {
      if (this.aid) {
        //编辑地址
        this.editAddress(address);
        
      } else {
        this.newAddress(address);
      }
    },

    //根据aid查询地址数据
    getAddressDataByAid() {
      let address = JSON.parse(localStorage.getItem("address"));
      let tel = this.$route.query.tel;
      
      address.map((v) => {
        if (v.tel == tel) {
          for (let key in this.addressInfo) {
            if (key == "id") {
              this.addressInfo[key] = address[0].aid;
              continue;
            }

            this.addressInfo[key] =
              key == "isDefault" ? Boolean(address[0][key]) : address[0][key];
          }
        }
        return;
      });
    },

    //删除地址
    removeAddress() {
     
      let address = JSON.parse(localStorage.getItem("address"));
      let tel = this.$route.query.tel;
      address.map((v,i)=>{
        if(v.tel == tel){
          address.splice(i,1)
        }
      })
      localStorage.setItem("address",JSON.stringify(address))
      this.$router.push({ name: "Address" });
    },
  },
};
</script>
