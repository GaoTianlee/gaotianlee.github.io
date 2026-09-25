import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const output = fileURLToPath(new URL('../docs/', import.meta.url));
for (const route of ['education', 'work', 'awards', 'social', 'shop']) {
  await mkdir(resolve(output, route), { recursive: true });
  await copyFile(resolve(output, 'index.html'), resolve(output, route, 'index.html'));
}
await writeFile(resolve(output, '.nojekyll'), '');
await writeFile(resolve(output, '404.html'), `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面未找到</title><main style="max-width:640px;margin:15vh auto;padding:24px;font-family:system-ui"><h1>页面未找到</h1><p>该地址不存在，请返回首页继续浏览。</p><a href="/">返回首页</a></main></html>`);
console.log('GitHub Pages files prepared in docs/');
