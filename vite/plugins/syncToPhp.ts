import { Plugin } from 'vite'; 
import fs from 'fs'; 
import path from 'path'; 

export default function syncToPhp(): Plugin {  
  return {
    name: 'syncToPhp',
    apply: 'build', // 仅在构建时应用此插件 
    //待处理  这里替换有bug
    transformIndexHtml(html) { 
      let result = html; 
      result = html.replace(
        /<script\b[^>]*src="(\/assets\/[^"]+)"[^>]*><\/script>/g,
        (match, p1) => {
          const newPath = `/vite${p1}`;
          return `<script type="module" crossorigin src="<?= $this->helper->basePath('${newPath}'); ?>"></script>`;
        }
      ); 
      result = result.replace(
        /<link\b[^>]*href="(\/assets\/[^"]+)"[^>]*\/?>/g,
        (match, p1) => {
          const newPath = `/vite${p1}`;
          return `<link rel="stylesheet" href="<?= $this->helper->basePath('${newPath}'); ?>" />`;
        }
      ); 
      console.log('转化html结束'); 
      return result
    },
    closeBundle: async () => { 
        console.log('同步代码到php项目-->>开始'); 
        const sourceHtmlDir = './dist'; 
        const targetHtmlDir = './../application/views/resource';
        const sourceAssetDir = './dist/assets';
        const targetAssetDir = '../public/vite/assets'; 
        //复制 html
        fs.readdir(sourceHtmlDir, (err, files) => {
          if (err) throw err;
          files.forEach(file => {
            let sourcePath = path.join(sourceHtmlDir, file); 
            const targetPath = path.join(targetHtmlDir, path.basename(file, '.html') + '.phtml');
            if (path.extname(file) === '.html') {
              console.log(file)
              fs.copyFileSync(sourcePath, targetPath);
            }
          });
        }); 

        //复制 assets
        fs.readdir(sourceAssetDir, (err, files) => {
          if (err) throw err;
          files.forEach(file => {
            let sourcePath = path.join(sourceAssetDir, file);
            let targetPath = path.join(targetAssetDir, file); 
              console.log(file)
              fs.copyFileSync(sourcePath, targetPath); 
          });
        });   
        console.log('同步代码到php项目-->>结束');
    }  
  };
}
