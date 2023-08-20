$(document).ready(()=>{
    $.get("/api/posts/"  + postId,  (result)=>{
             outputPostwithReplies(result , $(".postContainer"))
})
})


