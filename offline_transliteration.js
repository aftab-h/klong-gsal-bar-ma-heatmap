#!/usr/bin/env bun

import { EwtsConverter } from "./lib/EwtsConverter.mjs";
const ewts = new EwtsConverter({
  leave_dubious: false,
  pass_through: false
});

const rewriter = new HTMLRewriter();

rewriter.on("*", {
  // element(el) {
  //   console.log(el.tagName); // "body" | "div" | ...
  // },
  text(text) {
    // console.log(text.text); // "hello world"
    // content = content.replace(/^\[(CHAPTER \d+:|\d\.\d+)(.*)\]/, "[$1]$2");
    text.replace(
      ewts.to_unicode(
        text.text.replace(/^\[(CHAPTER \d+:|\d\.\d+)(.*)\]/, "[$1]$2")
      )
    );
  }
});

const tText = await Bun.file("key_and_data/highlighted_t_text.html").text();
const tTransformed = rewriter.transform(new Response(`<div>${tText}</div>`));
const tTibetanHtml = (await tTransformed.text()).slice(5, -6);
await Bun.write("key_and_data/highlighted_t_text.tibetan.html", tTibetanHtml);

const lsText = await Bun.file("key_and_data/highlighted_ls_text.html").text();
const lsTransformed = rewriter.transform(new Response(`<div>${lsText}</div>`));
const lsTibetanHtml = (await lsTransformed.text()).slice(5, -6);
await Bun.write("key_and_data/highlighted_ls_text.tibetan.html", lsTibetanHtml);

const keyData = await Bun.file("key_and_data/key_with_indexes.json").json();
keyData.forEach((correspondence) => {
  correspondence.textTitleTibetan = ewts.to_unicode(
    correspondence["Text Title"]
  );
});
await Bun.write(
  "key_and_data/key_with_indexes.json",
  JSON.stringify(keyData, null, 4)
);
