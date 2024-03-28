$(document).ready(() => {
  if (selectedTab === "replies") {
    loadReplies();
  } else {
    loadPosts();
  }
});

function loadPosts() {
  $.get("/api/posts", { postedBy: profileUserId, pinned: true }, (result) => {
    outputPinnedPost(result, $(".pinnedPostContained"));
  });

  $.get("/api/posts", { postedBy: profileUserId, pinned: false ,isReply: false }, (result) => {
    outputPost(result, $(".postContainer"));
  });
}

function loadReplies() {
  $.get("/api/posts", { postedBy: profileUserId, isReply: true }, (result) => {
    outputPost(result, $(".postContainer"));
  });
}

function outputPinnedPost(result, container) {
  if (result.length == 0) {
    container.hide();
    return;
  }

  container.html("");

  result.forEach((el) => {
    let box = createPost(el);
    container.append(box);
  });
}
