$(document).ready(() => {
  if (selectedTab === "followers") {
        loadFollowers();
  } else {
        loadFollowing();
  }
});

function loadFollowers() {
  $.get(`/api/users/${profileUserId}/followers`, (result) => {
    outputUser(result.followers, $(".resultContainer"));
  });
}

function loadFollowing() {
  $.get(`/api/users/${profileUserId}/following`, (result) => {
    outputUser(result.following, $(".resultContainer"));
  });
}

function outputUser(results, container) {
      container.html("");
      results.forEach((result) => {
    let html = createUserHtml(result, true);
    container.append(html);
  });

  if (results.length === 0) {
    container.append("<span class='noResults'>No result found</span>");
  }
}

function createUserHtml(userData, showFollowButton) {
  let name = userData.firstName + " " + userData.lastName;
  console.log(userLoggedIn);
  let isFollowing =
    userLoggedIn.following && userLoggedIn.following.includes(userData._id);
  let text = isFollowing ? "Following" : "Follow";
  let buttonClass = isFollowing ? "followButton following" : "followButton";
  let followButton = "";
  if (showFollowButton && userLoggedIn._id != userData._id) {
    followButton = `<div>
   <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
 </div>`;
  }
      return `<div class='user'>
               <div class ='userImageContainer'> 
                 <img src='${userData.profile}' />
</div>
               <div class ='userDetailsContainer'>
                 <div class="header"> 
                 <a href="/profile/${userData.userName}">${name}</a>
                 <span class="userName">@${userData.userName}</span>
               </div>
               </div>
      ${followButton}
               </div>
      `;
}
