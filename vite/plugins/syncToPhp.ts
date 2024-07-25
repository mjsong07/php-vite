import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import syncToPhpList from './syncToPhpList.json';

// 确保目录存在的函数
const ensureDirectoryExistence = (filePath:string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// 复制 HTML 文件的函数
const copyHtmlFiles = (sourceHtml:string, targetBaseHtmlDir:string, htmlContent:string) => {
  syncToPhpList.forEach(o => {
    const newHtmlContent = `<script>window.__vue__router_path = '${o.name}'</script>\n${htmlContent}`;
    const targetHtmlPath = path.join(targetBaseHtmlDir, o.path);
    ensureDirectoryExistence(targetHtmlPath);
    fs.writeFileSync(targetHtmlPath, newHtmlContent);
  });
};

// 复制 Assets 文件的函数
const copyAssetFiles = (sourceAssetDir:string, targetAssetDir:string) => {
  const files = fs.readdirSync(sourceAssetDir);
  files.forEach(file => {
    const sourcePath = path.join(sourceAssetDir, file);
    const targetPath = path.join(targetAssetDir, file);
    ensureDirectoryExistence(targetPath);
    fs.copyFileSync(sourcePath, targetPath);
  });
};

export default function syncToPhp(): Plugin {
  return {
    name: 'syncToPhp',
    apply: 'build', // 仅在构建时应用此插件
    closeBundle: async () => {
      console.log('同步代码到php项目-->>开始');
      const sourceHtml = './dist/index.html';
      const targetBaseHtmlDir = './../application/views';
      const sourceAssetDir = './dist/assets';
      const targetAssetDir = '../public/vite/assets';

      if (syncToPhpList.length === 0) {
        console.error('构建的列表不能为空');
        return;
      }

      try {
        const htmlContent = fs.readFileSync(sourceHtml, 'utf-8');
        copyHtmlFiles(sourceHtml, targetBaseHtmlDir, htmlContent);
        copyAssetFiles(sourceAssetDir, targetAssetDir);
      } catch (error) {
        console.error('构建异常', error);
      }

      console.log('同步代码到php项目-->>结束');
    }
  };
}
