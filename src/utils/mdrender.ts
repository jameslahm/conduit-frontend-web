import MarkdownIt from "markdown-it";
import emoji from "markdown-it-emoji";
import Prism from "prismjs";
// @ts-ignore
import sup from "markdown-it-sub";
// @ts-ignore
import sub from "markdown-it-sub";
// @ts-ignore
import footnote from "markdown-it-footnote";
// @ts-ignore
import abbr from "markdown-it-abbr";
// @ts-ignore
import mark from "markdown-it-mark";

const md = new MarkdownIt({
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang) {
      try {
        return Prism.highlight(str, Prism.languages[lang], lang);
      } catch (err) {
        console.log(err);
      }
    }
    return "";
  },
})
  .use(emoji)
  .use(sub)
  .use(sup)
  .use(footnote)
  .use(mark)
  .use(abbr);

export {md}