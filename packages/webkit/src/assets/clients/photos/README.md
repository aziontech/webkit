# Client story photographs

One success-case photograph per client, named after the client and nothing else:

```
netshoes.jpg
gpa.jpg
```

Registering one takes three lines: the file here, its `./assets/clients/photos/<client>.jpg`
entry in `packages/webkit/package.json#exports`, and its key in `CLIENT_PHOTOS`
(`registry.ts` one folder up). The key is the normalized client name
(`normalizeClientName`: lowercase, accents folded, non-alphanumerics dropped — so `GPA` is
`gpa` and `MadeiraMadeira` is `madeiramadeira`).

A story cell that finds a photograph stands on it, under a scrim that ends on the canvas
so the headline keeps its contrast; one that finds none falls back to the dot texture.

Keep them wide (the cells are landscape, `object-cover` crops to fill) and compressed —
they are page weight on a marketing band, not archive masters.
