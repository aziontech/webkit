# Testimonial photographs

The ground of the deck's `testimonial` slides (see
`src/preview/data/deck.js` → `kind: 'testimonial'`). Vite serves this folder at
the site root, so each file resolves at `/quotes/<name>.<ext>`.

Save each photo here with the exact filename below (JPG or WebP). Until a file exists,
the slide falls back to the deck's dither texture — the composition still reads,
because the quote card is opaque.

| Person        | File                 |
| ------------- | -------------------- |
| Satya Nadella | `satya-nadella.webp` |

What the layout needs from the file:

- **Landscape, 1620x888 or larger.** It is drawn `object-cover` across the whole
  frame, so anything squarer is cropped top and bottom.
- **The subject on the right half.** The quote card sits on the first four of the
  twelve columns (the left 556px of the frame), so a face centred in the frame
  ends up behind it.
- **Every photo in this deck is black and white — and the LAYOUT does that.**
  Drop the original in, colour and all; `testimonial` desaturates it on the
  slide. Do not pre-convert the file: a photo converted twice cannot be undone,
  and the deck is one ink and one accent, so the card's two orange marks stay
  the only colour on the artboard.
- **Big enough to be drawn at 1618x886.** It is scaled to fill the frame, so a
  700px-wide crop is upscaled 2.3x and reads soft on a projector even though it
  looks fine in the browser. Take the largest original available.
- **Rights cleared for the deck's audience.** A press or keynote photograph is
  not automatically licensed for a customer-facing presentation; check before it
  leaves the building.
