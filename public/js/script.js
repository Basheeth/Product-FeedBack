

function sortAndRender(ele){
    words = ele.innerText.split(" ");
     fetch('/sort',{
         method : "POST",
         headers:{
            'Content-Type' : 'application/json; charset=utf-8',
         },
         body:JSON.stringify({
            order : words[0],
            sort : words[1],
         })
     }).then((response)=>{
      sortButton.innerText = ele.innerText;
        window.location.reload();
        return response;
     })
}

function showSortDiv(){
    (sortMainDiv.style.display == "grid")?sortMainDiv.style.display = "none":sortMainDiv.style.display = "grid";
}

function sortByCategory(id){
   console.log(id)
    fetch('/sortByCategory',{
        method : "POST",
        headers:{
           'Content-Type' : 'application/json; charset=utf-8',
        },
        body:JSON.stringify({
           sort : id,
        })
    }).then((response)=>{
       window.location.reload();
       return response;
    });
}

function addNewFeedback(){
    window.location.href = "/create";
}

function goback(){
    history.back();
}

function addFeedback(){
    fetch('/newFeedback',{
        method:"POST",
        headers:{
           'Content-Type' : 'application/json; charset=utf-8',
        },
        body:JSON.stringify({
           title : inputTitle.value,
           category : inputCategory.value,
           description : inputDescription.value,
        })
    })
}

function displayCommentReplyBox(ele,index){
   console.log(index)
   document.getElementsByClassName("postDiv")[0]?.remove();
   let element = document.createElement("div");
   element.classList.add("postDiv");
   element.innerHTML = `<textarea id='postBox'></textarea><div onclick='updateReplyComment(this,${index})' class='postButton'>Post Reply</div>`;
   ele.parentElement.parentElement.append(element);
}

function updateReplyComment(ele,index){
   (index == 1)?(ID = ele.parentElement.parentElement.parentElement.id) && (rep = username.innerText):(ID = ele.parentElement.parentElement.parentElement.parentElement.id) &&(rep = replyUsername.innerText) 
   fetch('/updatePostForComment',{
      method:"POST",
      headers:{
         'Content-Type' : 'application/json; charset=utf-8',
      },
     body:JSON.stringify({
         id : ID,
         content : postBox.value,
         reply : rep,
      }),
   }).then((response)=>{
      window.location.reload();
      return response;
   })

}

function addComment(eleId){
   document.getElementsByClassName("addCommentText")[0].value;
   fetch('/addComment',{
      method:"POST",
      headers:{
         'Content-Type' : 'application/json; charset=utf-8',
      },
      body:JSON.stringify({
         value : document.getElementsByClassName("addCommentText")[0].value,
         id : eleId,
      })
   })
   .then((response)=>{
      window.location.reload();
      document.getElementsByClassName("addCommentText")[0].value = "";
      return response;
   })
};


function editFeedback(ele){
   console.log(ele)
   fetch('/editFeedback',{
      method:"POST",
      headers:{
         'Content-Type' : 'application/json; charset=utf-8',
      },
      body:JSON.stringify({
         id : Number(ele),
      }),
   }).then((response)=>{
      window.location.href="/edit";
      return response;
   })
}

function commentsPage(ele){
   console.log(ele);
   fetch('/loadComments',{
      method : "POST",
      headers : {
         'Content-Type' : 'application/json; charset=utf-8',
      },
      body : JSON.stringify({
         id : ele,
      }),
   }).then((response)=>{
      window.location.href = "/comments";
      return response;
   })
}

function deleteFeedback(ele){
   fetch('/deleteFeedback',{
      method:"POST",
      headers:{
         'Content-Type' : 'application/json; charset=utf-8',
      },
      body:JSON.stringify({
         id : ele,
      }),
   }).then((response)=>{
      window.location.href="/";
      return response;
   })
}

function edit(ele){
    fetch('/editFeedbackValues',{
      method:"POST",
      headers:{
         'Content-Type' : 'application/json; charset=utf-8',
      },
      body : JSON.stringify({
         id : Number(ele),
         title : title.value,
         category : category.value,
         status : stat.value,
         description : description.value,
      }),
    }).then((respond)=>{
      window.location.href="/";
      return respond;
    })
}


function cancel(){
   window.location.href="/";
}


function categorySwitch(){
   (switchCategory.style.display == "grid")?switchCategory.style.display = "none":switchCategory.style.display = "grid";
}


function renderCategory(ele){
   console.log(category)
   category.value = ele.innerText;
   switchCategory.style.display = "none";
}

function statusSwitch(){
   (switchStatus.style.display == "grid")?switchStatus.style.display = "none" : switchStatus.style.display = "grid" ; 
}

function renderStatus(ele){
   stat.value = ele.innerText;
   switchStatus.style.display = "none";
}

function view(){
   window.location.href = "/roadmap";
}



// $(".feedback").hover(function(){
//    $(this.childNodes[3]).css("color","#4661E6");
// },function(){
//    $(this.childNodes[3]).css("color","#373F68")
// });

