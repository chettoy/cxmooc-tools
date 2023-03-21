import{_ as n,p as e,q as s,a1 as i}from"./framework-efe98465.js";const a="/cxmooc-tools/img/扩展架构图.png",l="/cxmooc-tools/img/生命周期.png",d={},c=i(`<blockquote><p>欢迎提交PR和基于本扩展进行二次开发</p></blockquote><h2 id="准备工作" tabindex="-1"><a class="header-anchor" href="#准备工作" aria-hidden="true">#</a> 准备工作</h2><h3 id="环境" tabindex="-1"><a class="header-anchor" href="#环境" aria-hidden="true">#</a> 环境:</h3><ul><li>Node.js</li><li>webpack</li><li>Npm</li></ul><p>推荐IDE为:WebStorm,如果经常进行本项目维护,可以帮你申请开源的License</p><p>小功能调整使用VSCode即可</p><h3 id="build" tabindex="-1"><a class="header-anchor" href="#build" aria-hidden="true">#</a> Build</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/CodFrm/cxmooc-tools.git
<span class="token builtin class-name">cd</span> cxmooc-tools
<span class="token function">npm</span> <span class="token function">install</span>
<span class="token function">npm</span> run build
<span class="token comment"># 开发模式请使用</span>
<span class="token function">npm</span> run dev
<span class="token comment"># 打包生成crx和油猴脚本</span>
<span class="token function">npm</span> run tampermonkey
<span class="token comment"># 请注意,打包crx需要拥有一个pem密钥</span>
<span class="token function">npm</span> run pack
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="构建之后" tabindex="-1"><a class="header-anchor" href="#构建之后" aria-hidden="true">#</a> 构建之后</h3><blockquote><p>能够体验到最新的功能,需要按照<a href="#%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C">准备工作</a>的方法步骤配置本地环境,可能会存在一些BUG。</p></blockquote><ol><li>执行<code>npm run build</code>,此时会在<code>build/cxmooc-tools</code>目录下生成扩展文件。</li><li>打开Chrome浏览器的更多工具选项，打开扩展程序页面并启用开发者模式。</li><li>加载已解压的扩展程序，路径选择<code>build/cxmooc-tools</code></li></ol><h2 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构" aria-hidden="true">#</a> 项目结构</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>|cxmooc-tools
├─tests               # 单元测试
├─build               # 构建之后的文件,需要在此目录放\`cxmooc-tools.pem\`文件
|  ├─cxmooc-tools     # 扩展文件夹
├─docs                # vuepress 文档
├─src                 # 扩展源码
|  ├─views            # 视图文件
|  ├─tampermonkey     # 油猴打包文件
|  ├─mooc             # 平台源码
|  ├─internal         # 内部软件包
|  ├─background.ts    # 扩展后端
|  ├─config.ts        # 扩展系统配置
|  ├─mooc.ts          # 扩展入口文件
|  ├─start.ts         # 扩展中间层

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="扩展架构图" tabindex="-1"><a class="header-anchor" href="#扩展架构图" aria-hidden="true">#</a> 扩展架构图</h2><p><img src="`+a+'" alt=""></p><h2 id="生命周期-流转图" tabindex="-1"><a class="header-anchor" href="#生命周期-流转图" aria-hidden="true">#</a> 生命周期/流转图</h2><p><img src="'+l+'" alt=""></p>',17),o=[c];function r(t,m){return e(),s("div",null,o)}const v=n(d,[["render",r],["__file","index.html.vue"]]);export{v as default};
