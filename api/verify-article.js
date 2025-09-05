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

  // 文章配置 - 在这里定义受保护文章的问题和答案
  const protectedArticles = {
    "test-article": {
      question: "我的毛象简介的第一句是什么？",
      answer: "关念",
    },
    // 可以添加更多文章
    // 'another-article': {
    //   question: '另一个问题？',
    //   answer: '另一个答案'
    // }
  };

  // 检查文章是否存在
  const article = protectedArticles[articleId];
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // 验证答案（不区分大小写，去除前后空格）
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