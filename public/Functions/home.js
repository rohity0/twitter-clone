$(document).ready(()=>{
    $.get("/api/posts",  (result)=>{
             outputPost(result , $(".postContainer"))
})
})


function outputPost(result, container){
      container.html =""; 
          result.forEach(el => {
                   let box = createPost(el);
                    container.append(box)
          });

          if(result.length ===0){
            container.append("<span class='noresult'>Nothing to show </span>");
        }
         
}