# Client story photographs

One success-case photograph per client, named after the client and nothing else:

```
netshoes.jpg
gpa.jpg
```

The folder **is** the registry. `../index.js` globs it and keys each file by the same
normalized client name the symbols use (`normalizeClientName`: lowercase, accents folded,
non-alphanumerics dropped — so `gpa.jpg` matches `GPA` and `madeiramadeira.jpg` matches
`MadeiraMadeira`). Dropping a file in here is the whole registration: no import to add,
no entry to write, no call site to touch.

A story cell that finds a photograph stands on it, under a scrim that ends on the canvas
so the headline keeps its contrast; one that finds none falls back to the dot texture.

Keep them wide (the cells are landscape, `object-cover` crops to fill) and compressed —
they are page weight on a marketing band, not archive masters.
