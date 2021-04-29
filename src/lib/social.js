const CUSTOM_POST_TYPES = ['shop','blog','benchmark','evento','workout-post'];
const articlePath = (post)=>{
  if(CUSTOM_POST_TYPES.includes(post.type)){
    switch(post.type){
      case "shop":
        return "/"+post.shopUsername
      case "blog":
        return "/news/"+post.object_id;
      case "benchmark":
        return "/benchmarks";
      case "evento":
        return "/eventos/"+post.object_id;
      case "workout-post":
        return "/";
      }
  }
  return "/";
}
export {CUSTOM_POST_TYPES, articlePath};