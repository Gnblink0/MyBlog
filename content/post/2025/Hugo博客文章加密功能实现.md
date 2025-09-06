+++
author = "关念"
title = "使用 Vercel 为 Hugo 静态博客添加文章加密功能"
date = "2025-09-05"
description = "想把某些blog只给特定的人看？静态博客也可以实现"
categories = [
    "装修"
]
tags = [
    "Hugo",
    "Vercel",
    "JavaScript",
    "博客",
    "加密"
]
draft = true
+++

最近想在博客上写一些相对私密的内容，但又不想完全隐藏，而是希望有一个简单的验证机制。经过一番折腾，成功为我的 Hugo 博客实现了文章加密功能。

## 需求分析

我的需求很简单：
- 某些文章需要回答问题才能查看
- 答对后在当前会话中记住状态
- 答案不能在客户端暴露
- 实现要优雅，不破坏现有的文章格式

## 最终效果

在受保护的文章页面，用户会看到一个验证界面：
- 显示预设的问题
- 输入框和验证按钮
- 答对后显示正常的文章内容，格式与普通文章完全一致

## 技术方案演进

### 方案一：客户端 Base64 "加密"

最开始我想用简单的 Base64 编码：
```javascript
// 把内容编码后放在页面中
const encodedContent = btoa(articleContent);
// 验证成功后解码显示
const content = atob(encodedContent);
```

但很快意识到这根本不是加密，任何人查看源码都能轻松破解：
```bash
# 在浏览器 Console 中就能解密
console.log(atob('编码后的内容'))
```

这种方案就是"掩耳盗铃"，没有真正的安全性。

### 方案二：Vercel Functions 服务端验证（最终方案）

既然我的博客部署在 Vercel 上，那就用 Vercel Functions 实现真正的服务端验证！

## 实现步骤

### 1. 创建 Vercel Function

在项目根目录创建 `api/verify-article.js`：

```javascript
export default function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { articleId, userAnswer } = req.body;

  // 验证输入
  if (!articleId || !userAnswer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 从环境变量读取配置
  const protectedArticles = JSON.parse(process.env.PROTECTED_ARTICLES || '{}');

  // 检查文章是否存在
  const article = protectedArticles[articleId];
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // 验证答案
  const isCorrect = userAnswer.trim().toLowerCase() === article.answer.toLowerCase();

  if (isCorrect) {
    return res.status(200).json({ 
      success: true, 
      message: '验证成功' 
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: '答案错误' 
    });
  }
}
```

### 2. 配置环境变量

创建 `.env.local` 文件（记得加入 .gitignore）：

```bash
PROTECTED_ARTICLES={
  "test-article": {
    "question": "我的博客叫什么名字？",
    "answer": "关门说话"
  }
}
```

### 3. 修改 Hugo 模板

在 `layouts/partials/article/article.html` 中添加保护逻辑：

```html
{{ if .Params.protected_question }}
    {{ $articleId := printf "protected-article-%d" (now.Unix) }}
    <div class="protected-wall" id="{{ $articleId }}">
        <div class="protected-prompt">
            <div class="protected-icon">🔒</div>
            <h3 class="protected-title">此文章需要验证访问</h3>
            <p class="protected-question">{{ .Params.protected_question }}</p>
            <div class="protected-form">
                <input type="text" class="protected-input" placeholder="请输入答案..." autocomplete="off">
                <button class="protected-submit" onclick="verifyProtectedArticle('{{ $articleId }}', '{{ .Params.protected_article_id | default "test-article" }}', this)">
                    验证
                </button>
            </div>
            <div class="protected-error" style="display: none;">
                答案错误，请重试
            </div>
        </div>
    </div>
    <div class="protected-content-container" style="display: none;">
        {{ partial "article/components/content" . }}
    </div>
{{ else }}
    {{ partial "article/components/content" . }}
{{ end }}
```

### 4. 添加前端 JavaScript

在 `assets/ts/main.ts` 中添加验证功能：

```javascript
async function verifyProtectedArticle(containerId: string, articleId: string, buttonElement: HTMLButtonElement) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const input = container.querySelector('.protected-input') as HTMLInputElement;
    const errorDiv = container.querySelector('.protected-error') as HTMLElement;
    
    if (!input || !errorDiv) return;

    const userAnswer = input.value.trim();
    
    if (!userAnswer) {
        errorDiv.textContent = '请输入答案';
        errorDiv.style.display = 'block';
        return;
    }

    // 禁用按钮，显示加载状态
    buttonElement.disabled = true;
    buttonElement.textContent = '验证中...';
    errorDiv.style.display = 'none';

    try {
        // 调用 Vercel API 验证
        const response = await fetch('/api/verify-article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                articleId: articleId,
                userAnswer: userAnswer
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // 验证成功 - 隐藏验证墙并显示内容
            container.style.display = 'none';
            
            const contentContainer = document.querySelector('.protected-content-container') as HTMLElement;
            if (contentContainer) {
                contentContainer.style.display = 'block';
            }
            
            // 存储会话状态
            sessionStorage.setItem(`protected-article-${containerId}`, 'unlocked');
            
        } else {
            // 验证失败 - 显示错误信息
            errorDiv.textContent = result.message || '验证失败';
            errorDiv.style.display = 'block';
            input.classList.add('error');
            
            // 2秒后重置
            setTimeout(() => {
                errorDiv.style.display = 'none';
                input.classList.remove('error');
                input.value = '';
                buttonElement.disabled = false;
                buttonElement.textContent = '验证';
            }, 2000);
        }
    } catch (error) {
        errorDiv.textContent = '网络错误，请重试';
        errorDiv.style.display = 'block';
        
        // 重置按钮状态
        buttonElement.disabled = false;
        buttonElement.textContent = '验证';
    }
}

// 页面加载时检查之前解锁的文章
document.addEventListener('DOMContentLoaded', () => {
    const protectedWalls = document.querySelectorAll('.protected-wall');
    protectedWalls.forEach((wall) => {
        const containerId = wall.id;
        if (sessionStorage.getItem(`protected-article-${containerId}`) === 'unlocked') {
            // 隐藏验证墙
            (wall as HTMLElement).style.display = 'none';
            
            // 显示内容容器
            const contentContainer = document.querySelector('.protected-content-container') as HTMLElement;
            if (contentContainer) {
                contentContainer.style.display = 'block';
            }
        }
    });
});
```

### 5. 添加 CSS 样式

在 `assets/scss/custom.scss` 中添加样式：

```scss
/*=========================
  Protected Content
=========================*/
.protected-content, .protected-wall {
  background: var(--card-background);
  border: 2px solid var(--card-border);
  border-radius: 12px;
  padding: 2em;
  margin: 2em 0;
  text-align: center;
  box-shadow: var(--shadow-l2);
}

.protected-wall {
  margin: 0;
  border-radius: 0;
  border: none;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.protected-icon {
  font-size: 3em;
  margin-bottom: 0.5em;
  opacity: 0.7;
}

.protected-title {
  font-size: 1.4em;
  font-weight: 600;
  margin-bottom: 0.5em;
  color: var(--card-text-color-main);
}

.protected-question {
  font-size: 1.1em;
  margin-bottom: 1.5em;
  color: var(--card-text-color-secondary);
  line-height: 1.5;
}

.protected-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  max-width: 400px;
  margin: 0 auto;
}

.protected-input {
  padding: 12px 16px;
  border: 2px solid var(--card-border);
  border-radius: 8px;
  font-size: 1em;
  transition: all 0.3s ease;
  background: var(--body-background);
  color: var(--card-text-color-main);
}

.protected-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px var(--accent-color-lighter);
}

.protected-input.error {
  border-color: #e74c3c;
  animation: shake 0.5s ease-in-out;
}

.protected-submit {
  padding: 12px 24px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.protected-submit:hover:not(:disabled) {
  background: var(--accent-color-darker);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.protected-submit:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.protected-error {
  color: #e74c3c;
  font-size: 0.95em;
  margin-top: 0.5em;
  padding: 0.5em;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 6px;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 768px) {
  .protected-content {
    padding: 1.5em;
    margin: 1em 0;
  }
  
  .protected-form {
    max-width: 100%;
  }
}
```

### 6. 使用方法

在需要保护的文章的 front matter 中添加：

```toml
+++
author = "关念"
title = "我的私密文章"
date = "2024-09-05"
description = "这是一篇需要验证的私密文章"
categories = ["日常"]
tags = ["私密"]
protected_question = "我的博客叫什么名字？"
protected_article_id = "test-article"
+++
```

## 安全性分析

### ✅ 优势
- **真正的服务端验证** - 答案完全不会暴露给客户端
- **无法破解** - 即使查看源码也找不到答案
- **环境变量保护** - 敏感配置不会提交到 GitHub
- **会话记忆** - 答对后在当前会话中记住状态

### ⚠️ 局限性
- **不是军用级加密** - 适合轻度内容保护
- **依赖 JavaScript** - 禁用 JS 的用户无法使用
- **会话级记忆** - 关闭浏览器需要重新验证

## 总结

这个方案在简单易用和安全性之间找到了很好的平衡点。相比于复杂的用户认证系统，问答式验证更适合个人博客的使用场景。

最重要的是，它让我可以放心地在博客上写一些相对私密的内容，既不会被搜索引擎索引到，也不会被随意浏览，但对于真正想看的朋友来说，验证过程也足够简单。

如果你也想为自己的 Hugo 博客添加类似功能，可以参考这个实现思路。当然，如果你有更高的安全需求，建议考虑更专业的解决方案。