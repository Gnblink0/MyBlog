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