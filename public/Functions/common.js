$("#postText , #replyText").keyup((event) => {
  let text = $(event.target);
  let value = text.val().trim();
  let isModal = text.parents(".modal").length == 1;

  let buttonPOst = isModal ? $("#sumbitReplyButton") : $("#submitPost");

  if (buttonPOst.length === 0) {
    alert("no submit found");
    return;
  }

  if (value === "") {
    buttonPOst.prop("disabled", true);
    return;
  } else {
    buttonPOst.prop("disabled", false);
  }
});

$("#submitPost, #sumbitReplyButton").click((event) => {
  let button = $(event.target);

  let buttonPOst = $("#submitPost");
  let ismodal = button.parents(".modal").length == 1;
  let text = ismodal ? $("#replyText") : $("#postText");

  let data = {
    content: text.val(),
  };

  if (ismodal) {
    let id = button.data().id;
    data.replyTo = id;
  }

  $.post("/api/posts", data, (postData) => {
    if (postData.replyTo) {
      location.reload();
    } else {
      let htm = createPost(postData);
      $(".postContainer").prepend(htm);
      text.val("");
      button.prop("disabled", true);
    }
  });
});

$("#replyModal").on("show.bs.modal", (event) => {
  let button = $(event.relatedTarget);
  let postId = getPostId(button);

  $("#sumbitReplyButton").data("id", postId);

  $.get("/api/posts/" + postId, (result) => {
    outputPost(result.postData, $(".originalPostContainer"));
  });
});

$("#replyModal").on("hidden.bs.modal", (event) =>
  $(".originalPostContainer").html("")
);

$("#deletePostModal").on("show.bs.modal", (event) => {
  let button = $(event.relatedTarget);
  let postId = getPostId(button);

  $("#deletePostButton").data("id", postId);
  $.get("/api/posts/" + postId, (result) => {
    outputPost(result.postData, $(".originalPostContainer"));
  });
});

$("#deletePostButton").click((event) => {
  let id = $(event.target).data("id");
  $.ajax({
    url: `/api/posts/${id}`,
    type: "DELETE",
    success: () => {
      location.reload();
    },
  });
});

$(document).on("click", ".likeButton", (event) => {
  let button = $(event.target);
  let postId = getPostId(button);

  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (postData) => {
      button.find("span").text(postData.likes.length || "");
      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});

$(document).on("click", ".retweet", (event) => {
  let button = $(event.target);
  let postId = getPostId(button);

  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (postData) => {
      button.find("span").text(postData.retweet.length || "");
      if (postData.retweet.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
  });
});

$(document).on("click", ".post", (event) => {
  let element = $(event.target);
  let postId = getPostId(element);
  if (postId !== undefined && !element.is("button") && !element.is("i")) {
    window.location.href = "/posts/" + postId;
  }
});

$(document).on("click", ".followButton", (event) => {
  let button = $(event.target);
  let userId = button.data().user;

  $.ajax({
    url: `/api/users/${userId}/follow`,
    type: "PUT",
    success: (data, status, xhr) => {
      if (xhr.status === 404) {
        alert("User not found");
        return;
      }
      let difference = 1;
      if (data?.following?.includes(userId)) {
        button.addClass("following");
        button.text("Following");
      } else {
        button.removeClass("following");
        button.text("Follow");
        difference = -1;
      }
      let followersLabel = $("#followerValue");
      if (followersLabel.length !== 0) {
        let followersText = followersLabel.text();
        followersText = parseInt(followersText);
        followersLabel.text(followersText + difference);
      }
    },
  });
});

function getPostId(event) {
  let isRoot = event.hasClass("post");
  let rootElement = isRoot ? event : event.closest(".post");
  let postID = rootElement.data().id;
  return postID;
}

function createPost(postData, largeFont = false) {
  if (postData == null) return alert("post obj is null");

  let isRetweet = postData.retweetData !== undefined;

  let retweetBY = isRetweet ? postData.postedBy.userName : null;
  postData = isRetweet ? postData.retweetData : postData;

  let likelogic = postData.likes.includes(userLoggedIn._id) ? "active" : "";
  let retweetLogic = postData.retweet.includes(userLoggedIn._id)
    ? "active"
    : "";
  let posted = postData.postedBy;
  let time = timeDifference(new Date(), new Date(postData.createdAt));
  let largeFontClass = largeFont ? "largeFont" : "";
  let retweetText = "";
  if (isRetweet) {
    retweetText = `<span> Retweeted by <a href="/profile/${retweetBY}">@${retweetBY}</a></span>`;
  }

  let replyFlag = "";
  if (postData.replyTo && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return alert("Repy to is not populated");
    } else if (!postData.replyTo._id) {
      return alert("PostedBy to is not populated");
    }

    let replyToUserName = postData.replyTo.postedBy.userName;

    replyFlag = `<div class = 'replyFlag'> 
                  Replying to <a href ='/profile/${replyToUserName}'> @${replyToUserName}</a>
        </div>`;
  }

  let buttons = "";
  if (postData.postedBy._id == userLoggedIn._id) {
    buttons = `<button data-id='${postData._id}' class ="deleteButton"  data-toggle= "modal" data-target="#deletePostModal"> 
                  <i class ='fas fa-times'> </i>  </button>`;
  }

  return `<div class='post ${largeFontClass}' data-id='${postData._id}'>
             <div class="postAction"> ${retweetText}
             </div>
              <div class="mainContentContainer">
                  <div class="userImageContainer"> 
                   <img src=${posted.profile}>
                  </div>
                  <div class="postContentContainer">
                    <div class="header">
                    <a class="displayName" href="/profile/${posted.userName}">${
    posted.firstName
  } ${posted.lastName}</a>
                     <span class="userName">@${posted.userName}</span>
                     <span class="date">${time}</span>
                     ${buttons}
                     </div>
                     ${replyFlag}
                    <div class="postBody">
                           <span>${postData.post}</span>
                    </div>
                    <div class="postFooter">
                       <div class="postButtonContainer"> 
                                
                                    <button class= "replybutton" data-toggle='modal' data-target='#replyModal' >
                                     <i class="fa-regular fa-comment"></i> 
                                    </button>
                            
                                   <button class= "retweet green ${retweetLogic}">
                                   <i class="fa-solid fa-retweet"></i>
                                   <span>${postData.retweet.length || ""}</span>
                                   </button>
                                   <button class="likeButton red ${likelogic}">
                                   <i class="fa-regular fa-heart"></i>
                                   <span>${postData.likes.length || ""}</span>
                                   </button>
                       </div>
                    </div>
                  </div>
              </div>
            
   </div>`;
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000) return "Just Now";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

function outputPost(result, container) {
  container.html("");
  if (!Array.isArray(result)) {
    result = [result];
  }

  result.forEach((el) => {
    let box = createPost(el);
    container.append(box);
  });

  if (result.length === 0) {
    container.append("<span class='noresult'>Nothing to show </span>");
  }
}

function outputPostwithReplies(result, container) {
  container.html("");

  if (result.replyTo !== undefined && result.replyTo._id !== undefined) {
    let box = createPost(result.replyTo, false);
    container.append(box);
  }
  let mainPostHTml = createPost(result.postData, true);
  container.append(mainPostHTml);

  result.replies.forEach((el) => {
    let box = createPost(el);
    container.append(box);
  });
}
