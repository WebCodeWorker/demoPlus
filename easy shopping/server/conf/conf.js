// conf/db.js
// MySQL数据库联接配置
module.exports = {
	mysql: {
		host: 'localhost', 
		user: 'root',
		password: 'root',
		database:'appshop', // 前面建的user表位于这个数据库中
		port: 3306,
		charset:'UTF8_GENERAL_CI'
	}
};