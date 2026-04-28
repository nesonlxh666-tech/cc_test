const { buildGLMPrompt, callGLM, getFallbackData } = require('./utils');

export default async (req, res) => {
    // 设置CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { topic, platform, audience, content } = req.body;

        if (!topic || !platform || !audience) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: topic, platform, audience'
            });
        }

        // 检查是否配置了GLM API密钥
        if (!process.env.GLM_API_KEY) {
            console.log('使用模拟数据（未配置GLM_API_KEY）');
            const result = getFallbackData('interaction', { topic, audience });
            return res.json({
                success: true,
                data: result
            });
        }

        // 构建prompt
        const prompt = buildGLMPrompt('interaction', { topic, platform, audience, content });

        // 调用GLM API
        const result = await callGLM(prompt, 'interaction');

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('设计互动失败:', error);
        res.status(500).json({
            success: false,
            error: '设计互动失败: ' + error.message
        });
    }
};