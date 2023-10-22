$(document).ready(() => {
  if(selectedTab==="replies"){
    loadReplies()
  }else {
    loadPosts();
  }
  
});

function loadPosts() {
  $.get("/api/posts", { postedBy: profileUserId, isReply: false }, (result) => {
    outputPost(result, $(".postContainer"));
  });
}


function loadReplies() {
  $.get("/api/posts", { postedBy: profileUserId, isReply: true }, (result) => {
    outputPost(result, $(".postContainer"));
  });
}
