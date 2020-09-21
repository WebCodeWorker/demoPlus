class Ajax {
    // 1.get请求
    get(url) {
        return new Promise((resolved, rejcted) => {
            //2. 创建ajax对象
            let xhr = new XMLHttpRequest()

            // 3.监听ajax状态变化
            xhr.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    // 凝固结果
                    resolved(this.responseText)
                }
            }
            // 4.建立服务器连接
            xhr.open('get', url, true)

            // 5.发起请求
            xhr.send()

        })
    }
}

// 6. 实例化
let ajax = new Ajax();

let details = document.querySelector(".details")
// 国内疫情
function fn() {

    let box = document.querySelector(".box")
    ajax.get("https://api.tianapi.com/txapi/ncov/index?key=a52f2b277953adf5f9345a730b4c3993").then(result => {
        result = JSON.parse(result)
        console.log(result)
        console.log(result.newslist[0].desc.confirmedIncr)
        let count = `
                    <li>
                        <span>累计确诊</span>
                        <span>${result.newslist[0].desc.confirmedCount}</span>
                        <span>较上日<strong>+${result.newslist[0].desc.confirmedIncr}</strong></span>
                    </li>
                    <li>
                        <span>累计治愈</span>
                        <span style="color:#087c55">${result.newslist[0].desc.curedCount}</span>
                        <span>较上日<strong style="color:#087c55">+${result.newslist[0].desc.curedIncr}</strong></span>
                    </li>
                    <li>
                        <span>累计死亡</span>
                        <span style="color:#656565">${result.newslist[0].desc.deadCount}</span>
                        <span>较上日<strong style="color:#656565">+${result.newslist[0].desc.deadIncr}</strong></span>
                    </li>
                    <li>
                        <span>现有确诊</span>
                        <span style="color:#fb5000">${result.newslist[0].desc.currentConfirmedCount}</span>
                        <span>较上日<strong style="color:#fb5000">+${result.newslist[0].desc.currentConfirmedIncr}</strong></span>
                    </li>
                    <li>
                        <span>境外输入确诊</span>
                        <span style="color:#5b8aac">未知</span>
                        <span>较上日<strong style="color:#5b8aac">+未知</strong></span>
                    </li>
                    <li>
                        <span>现有疑似</span>
                        <span style="color:#ed8100">${result.newslist[0].desc.suspectedCount}</span>
                        <span>较上日<strong style="color:#ed8100">+${result.newslist[0].desc.suspectedIncr}</strong></span>
                    </li>
                `
        let ul = document.createElement("ul");
        ul.className = "count";
        ul.innerHTML = count;
        let count_b = document.querySelector(".count_b");
        count_b.appendChild(ul)

    })

    ajax.get("https://api.tianapi.com/txapi/ncovcity/index?key=a52f2b277953adf5f9345a730b4c3993").then(result => {
        result = JSON.parse(result)
        console.log(result)
        let content_b = document.querySelector(".content_b")

        // let title = `<h3>国内疫情</h3>
        // <dl class="area">
        //     <dd>地区</dd>
        //     <dd>现有确诊</dd>
        //     <dd>累计确诊</dd>
        //     <dd>死亡</dd>
        //     <dd>治愈</dd>
        //     <dt></dt>
        // </dl>`
        // let div = document.createElement("div")
        // div.className = "title"
        // div.innerHeight = title;
        // details.insertBefore(div,content_b)

        for (let k in result.newslist) {
            let div = document.createElement("div")
            div.className = "content"
            let dl = document.createElement("dl")

            let detail_dl = `<dd>${result.newslist[k].provinceName}</dd>
        <dd>${result.newslist[k].currentConfirmedCount}</dd>
        <dd>${result.newslist[k].confirmedCount}</dd>
        <dd>${result.newslist[k].deadCount}</dd>
        <dd>${result.newslist[k].curedCount}</dd>
        <dt class="btn"><img src="./下箭头.svg" alt=""></dt>`

            dl.innerHTML = detail_dl;
            div.appendChild(dl)
            content_b.appendChild(div)
            let btn = document.querySelectorAll(".btn")
            var flag = false;
            for (key in result.newslist[k].cities) {
                let ul = document.createElement("ul")
                ul.className = "details_ul"
                let city = `
            <li>${result.newslist[k].cities[key].cityName}</li>
            <li>${result.newslist[k].cities[key].currentConfirmedCount}</li>
            <li>${result.newslist[k].cities[key].confirmedCount}</li>
            <li>${result.newslist[k].cities[key].deadCount}</li>
            <li>${result.newslist[k].cities[key].curedCount}</li>
            <span></span>`
                ul.innerHTML = city;
                div.appendChild(ul)
            }

            btn[k].onclick = function () {
                console.log(this.parentNode.parentNode)
                let details_ul = this.parentNode.parentNode.querySelectorAll(".details_ul")
                console.log(details_ul)
                if (flag == false) {
                    for (let j = 0; j < details_ul.length; j++) {
                        details_ul[j].style.display = "flex"
                    }
                    this.style.transform = "rotateX(180deg)";
                    flag = true;
                    console.log(flag)
                } else {
                    for (let j = 0; j < details_ul.length; j++) {
                        details_ul[j].style.display = "none"
                    }
                    this.style.transform = "rotateX(360deg)";
                    flag = false;
                    console.log(flag)
                }

            }
        }

    })
}

fn()

let content_del = document.querySelectorAll(".content")
let count_del = document.querySelector(".count")
let region_li = document.querySelectorAll("li")


let count_b = document.querySelector(".count_b")
let content_b = document.querySelector(".content_b")
let region_two = document.querySelector(".region li:nth-child(2)")
let region_one = document.querySelector(".region li:nth-child(1)")
let detalis_h3 = document.querySelector(".details h3")
region_li[0].onclick = function () {
    details.style.display = "block";
    detalis_h3.innerHTML = "国内疫情";

    for(let i=0;i<region_li.length;i++){
        region_li[i].style.background = "#f5f5f5";
        region_li[i].style.fontWeight = "normal"
    }
    this.style.background = "white";
    this.style.fontWeight = "bolder";
    count_b.innerHTML = "";
    content_b.innerHTML = "";
    // details_title.innerHTML = "";
    fn()

}





// 国外疫情
region_li[1].onclick = function () {
    // let details_title = document.querySelector(".details .title")
    details.style.display = "block";
    detalis_h3.innerHTML = "国外疫情";
    for(let i=0;i<region_li.length;i++){
        region_li[i].style.background = "#f5f5f5";
        region_li[i].style.fontWeight = "normal"
    }
    this.style.background = "white";
    this.style.fontWeight = "bolder";
    count_b.innerHTML = "";
    content_b.innerHTML = "";
    // details_title.innerHTML = "";


    let box = document.querySelector(".box")
   
    ajax.get("https://api.tianapi.com/txapi/ncov/index?key=a52f2b277953adf5f9345a730b4c3993").then(result => {
        result = JSON.parse(result)
        console.log(result)
        let count = `
                    <li>
                        <span>累计确诊</span>
                        <span>${result.newslist[0].desc.foreignStatistics.confirmedCount}</span>
                        <span>较上日<strong>+${result.newslist[0].desc.foreignStatistics.confirmedIncr}</strong></span>
                    </li>
                    <li>
                        <span>累计治愈</span>
                        <span style="color:#087c55">${result.newslist[0].desc.foreignStatistics.curedCount}</span>
                        <span>较上日<strong style="color:#087c55">+${result.newslist[0].desc.foreignStatistics.curedIncr}</strong></span>
                    </li>
                    <li>
                        <span>累计死亡</span>
                        <span style="color:#656565">${result.newslist[0].desc.foreignStatistics.deadCount}</span>
                        <span>较上日<strong style="color:#656565">+${result.newslist[0].desc.foreignStatistics.deadIncr}</strong></span>
                    </li>
                    <li>
                        <span>现有确诊</span>
                        <span style="color:#fb5000">${result.newslist[0].desc.foreignStatistics.currentConfirmedCount}</span>
                        <span>较上日<strong style="color:#fb5000">+${result.newslist[0].desc.foreignStatistics.currentConfirmedIncr}</strong></span>
                    </li>
                    <li>
                        <span>境外输入确诊</span>
                        <span style="color:#5b8aac">未知</span>
                        <span>较上日<strong style="color:#5b8aac">+未知</strong></span>
                    </li>
                    <li>
                        <span>现有疑似</span>
                        <span style="color:#ed8100">${result.newslist[0].desc.foreignStatistics.suspectedCount}</span>
                        <span>较上日<strong style="color:#ed8100">+${result.newslist[0].desc.foreignStatistics.suspectedIncr}</strong></span>
                    </li>
                `
        let ul = document.createElement("ul");
        ul.className = "count";
        ul.innerHTML = count;
        let count_b = document.querySelector(".count_b");
        count_b.appendChild(ul)

    })

    ajax.get("https://api.tianapi.com/txapi/ncovabroad/index?key=a52f2b277953adf5f9345a730b4c3993").then(result => {
        result = JSON.parse(result)
        console.log(result)
        let content_b = document.querySelector(".content_b")

        // let title = `<h3>国内疫情</h3>
        // <dl class="area">
        //     <dd>地区</dd>
        //     <dd>现有确诊</dd>
        //     <dd>累计确诊</dd>
        //     <dd>死亡</dd>
        //     <dd>治愈</dd>
        //     <dt></dt>
        // </dl>`
        // let div = document.createElement("div")
        // div.className = "title"
        // div.innerHTML = title;
        // details.insertBefore(div,content_b)
        // 按洲分类

        let obj = {};
        result.newslist.map(v => {

            if (!obj[v.continents]) {
                obj[v.continents] = [];
            }
            obj[v.continents].push(v);
        })
       


        
        for (let k in obj) {
            let count1 = 0;
            let count2 = 0;
            let count3 = 0;
            let count4 = 0;
            
            let div = document.createElement("div")
            div.className = "content"
            let dl = document.createElement("dl")
          
            obj[k].map((v,i)=>{     
            
            count1+=v.currentConfirmedCount
          
            count2+=v.confirmedCount
            count3+=v.deadCount
            count4+=v.curedCount   
            
                //渲染洲
                
                let continent = `<dd>${v.continents}</dd>
                <dd>${ count1}</dd>
                <dd>${ count2}</dd>
                <dd>${ count3}</dd>
                <dd>${ count4}</dd>
                <dt class="btn"><img src="./下箭头.svg" alt=""></dt>`
                dl.innerHTML = continent;
                div.appendChild(dl)

                //渲染省
                // 渲染洲跟省两个是同步任务，渲染省的数据更快一点，会先出现在洲的前面，
                // 需要加延时器让他渲染时出现在洲的后面
                setTimeout(() => {
                    let ul = document.createElement("ul")
                    ul.className = "details_ul"
                    let province = `
                    <li>${v.provinceName}</li>
                    <li>${v.currentConfirmedCount}</li>
                    <li>${v.confirmedCount}</li>
                    <li>${v.deadCount}</li>
                    <li>${v.curedCount}</li>
                    <span></span>`
                    ul.innerHTML = province;
                    div.appendChild(ul)
                }, 1);
                content_b.appendChild(div)

            })
           
            let btn = document.querySelectorAll(".btn")
            
            for (let j = 0; j < btn.length; j++) {  
                var flag = false;
                btn[j].onclick = function () {
                   
                    let details_ul = this.parentNode.parentNode.querySelectorAll(".details_ul")
                    

                    if (flag == false) {
                        for (let j = 0; j < details_ul.length; j++) {
                            details_ul[j].style.display = "flex"
                        }
                        this.style.transform = "rotateX(180deg)";
                        flag = true;
                       
                    } else {
                        for (let j = 0; j < details_ul.length; j++) {
                            details_ul[j].style.display = "none"
                        }
                        this.style.transform = "rotateX(360deg)";
                        flag = false;
                       
                    }

                }
            }

        }

        // console.log(count1)

    })
}

// 全球疫情
region_li[2].onclick = function () {
    detalis_h3.innerHTML = "全球疫情"
    //设置li背景颜色
   for(let i=0;i<region_li.length;i++){
       region_li[i].style.background = "#f5f5f5";
       region_li[i].style.fontWeight = "normal"
   }
   this.style.background = "white"
   this.style.fontWeight = "bolder";
   count_b.innerHTML = "";
   content_b.innerHTML = "";
   details.style.display = "none"




  
  
   ajax.get("https://api.tianapi.com/txapi/ncov/index?key=a52f2b277953adf5f9345a730b4c3993").then(result => {
       result = JSON.parse(result)
       console.log(result)
       let count = `
                   <li>
                       <span>累计确诊</span>
                       <span>${result.newslist[0].desc.confirmedCount+result.newslist[0].desc.foreignStatistics.confirmedCount}</span>
                       <span>较上日<strong>+${result.newslist[0].desc.confirmedIncr+result.newslist[0].desc.foreignStatistics.confirmedIncr}</strong></span>
                   </li>
                   <li>
                       <span>累计治愈</span>
                       <span style="color:#087c55">${result.newslist[0].desc.curedCount+result.newslist[0].desc.foreignStatistics.curedCount}</span>
                       <span>较上日<strong style="color:#087c55">+${result.newslist[0].desc.curedIncr+result.newslist[0].desc.foreignStatistics.curedIncr}</strong></span>
                   </li>
                   <li>
                       <span>累计死亡</span>
                       <span style="color:#656565">${result.newslist[0].desc.deadCount+result.newslist[0].desc.foreignStatistics.deadCount}</span>
                       <span>较上日<strong style="color:#656565">+${result.newslist[0].desc.deadIncr+result.newslist[0].desc.foreignStatistics.deadIncr}</strong></span>
                   </li>
                   <li>
                       <span>现有确诊</span>
                       <span style="color:#fb5000">${result.newslist[0].desc.currentConfirmedCount+result.newslist[0].desc.foreignStatistics.currentConfirmedCount}</span>
                       <span>较上日<strong style="color:#fb5000">+${result.newslist[0].desc.currentConfirmedIncr+result.newslist[0].desc.foreignStatistics.currentConfirmedIncr}</strong></span>
                   </li>
                   <li>
                       <span>境外输入确诊</span>
                       <span style="color:#5b8aac">未知</span>
                       <span>较上日<strong style="color:#5b8aac">+未知</strong></span>
                   </li>
                   <li>
                       <span>现有疑似</span>
                       <span style="color:#ed8100">${result.newslist[0].desc.suspectedCount+result.newslist[0].desc.foreignStatistics.suspectedCount}</span>
                       <span>较上日<strong style="color:#ed8100">+${result.newslist[0].desc.suspectedIncr+result.newslist[0].desc.foreignStatistics.suspectedIncr}</strong></span>
                   </li>
               `
       let ul = document.createElement("ul");
       ul.className = "count";
       ul.innerHTML = count;
       let count_b = document.querySelector(".count_b");
       count_b.appendChild(ul)
        
      
   })


}