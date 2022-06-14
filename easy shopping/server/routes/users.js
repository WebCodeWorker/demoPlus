const express = require("express");
const router = express.Router();
const $conf = require("../conf/conf");
const mysql = require("mysql");
const { query } = require("express");
const path = require("path");
const multer = require("multer");
const { resolve } = require("path");
const { fstat } = require("fs");
const fs = require("fs");
// 使用连接池
const pool = mysql.createPool($conf.mysql);

//查询所有当前用户的订单
router.get("/queryAllOrder", (req, res, next) => {
  let sql = `SELECT * FROM orders where token="${req.query.token}"`;
   
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

//创建订单
router.get("/createOrder", (req, res, next) => {
  let sql = `SELECT * FROM goods where id = '${req.query.goods_id}'`;
  new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(result);
      }
    });
  })
    .then((data) => {
      let sqlStr = `insert into orders(token,goods_id,goods_name,goods_image_url,price,mall_name,state,count) values ('${req.query.token}','${req.query.goods_id}','${data[0].goods_name}','${data[0].goods_image_url}','${data[0].price}','${data[0].mall_name}','1','${req.query.count}')`;
      pool.query(sqlStr, (err, result) => {
        if (err) {
          console.log("err.message:",err.message);
        } 
      });
      //销量+1
      let saleSql = `update goods set sales_tip=sales_tip+1 where id='${req.query.goods_id}'`
      pool.query(saleSql)
      res.json({
        status: "1",
        result: data,
      });
    })
    .catch((e) => {
     console.log("eeeeeeeeeeeee",e)
    });
});
//修改订单(确认收货)
router.post("/update", (req, res, next) => {
  let sql = `UPDATE orders SET state = 2 WHERE order_id = '${req.query.order_id}'`;
   
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        result: "ok",
      });
    }
  });
});
//删除订单
router.post("/delete", (req, res, next) => {
  let sql = `DELETE FROM orders WHERE order_id = '${req.query.order_id}'`;
   
  pool.query(sql, (err, result) => {
    if (err) {
      res.json({
        status: "-1",
        msg: err.message,
      });
    } else {
      res.json({
        status: "1",
        result: "ok",
      });
    }
  });
});

//写评论
const createFolder = function (folder) {
  try {
    //判断该文件是否能读取
    fs.accessSync(folder);
  } catch (e) {
    //不能读取则新建文件
    fs.mkdirSync(folder);
  }
};
//保存图片
// const uploadFolder = "../public/images";
const uploadFolder = "../../dist/img/comment_pic";
createFolder(uploadFolder);
// 通过 filename 属性定制
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // 保存的路径
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳 + 后缀名
    let fileFormat = file.originalname.split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/writeComment", upload.array("avatar", 6), (req, res, next) => {
  let comment_pic = "";
   
  if (req.files.length > 1) {
    req.files.forEach((v, i) => {
      if (i != req.files.length - 1) {
        comment_pic += v.filename + ",";
      } else {
        comment_pic += v.filename;
      }
    });
  }
  if (req.files.length == 1) {
    comment_pic = req.files[0].filename;
  }
  new Promise((resolve, reject) => {
    // 创建评论
    const writeSql = `insert into evaluation(goods_id,user_name,header_url,comment,comment_pic,score) values('${req.query.goods_id}','${req.query.user_name}','${req.query.header_url}','${req.query.comment}','${comment_pic}','${req.query.score}')`;
    pool.query(writeSql, (err, result) => {
      if (err) {
        res.json({
          status: "-1",
          msg: err.message,
        });
         
      } else {
         console.log("创建评论")
        resolve(result);
      }
    });
    //修改订单评论状态
    const sql = `UPDATE orders SET isComment = 1 WHERE order_id = '${req.query.order_id}'`;
    pool.query(sql, (err, result) => {});
  })
    .then((val) => {
      new Promise((resolve, reject) => {
        //获取该商品评分（取该商品所有评分的平均价值）
        const evalSql = `select round((sum(case when score > 3 then 1 else 0 end)/count(1))*100) percent from evaluation where goods_id ='${req.query.goods_id}'`;
        // let arr = [];
        pool.query(evalSql, (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result);
          }
        });
        return val
      }).then((response) => {
        //修改评分
        const updateScoreSql = `UPDATE goods SET favorable_rate ='${response[0].percent}' WHERE id = '${req.query.goods_id}'`;
        pool.query(updateScoreSql, (err, result) => {});
         //修改goods评分总数
         const updateCount = `update goods a , (select goods_id,count(1) cnt from evaluation group by goods_id )b set a.comment_count=b.cnt where a.id=b.goods_id`;
         pool.query(updateCount, (err, result) => {});
          res.json({
            status: "1",
            msg: "",
            result: val,
        });
        console.log("创建订单结束",val)
      });
    })
    .catch((e) => {
      res.json({
        status: "-1",
        msg: e,
      });
    });
});

//查询该商品相关评论
router.get("/queryGoodsComment", (req, res, next) => {
  let sql = `SELECT * FROM evaluation where goods_id="${req.query.goods_id}" ORDER BY creat_time ${req.query.sort}`;
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
console.log("项目启动成功-0----------------------------")
module.exports = router;
