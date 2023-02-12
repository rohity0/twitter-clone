$("#postText , #replyText").keyup((event)=>{
         let text = $(event.target);
         let value = text.val().trim();
         let isModal = text.parents(".modal").length ==1;
           console.log(text.parents(".modal"))
         let buttonPOst  = isModal ? $("#sumbitReplyButton") : $("#submitPost");

         if(buttonPOst.length === 0){
            alert("no submit found")
            return
         } 

         if(value ===""){
            buttonPOst.prop("disabled", true)
            return;
         }else{
            buttonPOst.prop("disabled", false)
         }


})

$("#submitPost, #sumbitReplyButton").click((event)=>{
    let button = $(event.target);
  
    let buttonPOst  = $("#submitPost");
     let ismodal = button.parents(".modal").length = 1;
     let text =   ismodal ? $('#replyText') : $("#postText");

    let data = {
        content  : text.val()
    }
    
    if(ismodal){
       let id = button.data().id;
      data.replyTo = id;
      
    }
  
     $.post("/api/posts", data , (postData)=>{
               let htm = createPost(postData);
               $(".postContainer").prepend(htm)
               text.val("");
               button.prop("disabled", true)
     })
})

$("#replyModal").on("show.bs.modal", (event)=>{
   let button = $(event.relatedTarget);
   let postId = getPostId(button);
   // console.log(postId)
   $('#sumbitReplyButton').data('id', postId);

   $.get("/api/posts/"+postId,  (result)=>{
      outputPost(result, $(".originalPostContainer"))
})
})

$("#replyModal").on("hidden.bs.modal", (event)=>{
   $(".originalPostContainer").html("")   
})

$(document).on("click", ".likeButton", (event)=>{
     let button = $(event.target);
     let postId = getPostId(button);
   
     $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData)=>{
               button.find("span").text(postData.likes.length || "");
               if(postData.likes.includes(userLoggedIn._id)){
                           button.addClass("active")
               }else{
                  button.removeClass("active")
               }
        }

     })
})


$(document).on("click", ".retweet", (event)=>{
   let button = $(event.target);
   let postId = getPostId(button);
 
   $.ajax({
      url: `/api/posts/${postId}/retweet`,
      type: "POST",
      success: (postData)=>{
       
             button.find("span").text(postData.retweet.length || "");
             if(postData.retweet.includes(userLoggedIn._id)){
                         button.addClass("active")
             }else{
                button.removeClass("active")
             }
      }

   })
})



function getPostId(event){
   let isRoot = event.hasClass("post");
   let rootElement  = isRoot? event : event.closest(".post");
   let postID = rootElement.data().id;
     return postID
}


function createPost(postData){
   
    if(postData==null) return alert("post obj is null");

    let isRetweet = postData.retweetData !== undefined;
    
    let retweetBY  = isRetweet ? postData.postedBy.userName : null
    postData = isRetweet ? postData.retweetData : postData
  

    let likelogic = postData.likes.includes(userLoggedIn._id) ? "active" : ""
    let retweetLogic = postData.retweet.includes(userLoggedIn._id) ? "active" : ""
   let posted = postData.postedBy
   let time = timeDifference(new Date(), new Date(postData.createdAt));
   
   let retweetText = "";
   if(isRetweet){
               retweetText = `<span> Retweeted by <a href="/profile/${retweetBY}">@${retweetBY}</a></span>`
   }

   let replyFlag  = "";
    if(postData.replyTo){
      
    }
   

   return (`<div class="post" data-id='${postData._id}'>
             <div class="postAction"> ${retweetText}
             </div>
              <div class="mainContentContainer">
                  <div class="userImageContainer"> 
                   <img src=${posted.profile}>
                  </div>
                  <div class="postContentContainer">
                    <div class="header">
                    <a class="displayName" href="/profile/${posted.userName}">${posted.firstName} ${posted.lastName}</a>
                     <span class="userName">@${posted.userName}</span>
                     <span class="userName">${time}</span>

                     </div>
                    <div class="postBody">
                           <span>${postData.post}</span>
                    </div>
                    <div class="postFooter">
                       <div class="postButtonContainer"> 
                                <div>
                                    <div type="button" data-toggle='modal' data-target='#replyModal' >
                                       <i class="fa-regular fa-comment"></i>
                                    </div>
                                </div>
                                   <div class= "retweet green ${retweetLogic}">
                                   <i class="fa-solid fa-retweet"></i>
                                   <span>${postData.retweet.length || ""}</span>
                                   </div>
                                   <div class="likeButton red ${likelogic}">
                                   <i class="fa-regular fa-heart"></i>
                                   <span>${postData.likes.length || ""}</span>
                                   </div>
                       </div>
                    </div>
                  </div>
              </div>
            
   </div>`)
}


function timeDifference(current, previous) {

   var msPerMinute = 60 * 1000;
   var msPerHour = msPerMinute * 60;
   var msPerDay = msPerHour * 24;
   var msPerMonth = msPerDay * 30;
   var msPerYear = msPerDay * 365;

   var elapsed = current - previous;

   if (elapsed < msPerMinute) {
      if(elapsed/1000) return "Just Now"
        return Math.round(elapsed/1000) + ' seconds ago';   
   }

   else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
   }

   else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
   }

   else if (elapsed < msPerMonth) {
       return   Math.round(elapsed/msPerDay) + ' days ago';   
   }

   else if (elapsed < msPerYear) {
       return  Math.round(elapsed/msPerMonth) + ' months ago';   
   }

   else {
       return Math.round(elapsed/msPerYear ) + ' years ago';   
   }
}

function outputPost(result, container){
   container.html("")
   if(!Array.isArray(result)){
      result =[result]
   }

       result.forEach(el => {
                let box = createPost(el);
               container.append(box)
       });

       if(result.length ===0){
         container.append("<span class='noresult'>Nothing to show </span>");
     }
      
}
