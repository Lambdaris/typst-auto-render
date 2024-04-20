This script acts like [auto-render for KaTeX](https://github.com/KaTeX/KaTeX/tree/main/contrib/auto-render) and render mathmatical text in [Typst](https://typst.app/) form based on [wypst](https://github.com/0xpapercut/wypst).

### Build

```shell
git clone https://github.com/Lambdaris/typst-auto-render.git
cd typst-auto-render
npm install
npm run build
```

### Usage 

```html
<script src="typst-auto-render.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        renderMathInElement(document.body, {
            throwOnError: false
        });
    });
</script>
```
It has same interface with KaTeX auto render and the `options` is much like. 

Note customization for delimeters is not supported and mathmatical expressions are wrapped in same way as Typst. Users could write "\\$" to type an literal "$" (might be "\\\\$" in markdown being converted to html).