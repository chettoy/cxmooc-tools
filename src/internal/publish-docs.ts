import * as ghpages from 'gh-pages';

ghpages.publish('docs/.vuepress/dist', function(err) {
    console.log(err);
});