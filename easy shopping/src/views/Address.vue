<template>
  <div class="my-address">
    <van-nav-bar title="地址管理" left-arrow :fixed="true" @click-left="back" />
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      @add="newAddress"
      @edit="editAddress"
    />
  </div>
</template>

<script>
import "../assets/less/address.less";

export default {
  data() {
    return {
      //选择地址的id
      chosenAddressId: "",

      //地址列表数据
      list: [],
    };
  },

  created() {
    //查询收货地址
    this.getReceiveAddress();
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //查询收货地址
    getReceiveAddress() {
      //获取token字符串
      // let tokenString = localStorage.getItem('CSTK');
      // if (!tokenString) {
      //   return;
      // }

      let address = JSON.parse(localStorage.getItem("address"));
      if (address) {
        address.map((v) => {
          let address = v.province + v.city + v.county + v.addressDetail;
          this.list.push({
            id: v.id,
            name: v.name,
            tel: v.tel,
            address,
            isDefault: Boolean(v.isDefault),
          });
        });
      }
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    //编辑地址
    editAddress(item) {
       
      this.$router.push({
        name: "NewAddress",
        query: { id: item.id, isEdit: true },
      });
    },
  },
};
</script>
