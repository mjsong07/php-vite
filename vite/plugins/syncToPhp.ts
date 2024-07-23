import { Plugin } from 'vite'; 
import fs from 'fs'; 
import path from 'path';   
import syncToPhpList from './syncToPhpList.json'

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

        if(syncToPhpList.length === 0) { 
         console.error('构建的列表不能为空')
         return
        }

        const ensureDirectoryExistence = (filePath) => {
          console.log("filePath",filePath)
          const dirname = path.dirname(filePath);
          if (fs.existsSync(dirname)) {
            return true;
          }
          ensureDirectoryExistence(dirname);
          fs.mkdirSync(dirname);
        }; 
        //复制 html 
        try {
          const htmlContent = fs.readFileSync(sourceHtml, 'utf-8');
          syncToPhpList.forEach(async o => { 
            const newHtmlContent = `<script>window.__vue__router_path = '${o.name}'</script>\n${htmlContent}`; 
            let path = `${targetBaseHtmlDir}${o.path}` 
            ensureDirectoryExistence(path); 
            fs.writeFileSync(path, newHtmlContent);  
          })  
          //复制 assets 
           let files = fs.readdirSync(sourceAssetDir); 
            files.forEach(async file => {
              let sourcePath = path.join(sourceAssetDir, file);
              let targetPath = path.join(targetAssetDir, file);  

          ensureDirectoryExistence(targetPath); 
                await fs.copyFileSync(sourcePath, targetPath);  
            }); 
        } catch (error) {
          console.error('构建异常',error)
        }
      
        console.log('同步代码到php项目-->>结束');
    }  
  };
}
