/**
 * Created By YangWei
 * Time: 2021/6/16 11:29
 * Description :
 */
let fs = require('fs');       //引入文件读取模块
let request = require('request')

let list = fs.readFileSync('./imggif.json','utf-8');    //读取JSON文件
let JSONlist=JSON.parse(list)
console.log(list)
console.log(JSONlist)

let newArray=[]
JSONlist.forEach(a=>{
    let title=a.title.substring(0,5)
    a.items.forEach((obj,index)=>{
        let url=obj.href
        let filename =title+'-'+(index+1)+'-' + url.split('/').pop()　　// 已原网络图片的名称命名本地图片
        console.log(url)
        console.log(filename)
        newArray.push(
            {
                url,
                filename
            }
        )
        // request({url}).pipe(
        //     fs.createWriteStream(`./gifimg/${filename}`).on('close',err=>{  console.log(url+'写入失败',err) })
        // )
    })
})

function getImgByIndex(number) {
    if(number<newArray.length){
        let newObj=newArray[number]
        let url=newObj.url
        let  filename=newObj.filename
        request({url}).pipe(
            fs.createWriteStream(`./gifimg/${filename}`).on('close',err=>{  console.log(url+'写入失败',err) })
        )
        setTimeout(function () {
            number++
            getImgByIndex(number)
        },1000)
    }
}

getImgByIndex(0)
// arr.forEach((url,idx)=>{
//     let filename =  url.split('/').pop()　　// 已原网络图片的名称命名本地图片
//     request({url}).pipe(
//         fs.createWriteStream(`./images/${filename}`).on('close',err=>{  console.log('写入失败',err) })
//     )
// })
