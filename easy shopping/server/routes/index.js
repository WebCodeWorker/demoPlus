var express = require("express");
var router = express.Router();
var $conf = require("../conf/conf");
const mysql = require("mysql");
// 使用连接池
var pool = mysql.createPool($conf.mysql);

//查询热门商品
router.get("/hotData", (req, res, next) => {
  var sql = `SELECT * FROM goods`;
   
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      let item = [];
      let hotArr = [];

      //  //综合排序分：价格*(-0.1)+销量*0.6+好评率*0.5
      //  result.forEach((v) => {
      //   v.weighted_average_score =
      //     v.price * 0.1 * -1 + v.sales_tip * 0.6 + v.favorable_rate * 0.5;
      // });
      // //取综合排序分前十的商品
      // result = result.sort((a, b) => {
      //   return b.weighted_average_score - a.weighted_average_score;
      // }).slice(0,10);
      result.map((v) => {
        if (!item[v.type]) {
          let arr = [];
          arr.push(v);
          item[v.type] = arr;
        } else {
          item[v.type].push(v);
        }
      });

      for (var key in item) {
        let obj = {
          type: key,
          info: item[key],
        };
        hotArr.push(obj);
      }
      res.json({
        status: "1",
        msg: "",
        result: hotArr,
      });
    }
  });
});

//按商品名字\类型模糊查询
router.get("/queryByName", (req, res, next) => {
  let sql = `SELECT * FROM goods WHERE CONCAT(IFNULL(goods_name,''),IFNULL(type,''),IFNULL(price,'')) like '%${req.query.keyword}%'`;
   
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        msg: "",
        result: result,
      });
    }
  });
});

//获取所有商品分类
router.get("/queryAllType", (req, res, next) => {
  let sql = `SELECT type FROM goods`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        msg: "",
        result: result,
      });
    }
  });
});
//按商品类型查询
router.get("/queryByType", (req, res, next) => {
  let sql = `SELECT * FROM goods where type = '${req.query.goods_type}'`;
   
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        msg: "",
        result: result,
      });
    }
  });
});

//按商品id查询
router.get("/queryById", (req, res, next) => {
  let param = req.query.id;
  let sql = `SELECT * FROM goods where id = ('${param}')`;
   
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        msg: "",
        result: result,
      });
    }
  });
});

//按商品id查询(支持多个id查询)
router.get("/queryByBatchId", (req, res, next) => {
  let sql = `SELECT * FROM goods where id in (${req.query.id})`;
   
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        msg: "",
        result: result,
      });
    }
  });
});

//按价格查询
router.get("/queryByPrice", (req, res, next) => {
  let sql = `SELECT * FROM goods where price >='${req.query.minPrice}' and price <='${req.query.maxPrice}'`;
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        msg: "",
        result: result,
      });
    }
  });
});


module.exports = router;
