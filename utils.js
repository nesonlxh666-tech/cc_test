const axios = require('axios');

// GLM API配置
const GLM_API_KEY = process.env.GLM_API_KEY;
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 构建GLM请求的prompt
function buildGLMPrompt(promptType, data) {
    const { topic, platform, audience, selectedTopic, content } = data;

    const prompts = {
        'topics': `你是一个经验丰富的内容运营专家，擅长打造爆款内容。

任务：
为"${topic}"在${platform}生成内容选题

目标用户：
${audience}

输出要求：
1. 提供5个选题
2. 每个选题包括：
   - title: 标题（有吸引力）
   - reason: 爆点理由（为什么用户会点击）
   - direction: 内容方向（简要说明）

要求：
- 符合平台风格（如小红书偏情绪/种草）
- 有共鸣/争议/实用价值

请直接返回纯JSON数组，不要包含任何其他文字或markdown标记，格式如下：
[
  {"title": "标题", "reason": "爆点理由", "direction": "内容方向"}
]`,

        'content': `你是一个擅长写爆款内容的创作者。

根据以下选题生成内容：

选题：
${selectedTopic || topic}

输出：
- opening: 开头（吸引注意力）
- structure: 正文结构（数组，包含3个要点）
- ending: 结尾（引导互动）

风格要求：
- 口语化
- 有代入感
- 适合${platform}

请直接返回纯JSON对象，不要包含任何其他文字或markdown标记，格式如下：
{"opening": "开头内容", "structure": ["要点1", "要点2", "要点3"], "ending": "结尾内容"}`,

        'titles': `你是一个擅长标题优化的内容运营专家。

请为以下内容生成3个标题：

内容：
${content || selectedTopic || topic}

要求：
1. 情绪型标题（激发情绪）
2. 信息型标题（清晰传达价值）
3. 争议型标题（引发讨论）

请直接返回纯JSON数组，不要包含任何其他文字或markdown标记，格式如下：
[
  {"type": "情绪型", "title": "标题1"},
  {"type": "信息型", "title": "标题2"},
  {"type": "争议型", "title": "标题3"}
]`,

        'interaction': `你是一个擅长提升用户互动的社区运营。

请为以下内容设计互动策略：

内容：
${content || selectedTopic || topic}

输出：
- comments: 评论区引导话术（数组，包含3条）
- questions: 用户互动问题（数组，包含2条）
- engagement: 引导点赞/收藏的话术

请直接返回纯JSON对象，不要包含任何其他文字或markdown标记，格式如下：
{"comments": ["话术1", "话术2", "话术3"], "questions": ["问题1", "问题2"], "engagement": "引导话术"}`
    };

    return prompts[promptType];
}

// 调用GLM API
async function callGLM(prompt, promptType) {
    try {
        const response = await axios.post(GLM_API_URL, {
            model: "glm-4-flash",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        }, {
            headers: {
                'Authorization': `Bearer ${GLM_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        const content = response.data.choices[0].message.content;

        // 尝试解析JSON响应
        try {
            return parseGLMResponse(content, promptType);
        } catch (parseError) {
            console.error('GLM响应解析失败:', parseError);
            console.log('原始响应:', content);
            // 返回备用数据
            return getFallbackData(promptType);
        }
    } catch (error) {
        console.error('GLM API调用失败:', error.response?.data || error.message);
        // 返回备用数据
        return getFallbackData(promptType, { topic: '未知主题', audience: '目标用户' });
    }
}

// 改进的JSON解析函数
function parseGLMResponse(content, promptType) {
    // 清理响应内容
    let cleanedContent = content.trim();

    // 尝试找到JSON部分
    let jsonMatch = cleanedContent.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanedContent = jsonMatch[0];
    }

    // 修复常见的JSON格式问题
    cleanedContent = cleanedContent
        .replace(/"爆点理由":/g, '"reason":')
        .replace(/"内容方向":/g, '"direction":')
        .replace(/"要点1":/g, '"要点1"')
        .replace(/"要点2":/g, '"要点2"')
        .replace(/"要点3":/g, '"要点3"');

    // 修复数组中的对象格式问题
    cleanedContent = cleanedContent
        .replace(/\[\s*\{/g, '[{')
        .replace(/\}\s*\]/g, '}]')
        .replace(/\}\s*,\s*\{/g, '},{');

    // 尝试直接解析
    try {
        const parsed = JSON.parse(cleanedContent);
        return parsed;
    } catch (e) {
        // 如果直接解析失败，尝试更复杂的修复
        console.log('尝试修复JSON格式...');
        return fixJSON(cleanedContent, promptType);
    }
}

// 修复JSON格式问题
function fixJSON(content, promptType) {
    try {
        // 移除所有中文标点符号
        content = content.replace(/：/g, ':').replace(/，/g, ',');

        // 根据不同类型进行特定修复
        if (promptType === 'topics') {
            // 修复选题数组
            const items = content.match(/\{[^}]*"title"[^}]*\}/g);
            if (items) {
                return items.map(item => {
                    const titleMatch = item.match(/"title"\s*:\s*"([^"]+)"/);
                    const reasonMatch = item.match(/"reason"\s*:\s*"([^"]+)"/);
                    const directionMatch = item.match(/"direction"\s*:\s*"([^"]+)"/);

                    return {
                        title: titleMatch ? titleMatch[1] : '未定义标题',
                        reason: reasonMatch ? reasonMatch[1] : '未定义理由',
                        direction: directionMatch ? directionMatch[1] : '未定义方向'
                    };
                });
            }
        }

        // 如果修复失败，抛出错误
        throw new Error('无法修复JSON格式');

    } catch (e) {
        // 最终修复：提取有用信息并构建标准格式
        console.log('使用最终修复方案...');
        return extractAndRebuild(content, promptType);
    }
}

// 提取有用信息并重建JSON
function extractAndRebuild(content, promptType) {
    const titleMatches = content.match(/"title"\s*:\s*"([^"]+)"/g) ||
                        content.match(/标题["\s:]+([^"\n]+)[,\n]/g) ||
                        [];

    const reasonMatches = content.match(/"reason"\s*:\s*"([^"]+)"/g) ||
                         content.match(/理由["\s:]+([^"\n]+)[,\n]/g) ||
                         [];

    const directionMatches = content.match(/"direction"\s*:\s*"([^"]+)"/g) ||
                             content.match(/方向["\s:]+([^"\n]+)[,\n]/g) ||
                             [];

    if (promptType === 'topics' && titleMatches.length > 0) {
        return titleMatches.map((match, i) => ({
            title: match.match(/"([^"]+)"/)[1],
            reason: reasonMatches[i] ? reasonMatches[i].match(/"([^"]+)"/)[1] : '有吸引力的内容',
            direction: directionMatches[i] ? directionMatches[i].match(/"([^"]+)"/)[1] : '详细内容介绍'
        }));
    }

    throw new Error('无法从响应中提取有效信息');
}

// 备用数据
function getFallbackData(type, data = {}) {
    const { topic = '未知主题', audience = '玩家' } = data;

    const fallbackData = {
        'topics': [
            {
                title: `${topic}热度持续攀升，为什么玩家如此疯狂？`,
                reason: '抓住热点，引发玩家共鸣和讨论',
                direction: '分析游戏火爆现象背后的原因'
            },
            {
                title: `从新手到高手：${topic}玩家进阶指南`,
                reason: '实用价值高，收藏性强，适合新手玩家',
                direction: '提供详细的进阶技巧和攻略'
            },
            {
                title: `${topic}玩家常见的5个误区`,
                reason: '争议性话题，易引发讨论和分享',
                direction: '指出常见错误，提供正确玩法'
            },
            {
                title: `${topic}隐藏玩法大揭秘，90%的玩家不知道`,
                reason: '好奇心驱动，揭秘类内容受欢迎',
                direction: '分享游戏中的隐藏内容和技巧'
            },
            {
                title: `为什么${topic}让人上瘾？心理学角度解析`,
                reason: '深度分析内容，吸引理性玩家',
                direction: '从心理学角度分析游戏机制'
            }
        ],
        'content': {
            opening: `最近${topic}社区讨论最多的就是为什么这款游戏能让无数玩家沉迷。作为一个${audience}，我发现其中蕴含着很多值得深思的现象...`,
            structure: [
                `为什么${topic}如此受欢迎`,
                '新手玩家常见问题解析',
                '资深玩家分享经验'
            ],
            ending: `你对${topic}有什么看法？欢迎在评论区分享你的经历和想法！`
        },
        'titles': [
            {
                type: '情绪型',
                title: `${audience}必看！${topic}让我上瘾的3个原因`
            },
            {
                type: '信息型',
                title: `深度解析：${topic}的核心玩法机制`
            },
            {
                type: '争议型',
                title: `${topic}真的好玩吗？我的真实测评`
            }
        ],
        'interaction': {
            comments: [
                `你也是${topic}玩家吗？评论区聊聊！`,
                `没想到还有人和我一样喜欢${topic}！`,
                `有没有一起组队的？求带！`
            ],
            questions: [
                `你最喜欢${topic}的哪个角色？为什么？`,
                `如果可以重新开始，你会怎么规划？`
            ],
            engagement: `点赞收藏，下次不迷路！关注我，了解更多${topic}攻略~`
        }
    };

    return fallbackData[type];
}

module.exports = {
    buildGLMPrompt,
    callGLM,
    getFallbackData
};