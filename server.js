const express = require ('express');
const app = express();
const port  = 4028;
const datbase = require ('mysql');
const bodyParser = require ('body-parser');
const data = require ("./data.json");
const ls = require('local-storage');

let connection = datbase.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ProductFeedback",
});

let category = [];
let selectAllCategory = "all";
let order = "desc";
let sql = "SELECT * FROM `User Details` ORDER BY ";
let sortType = "`upvotes`";



app.set("view engine","ejs");
let urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.json());
app.use(express.static("public"));

connection.connect((err)=>{
    if (err){
       console.log(err);
    }
    else{
        let values = [];
        let com = [];
        let count = 1;
        let commentsLength = 0 ;
        for (let i of data.productRequests){
            commentsLength = 0 ;
           if (i.comments){
            commentsLength+=i.comments.length;
            for(let j of i.comments){
                commentsLength+=(j.replies)?j.replies.length : 0 ;
                com.push([count,j.content,j.user.image,j.user.name,j.user.username,(j.replies)?JSON.stringify(j.replies):JSON.stringify([])])
            }
           }
            values.push([i.title,i.category,i.upvotes,i.status,i.description,commentsLength]);
        count++;
    }
    //     let sql = "INSERT INTO `User Details` (`title`,`category`,`upvotes`,`status`,`description`,`commentscount`) values ?"
    //  connection.query(sql,[values],function(err,respond){
    //         if (err != null){
    //             console.log(err);
    //         }
    //         console.log(respond);
    //     });
    // sql = " INSERT INTO `commentsSection` (`id`,`content`,`image`,`name`,`username`,replies) VALUES ?"
    // connection.query(sql,[com],function(err,resp){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log(resp);
    // })
    }
})



app.get("/",(req,res)=>{
    let myquery = sql+sortType+order;
    console.log(myquery)
     connection.query(myquery,function(err,respond){
        if(err){
            console.log(err);
        } 
        (order == "desc")?sort = "Most " : sort = "Least ";
        (sortType == "`upvotes`")?sort+="Upvotes":sort+="Comments";
            res.render("Home",{respond,selectAllCategory,category,sortType})
     });
});

app.post("/sort",urlencodedParser,(req,res)=>{
    (req.body.order == "Most")? order = "desc": order = "ASC";
    (req.body.sort == "Upvotes")? sortType = "`upvotes`" : sortType = "`commentscount`";
    res.redirect("/");
});

app.post("/sortByCategory",urlencodedParser,(req,res)=>{    
    if (req.body.sort == "all"){
        if(selectAllCategory == "all"){
        selectAllCategory = "";
        sql = "SELECT * FROM `User Details` WHERE `category` = '"+category.join("' OR `category` = '")+"'"+"ORDER BY ";  
       }
       else{
        selectAllCategory = "all";
        sql = "SELECT * FROM `User Details` ORDER BY ";
       }
    }
    else{
        (category.includes(req.body.sort))?category.splice(category.indexOf(req.body.sort),1):category.push(req.body.sort);
    }
    if (selectAllCategory != "all"){
        sql = "SELECT * FROM `User Details` WHERE `category` = '"+category.join("' OR `category` = '")+"'"+"ORDER BY ";  
    }
    res.redirect("/");
})



app.get("/create",(req,res)=>{
    res.render("CreateNewFeedback");
})

app.post("/newFeedback",urlencodedParser,(req,res)=>{
    let a = JSON.stringify([]);
    let sqlquery = "INSERT INTO `User Details`(`title`, `category`, `description`) VALUES ('"+req.body.title+"','"+req.body.category+"','"+req.body.description+"')"
    connection.query(sqlquery,function(err,respond){
        if(err){
            console.log(err);
        }
        console.log(respond);
    })
});


app.get("/comments",(req,res)=>{
    let value = ls("value");
    let sql = "SELECT * FROM `User Details` WHERE `id` = "+value+""
    connection.query(sql,function(err,respond){
        if(err){
           console.log(err);
        }
        sql = "SELECT * FROM `commentsSection` WHERE `id` = '"+value+"'";
        connection.query(sql,function(err,resp){
            if(err){
                console.log(err);
            }
            let i = respond[0];
            res.render("Comments",{i,resp});
        })
    })
});

app.post('/loadComments',urlencodedParser,(req,res)=>{
    ls("value",req.body.id);
    res.redirect("/comments");
})


app.post('/updatePostForComment',urlencodedParser,(req,res)=>{
    quer = "SELECT * FROM `commentsSection` WHERE commentsID = '"+req.body.id+"' "
    connection.query(quer,function(err,respond){
        if(err){
            console.log(err);
        }
        const pushData = 
        {
            content : req.body.content,
            user:{
                image : data.currentUser.image,
                name : data.currentUser.name,
                username : data.currentUser.username,
            },
            replyingTo : respond[0].username,
        }
        let val = (JSON.parse(respond[0].replies));
        val.push(pushData);
        let a = JSON.stringify(val);
        console.log(val)
        quer = `UPDATE commentsSection SET replies = '${a}' WHERE commentsID = ${req.body.id}`;
        connection.query(quer,function(err,resp){
            if(err){
                console.log(err);
            }
            res.redirect("/comments");
        })
    })
});


app.post('/addComment',urlencodedParser,(req,res)=>{
    console.log(req.body.id);
    val = [[Number(req.body.id),req.body.value,data.currentUser.image,data.currentUser.name,data.currentUser.username]];
    quer = "INSERT INTO `commentsSection` (`id`,`content`,`image`,`name`,`username`) VALUES ?";
    connection.query(quer,[val],function(err,respond){
        if (err){
            console.log(err);
        }   
        console.log(respond);
        res.redirect('/comments');
    })
});

app.get('/edit',(req,res)=>{
    let value = ls("edit");
    quer = "SELECT * FROM `User Details` WHERE `id` = '"+value+"'";
      connection.query(quer,function(err,respond){
        if(err){
            console.log(err);
        }
        let i = respond[0]
        res.render("EditFeedback",{i});
      })
})

app.post('/editFeedback',urlencodedParser,(req,res)=>{
    ls("edit",req.body.id);
     res.redirect('/edit');
    
})

app.post('/deleteFeedback',urlencodedParser,(req,res)=>{
    quer = "DELETE FROM `commentsSection` WHERE `id` = '"+req.body.id+"'";
    connection.query(quer,function(err,respond){
        if(err){
            console.log(err);
        }
        quer = "DELETE FROM `User Details` WHERE `id`  = "+req.body.id+"";
        connection.query(quer,function(err,respond){
            if(err){
                console.log(err);
            }
            res.redirect("/");
        })
    })
})

app.post('/editFeedbackValues',urlencodedParser,(req,res)=>{
    quer = "UPDATE `User Details` SET `title` =  '"+req.body.title+"',`category` = '"+req.body.category+"',`status` = '"+req.body.status+"',`description` = '"+req.body.description+"' WHERE `id` = "+req.body.id+" ";
    connection.query(quer,function(err,respond){
        if(err){
            console.log(err);
        }
        res.redirect("/");
    })
})


app.get('/roadmap',(req,res)=>{
    sq = "SELECT * FROM `User Details` WHERE `status` = 'planned'";
    connection.query(sq,function(err,respond1){
        if(err){
            console.log(err);
        }
        sq = "SELECT * FROM `User Details` WHERE `status` = 'in-progress'";
        connection.query(sq,function(err,respond2){
        if(err){
            console.log(err);
        }
        sq = "SELECT * FROM `User Details` WHERE `status` = 'live'";
        connection.query(sq,function(err,respond3){
            if(err){
                console.log(err);
            }
            console.log(respond1[0])
           let arr = [respond1,respond2,respond3]
        res.render("Roadmap",{arr});
             })
        })
    })
})



app.listen(port,()=>console.log("listening",port));