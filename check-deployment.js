#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 检查部署准备状态...\n');

const checks = [];

// 检查必需文件
const requiredFiles = [
    'index.html',
    'vercel.json',
    'package.json',
    'api/utils.js',
    'api/generate-topics.js',
    'api/generate-content.js',
    'api/optimize-titles.js',
    'api/design-interaction.js'
];

console.log('📁 检查必需文件...');
requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    checks.push({
        name: `文件 ${file}`,
        status: exists ? '✅' : '❌',
        passed: exists
    });
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// 检查package.json配置
console.log('\n📦 检查package.json配置...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasDeps = packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0;
    checks.push({
        name: 'package.json依赖配置',
        status: hasDeps ? '✅' : '❌',
        passed: hasDeps
    });
    console.log(`  ${hasDeps ? '✅' : '❌'} 依赖配置正确`);
} catch (error) {
    console.log('  ❌ package.json解析失败');
    checks.push({ name: 'package.json依赖配置', status: '❌', passed: false });
}

// 检查vercel.json配置
console.log('\n⚙️  检查Vercel配置...');
try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    const hasRoutes = vercelConfig.routes && vercelConfig.routes.length > 0;
    checks.push({
        name: 'vercel.json路由配置',
        status: hasRoutes ? '✅' : '❌',
        passed: hasRoutes
    });
    console.log(`  ${hasRoutes ? '✅' : '❌'} Vercel路由配置正确`);
} catch (error) {
    console.log('  ❌ vercel.json解析失败');
    checks.push({ name: 'vercel.json路由配置', status: '❌', passed: false });
}

// 检查API函数导出
console.log('\n🔧 检查API函数...');
const apiFiles = [
    'api/generate-topics.js',
    'api/generate-content.js',
    'api/optimize-titles.js',
    'api/design-interaction.js'
];

apiFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const hasExport = content.includes('export default');
        checks.push({
            name: `API函数 ${path.basename(file)}`,
            status: hasExport ? '✅' : '❌',
            passed: hasExport
        });
        console.log(`  ${hasExport ? '✅' : '❌'} ${path.basename(file)}`);
    } catch (error) {
        console.log(`  ❌ ${path.basename(file)} - 读取失败`);
        checks.push({ name: `API函数 ${path.basename(file)}`, status: '❌', passed: false });
    }
});

// 检查环境变量示例
console.log('\n🔑 检查环境变量配置...');
const envExample = fs.existsSync('.env.example');
checks.push({
    name: '.env.example文件',
    status: envExample ? '✅' : '❌',
    passed: envExample
});
console.log(`  ${envExample ? '✅' : '❌'} .env.example文件存在`);

// 检查.gitignore
console.log('\n🙈 检查Git忽略配置...');
const gitignore = fs.existsSync('.gitignore');
const hasEnvIgnore = gitignore && fs.readFileSync('.gitignore', 'utf8').includes('.env');
checks.push({
    name: '.env被Git忽略',
    status: hasEnvIgnore ? '✅' : '❌',
    passed: hasEnvIgnore
});
console.log(`  ${hasEnvIgnore ? '✅' : '❌'} .env文件被正确忽略`);

// 检查前端API配置
console.log('\n🌐 检查前端API配置...');
try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const hasAutoDetect = indexHtml.includes('API_BASE_URL');
    checks.push({
        name: '前端API自动检测',
        status: hasAutoDetect ? '✅' : '❌',
        passed: hasAutoDetect
    });
    console.log(`  ${hasAutoDetect ? '✅' : '❌'} 前端API地址自动检测功能`);
} catch (error) {
    console.log('  ❌ index.html读取失败');
    checks.push({ name: '前端API自动检测', status: '❌', passed: false });
}

// 输出总结
console.log('\n' + '='.repeat(50));
const passedCount = checks.filter(c => c.passed).length;
const totalCount = checks.length;
const percentage = Math.round((passedCount / totalCount) * 100);

console.log(`📊 检查结果: ${passedCount}/${totalCount} 通过 (${percentage}%)`);
console.log('='.repeat(50));

if (percentage === 100) {
    console.log('\n🎉 所有检查通过！可以开始部署到Vercel了。');
    console.log('\n📝 下一步：');
    console.log('1. 推送代码到GitHub');
    console.log('2. 在Vercel导入项目');
    console.log('3. 设置环境变量 GLM_API_KEY');
    console.log('4. 点击部署按钮');
} else {
    console.log('\n⚠️  部分检查未通过，请修复上述问题后再部署。');
    const failedChecks = checks.filter(c => !c.passed);
    console.log('\n❌ 失败的项目：');
    failedChecks.forEach(check => {
        console.log(`   - ${check.name}`);
    });
}

process.exit(percentage === 100 ? 0 : 1);