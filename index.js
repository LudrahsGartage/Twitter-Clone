import { tweetsDataStored } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweetsData = localStorage.getItem("tweetsData") ? JSON.parse(localStorage.getItem("tweetsData")) : tweetsDataStored

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.uuid) {
        handleAddComment(e.target.dataset.uuid)
    }
    else if (e.target.dataset.delete) {
        handleDelete(e.target.dataset.delete)
    }
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

function handleAddComment(tweetId) {
    const commentContent = document.getElementById(`comment-text-${tweetId}`)
    if (commentContent.value) {
        const commentObject = {
            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: commentContent.value,
        }
        const [targetTweetObj] = tweetsData.filter((tweet) => tweet.uuid === tweetId)
        targetTweetObj.replies.push(commentObject)
    }
    commentContent.value = "";
    render()
    document.getElementById(`replies-${tweetId}`).classList.remove('hidden') 
}

function handleDelete(tweetId) {
    const indexOfTweet = tweetsData.findIndex((tweet) => tweet.uuid=tweetId)
    tweetsData.splice(indexOfTweet,1)
    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = `
        <div class="add-comment" id ="comment-${tweet.uuid}">
            <div class="flex">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea id="comment-text-${tweet.uuid}" placeholder="Add a comment..."></textarea>   
            </div>
            <button class="add-comment-btn" id="comment-btn" data-uuid="${tweet.uuid}">Add Comment</button>
        </div>
        `
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }

        const deleteHTML = `<span class="tweet-detail">
                        <i class="fa-solid fa-trash"
                        data-delete="${tweet.uuid}"
                        ></i>
                    </span>`
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                ${(tweet.handle === "@Scrimba") && deleteHTML}
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
