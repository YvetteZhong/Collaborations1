// script.js
function openTab(evt, tabName) {
    // 获取所有标签按钮和内容区域
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    tablinks = document.getElementsByClassName("tab-btn");
  
    // 隐藏所有内容区域并移除活动状态标记（如果有的话）
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
  
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // 显示当前选中的标签内容，并添加活动状态标记到对应的按钮上。
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    window.scrollTo(0, 0); // 切换后滚动到顶部
}

//surveyForm
document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止表单默认提交

    sum=0;
    var nameList=new Array("motivation","frequency","type","priority");
    for(var i=0; i<4; i++)
    {
        switch(document.forms["surveyForm"][nameList[i]].value)
        {
            case "0":
                sum += 0;
                break;
            case "1":
                sum += 1;
                break;
            case "2":
                sum += 2;
                break;
            case "3":
                sum += 3;
                break;
            default:
                window.alert("wrong");
        }
    }
    resultHTML = ``;
    switch(sum)
    {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            resultHTML = `<b>The Casual Sipper</b>
                <br/>You enjoy IP collaborations in a laid-back way, choosing practicality over hype.
                <br/>While you may appreciate creative designs, your purchasing decisions are driven by convenience and value rather than exclusivity or fandom loyalty.
                <br/>Limited-edition drops and themed merchandise don’t hold strong appeal unless they align with your existing preferences.
                <br/>Tip: Stick to occasional purchases that naturally fit your lifestyle.
                <br/>Instead of chasing every trend, focus on collaborations that offer quality products or useful items that you’ll genuinely enjoy.
                <br/>If you’re ever drawn to an IP collab, opt for practical choices like unique packaging or flavors rather than collectible merchandise.`;
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            resultHTML = `<b>The Experience Seeker</b>
                <br/>You appreciate IP collaborations for their storytelling and immersive elements, but you remain selective about your purchases.
                <br/>Rather than seeking out every new release, you prefer experiences that let you engage with your favorite themes in creative and interactive ways.
                <br/>Whether it’s themed store pop-ups, digital experiences, or limited-time drink flavors, you prioritize novelty and enjoyment over pure collectability.
                <br/>Tip: Look for collaborations that offer more than just products—whether it’s an engaging in-store atmosphere, interactive elements, or innovative packaging.
                <br/>By focusing on quality experiences rather than collecting every piece of merch, you can enjoy the magic of IP branding without unnecessary spending.`;
            break;
        case 9:
        case 10:
        case 11:
        case 12:
            resultHTML = `<b>The Ultimate Collector</b>
                <br/>You are a passionate fan who thrives on exclusivity and nostalgia.
                <br/>Limited-edition drops, rare collectibles, and collaborations with classic or beloved IPs excite you the most.
                <br/>You are likely to follow release schedules closely and don’t hesitate to join pre-orders or exclusive events to secure highly sought-after items.
                <br/>For you, IP collaborations are more than just products—they’re a way to celebrate and deepen your connection with your favorite franchises.
                <br/>Tip: Stay updated on upcoming releases on the official site and be proactive about securing exclusive merchandise before they sell out.
                <br/>Limited-time preorders and early-bird sales can be your best friend.
                <br/>Engage with fan communities to exchange insights, trade collectibles, and maximize your collection’s value.`;
            break;
        default:
            resultHTML = `wrong`;
    }
    resultHTML += `<br/><b>Why This Matters</b>
                <br/>Understanding your IP collaboration profile helps you make more strategic choices in China’s dynamic market. Whether you’re in it for nostalgia, interactive experiences, or just an occasional themed drink, knowing what excites you most allows you to enjoy the best of IP branding without unnecessary spending. So next time you spot a new collaboration, you’ll know exactly what’s worth your time!`;

    // 显示结果
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    document.getElementById('resultContent').innerHTML = resultHTML;

});

// postform
let userId = localStorage.getItem('userId');
if (!userId) {
    // 生成唯一用户ID
    userId = generateStableId();
}

// 初始化加载已存在的帖子
let posts = [];
const githubdata = fetchPrivateGitHubData();
githubdata.then((result) => {
    for (i=0; i<result.length; i++) {
        posts.unshift(result[i]);
    }
    renderPosts();
}).catch((error) => {
        console.error(error); // 处理 Promise 被拒绝的情况
});

// 创建新帖子
function createPost() {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
            
    // 简单的表单验证
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
        alert('Title and content can not be empty!');
        return;
    }

    // 创建帖子对象
    var newPost = {
        "id": Date.now(), "title": titleInput.value, "content": contentInput.value,
        "timestamp": new Date().toLocaleString(), "userId": userId};
    // 添加到帖子数组
    posts.unshift(newPost);
            
    // 保存数据
    saveToGitHub(posts).then(console.log);
            
    // 清空输入框
    titleInput.value = '';
    contentInput.value = '';
            
    // 重新渲染帖子列表
    renderPosts();
}

async function saveToGitHub(data) {
   const token = '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';
   const repo = 'YvetteZhong/Collaborations1'; // 你的仓库名
   const path = 'data.json'; // 存储数据的文件路径

    // 获取当前 SHA
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        headers: { Authorization: `token ${token}` },
    });
    const { sha } = await getRes.json();

    // 提交更新
    const content = btoa(JSON.stringify(data));
    const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update data',
            content: content,
            sha: sha,
        }),
    });
    return await updateRes.json();
}    

async function fetchPrivateGitHubData() {
   const repo = 'YvetteZhong/Collaborations1';
   const path = 'data.json';
   const token = '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'; // 注意：前端暴露 Token 有风险！
   
   try {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
       headers: {
         Authorization: `token ${token}`, // 在 Header 中添加 Token
       },
     });
     const fileData = await response.json();
     const content = atob(fileData.content);
     const data = JSON.parse(content);
     return data;

  } catch (error) {
     console.error('Error:', error);
   }
}

// 删除帖子
function deletePost(postId) {
    posts = posts.filter(post => post.id !== postId);
    saveToGitHub(posts).then(console.log);
    renderPosts();
}

// 渲染帖子列表
function renderPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '<h2>List: </h2>';
            
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p >
            <div class="post-time">Release time: ${post.timestamp}</div>
            ${post.userId === userId ? 
                `<button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>` :
               ''}
        `;
        container.appendChild(postElement);
    });
}

// 浏览器指纹 + 本地存储的混合方案
function generateStableId() {
    let fingerprint = '';
    
    // 收集浏览器特征（示例）
    fingerprint += navigator.userAgent;
    fingerprint += screen.width + 'x' + screen.height;
    fingerprint += navigator.language;
    
    // 生成哈希ID
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        hash = (hash << 5) - hash + fingerprint.charCodeAt(i);
        hash |= 0; // 转换为32位整数
    }
    
    return 'id-' + hash.toString(36);
}
