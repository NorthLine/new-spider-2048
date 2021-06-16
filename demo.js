var superagent = require('superagent');
var charset = require('superagent-charset');
charset(superagent);
var express = require('express');
var baseUrl = 'http://bbs6.b4bu.xyz/2048/'; //输入任何网址都可以
const cheerio = require('cheerio');
var fs = require('fs')
var path = require('path')

var app = express();
app.use(express.static('static'))

function getAlls(route){
    superagent.get(baseUrl + route)
        .charset('utf-8')
        .end(function(err, sres) {
            var items = [];
            if (err) {
                res.json({ code: 400, msg: err, sets: items });
                return;
            }
            var $ = cheerio.load(sres.text);
            $('div.tpc_content img').each(function(idx, element) {
                var $element = $(element);
                var thumbImgSrc = $element.attr('src');
                items.push({
                    title: $element.attr('title'),
                    href: thumbImgSrc,
                    thumbSrc: thumbImgSrc
                });
            });
            var title=$('title').html()
            var getNext=$('.fn:eq(0)').attr('href')
            fs.access(path.join(__dirname, '/img.json'), fs.constants.F_OK, err => {
                if (err) { // 文件不存在
                    fs.writeFile(path.join(__dirname,'/img.json'), JSON.stringify([
                        {
                            title,
                            route,
                            getNext,
                            items
                        }
                    ]), err => {
                        if(err) {
                            console.log(err)
                            return false
                        }
                        console.log('保存成功')
                    })
                } else {
                    fs.readFile(path.join(__dirname, '/img.json'), (err, data) => {
                        if (err) {
                            console.log(err)
                            return false
                        }
                        data = JSON.parse(data.toString())
                        let exist = data.some((page, index) => {
                            return page.route == route
                        })
                        if (!exist) {
                            fs.writeFile(path.join(__dirname, 'img.json'), JSON.stringify([
                                ...data,
                                {
                                    title,
                                    route,
                                    getNext,
                                    items
                                },
                            ]), err => {
                                if (err) {
                                    console.log(err)
                                    return false
                                }
                            })
                            setTimeout(function () {
                                getAlls(getNext)
                            },3000)
                        }
                    })
                }
                // res.json({ code: 200, msg: "", data: items });
            })
        });
}

getAlls('read.php?tid-3625835.html')

app.get('/index', function(req, res) {
    //设置请求头
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //类型
    console.log(22)

    console.log(req.query)
    console.log(33)
    var type = req.query.type;
    //页码
    var page = req.query.page;
    type = type || 'tid';
    page = page || '3625800';
    var route = `${type}-${page}.html`
        //网页页面信息是gb2312，所以chaeset应该为.charset('gb2312')，一般网页则为utf-8,可以直接使用.charset('utf-8')
        console.log(baseUrl + route)

    // superagent.get(baseUrl + route)
    //     .charset('utf-8')
    //     .end(function(err, sres) {
    //         var items = [];
    //         if (err) {
    //             res.json({ code: 400, msg: err, sets: items });
    //             return;
    //         }
    //         var $ = cheerio.load(sres.text);
    //         $('div.tpc_content img').each(function(idx, element) {
    //             var $element = $(element);
    //             var thumbImgSrc = $element.attr('src');
    //             items.push({
    //                 title: $element.attr('title'),
    //                 href: thumbImgSrc,
    //                 thumbSrc: thumbImgSrc
    //             });
    //         });
    //         var title=$('title').html()
    //         var getNext=$('.fn:eq(0)').attr('href')
    //         fs.access(path.join(__dirname, '/img.json'), fs.constants.F_OK, err => {
    //             if (err) { // 文件不存在
    //                 fs.writeFile(path.join(__dirname,'/img.json'), JSON.stringify([
    //                     {
    //                         title,
    //                         route,
    //                         getNext,
    //                         items
    //                     }
    //                 ]), err => {
    //                     if(err) {
    //                         console.log(err)
    //                         return false
    //                     }
    //                     console.log('保存成功')
    //                 })
    //             } else {
    //                 fs.readFile(path.join(__dirname, '/img.json'), (err, data) => {
    //                     if (err) {
    //                         console.log(err)
    //                         return false
    //                     }
    //                     data = JSON.parse(data.toString())
    //                     let exist = data.some((page, index) => {
    //                         return page.route == route
    //                     })
    //                     if (!exist) {
    //                         fs.writeFile(path.join(__dirname, 'img.json'), JSON.stringify([
    //                             ...data,
    //                             {
    //                                 title,
    //                                 route,
    //                                 getNext,
    //                                 items
    //                             },
    //                         ]), err => {
    //                             if (err) {
    //                                 console.log(err)
    //                                 return false
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //             res.json({ code: 200, msg: "", data: items });
    //         })
    //     });
});
app.get('/show', (req, res) => {
    fs.readFile(path.join(__dirname, 'img.json'), (err, data) => {
        if (err) {
            console.log(err)
            return false
        }
        res.json(data.toString())

    })
})
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
