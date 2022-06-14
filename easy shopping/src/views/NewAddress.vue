<template>
  <div class="new-address">
    <van-nav-bar
      :title="isEdit ? '编辑地址' : '新增地址'"
      left-arrow
      :fixed="true"
      @click-left="back"
    />

    <van-address-edit
      :show-delete="isEdit"
      :show-postal="false"
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
      isEdit: false
    };
  },

  created() {
    //获取aid
    this.aid = this.$route.query.id;
    this.isEdit = this.$route.query.isEdit;
     
    if (this.aid) {
      this.getAddressDataByAid();
    }
  },

  methods: {
    //返回地址管理
    back() {
      this.$router.go(-1);
    },
    //生成随机id
    setRandomId(num) {
      var len = num || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },

    //新增地址
    newAddress(address) {
      address.id = this.setRandomId(10);
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

      this.$router.go(-1);
    },

    //编辑地址
    editAddress(content) {
    
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
        let id = this.$route.query.id;

        let address = JSON.parse(localStorage.getItem("address"));
        address.map((v, i) => {
          if (v.id == id) {
            address.splice(i, 1, content);
          }
          return;
        });
        localStorage.setItem("address", JSON.stringify(address));

        // this.$router.push({ name: "Address" });
        //  
        this.$router.go(-1)
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
      address.forEach(v => {
        if(v.id == this.aid){
          this.addressInfo = v;
        }
      });
       
    },

    //删除地址
    removeAddress() {
      let address = JSON.parse(localStorage.getItem("address"));
      address.map((v, i) => {
        if (v.id == this.aid) {
          address.splice(i, 1);
        }
      });
      localStorage.setItem("address", JSON.stringify(address));
      this.$router.push({ name: "Address" });
    },
  },
};
</script>
