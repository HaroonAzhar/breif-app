import { AllPosts } from "./AllNewsPage/AllNewsPage";

export function getModifiedTitle(title: string) {
    switch(title) {
        case "How to's":
          return "How to's"
        case "News":
            return "News"
        case "Journalist Interviews":
            return "Journalist Interviews"
        default:
            return "News"
      }
}

export function sortPosts(posts: any): AllPosts[] {
    const allPosts: AllPosts[] = [];
    posts.map((post: any) => {
        const categoryName =  getModifiedTitle(Object.keys(post.categories)[0]);
        if (allPosts.some((item: AllPosts) => {return item.category === categoryName})){
            allPosts.forEach((item: AllPosts) => {
                if (item.category === categoryName) {
                    item.posts.push(post);
                }
            });
        } else {
            allPosts.push({
                posts: [post],
                category: categoryName
            })
        }
    })
    return allPosts;
}

export function htmlDecode(input: string) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
}
