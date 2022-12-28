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


function createPost(postData){
   let posted = postData.postedBy
   return (`<div class="post">
              <div class="mainContentContainer">
                  <div class="userImageContainer">
                   <img src=${posted.profile}>
                  </div>
                  <div class="postContentContainer">
                    <div class="header">
                    <a class="displayName" href="/profile/${posted.userName}">${posted.firstName} ${posted.lastName}</a>
                     <span class="userName">@${posted.userName}</span>
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
                                   <div>
                                   <i class="fa-regular fa-heart"></i>
                                   </div>
                       </div>
                    </div>
                  </div>
              </div>
            
   </div>`)
}