/*!
*   Hugo Theme Stack
*
*   @author: Jimmy Cai
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import StackGallery from "ts/gallery";
import { getColor } from 'ts/color';
import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';
import { setupScrollspy } from 'ts/scrollspy';
import { setupSmoothAnchors } from "ts/smoothAnchors";

let Stack = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            new StackGallery(articleContent);
            setupSmoothAnchors();
            setupScrollspy();
        }

        /**
         * Add linear gradient background to tile style article
         */
        const articleTile = document.querySelector('.article-list--tile');
        if (articleTile) {
            let observer = new IntersectionObserver(async (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);

                    const articles = entry.target.querySelectorAll('article.has-image');
                    articles.forEach(async articles => {
                        const image = articles.querySelector('img'),
                            imageURL = image.src,
                            key = image.getAttribute('data-key'),
                            hash = image.getAttribute('data-hash'),
                            articleDetails: HTMLDivElement = articles.querySelector('.article-details');

                        const colors = await getColor(key, hash, imageURL);

                        articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
                    })
                })
            });

            observer.observe(articleTile)
        }


        /**
         * Add copy button to code block
        */
        const highlights = document.querySelectorAll('.article-content div.highlight');
        const copyText = `Copy`,
            copiedText = `Copied!`;

        highlights.forEach(highlight => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = copyText;
            copyButton.classList.add('copyCodeButton');
            highlight.appendChild(copyButton);

            const codeBlock = highlight.querySelector('code[data-lang]');
            if (!codeBlock) return;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err)
                        console.log('Something went wrong', err);
                    });
            });
        });

        new StackColorScheme(document.getElementById('dark-mode-toggle'));
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any
    }
}

window.Stack = Stack;
window.createElement = createElement;

// Protected content functionality
function verifyProtectedContent(containerId: string, encodedAnswer: string, buttonElement: HTMLButtonElement) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const input = container.querySelector('.protected-input') as HTMLInputElement;
    const errorDiv = container.querySelector('.protected-error') as HTMLElement;
    const hiddenDiv = container.querySelector('.protected-hidden') as HTMLElement;
    const promptDiv = container.querySelector('.protected-prompt') as HTMLElement;
    
    if (!input || !errorDiv || !hiddenDiv || !promptDiv) return;

    const userAnswer = input.value.trim();
    const correctAnswer = atob(encodedAnswer).trim();

    if (userAnswer === correctAnswer) {
        // Correct answer - show content
        try {
            const decodedContent = atob(hiddenDiv.textContent || '');
            container.innerHTML = decodedContent;
            // Store in sessionStorage to remember for this session
            sessionStorage.setItem(`protected-${containerId}`, 'unlocked');
        } catch (e) {
            console.error('Failed to decode content:', e);
            errorDiv.textContent = '解密失败，请刷新页面重试';
            errorDiv.style.display = 'block';
        }
    } else {
        // Wrong answer - show error
        errorDiv.style.display = 'block';
        input.classList.add('error');
        buttonElement.disabled = true;
        
        // Reset after 2 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
            input.classList.remove('error');
            input.value = '';
            buttonElement.disabled = false;
        }, 2000);
    }
}

// Check for previously unlocked content on page load
document.addEventListener('DOMContentLoaded', () => {
    const protectedElements = document.querySelectorAll('.protected-content');
    protectedElements.forEach((element) => {
        const containerId = element.id;
        if (sessionStorage.getItem(`protected-${containerId}`) === 'unlocked') {
            const hiddenDiv = element.querySelector('.protected-hidden') as HTMLElement;
            if (hiddenDiv) {
                try {
                    const decodedContent = atob(hiddenDiv.textContent || '');
                    element.innerHTML = decodedContent;
                } catch (e) {
                    console.error('Failed to restore content:', e);
                }
            }
        }
    });
});

// Protected article functionality
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

// Check for previously unlocked articles on page load
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

// Make functions globally available
(window as any).verifyProtectedContent = verifyProtectedContent;
(window as any).verifyProtectedArticle = verifyProtectedArticle;