$("#postText").keyup((event)=>{
         let text = $(event.target);
         let value = text.val().trim();
         let buttonPOst  = $("#submitPost");

         if(buttonPOst.length === 0){
           
            return
         }

         if(value ===""){
            buttonPOst.prop("disabled", true)
            return;
         }else{
            buttonPOst.prop("disabled", false)
         }


})

$("#submitPost").click((event)=>{
    let button = $(event.target);
    let text = $("#postText");
    let buttonPOst  = $("#submitPost");

    let data = {
        content  : text.val()
    }
  
     $.post("/api/posts", data , (postData)=>{
               let htm = createPost(postData);
               $(".postContainer").prepend(htm)
               text.val("");
               buttonPOst.prop("disabled", true)
     })
})

$(document).on("click", ".likeButton", (event)=>{
     let button = $(event.target);
     let postId = getPostId(button);
   
     $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData)=>{
               button.find("span").text(postData.likes.length || "")
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
   
   let posted = postData.postedBy
   let time = timeDifference(new Date(), new Date(postData.createdAt));
   return (`<div class="post" data-id='${postData._id}'>
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
                                   <i class="fa-regular fa-comment"></i>
                                   </div>
                                   <div>
                                   <i class="fa-solid fa-retweet"></i>
                                   </div>
                                   <div class="likeButton">
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