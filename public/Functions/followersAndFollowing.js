$(document).ready(() => {
  if (selectedTab === "followers") {
    console.log("efoeofjeofonononon");
    loadFollowers();
  } else {
    console.log("reac");
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

function outputUser(data, container) {
      container.html("");
      data.forEach(result => {
             
      });
}


function createUserHtml(userData, showFollowButton){
      return `<div class='user'>
               <div class ='userImageContainer'> 
                 <img src='${userData.profilePic}' />
               </div>
               </div>
      `
}
