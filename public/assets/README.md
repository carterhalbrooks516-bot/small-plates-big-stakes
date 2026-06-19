# Custom avatar art (optional)

The app ships with hand-built **SVG cartoon avatars** for Linley and Andrew, so
it looks great out of the box with zero assets.

Want to upgrade to custom illustrations (AI-generated, hand-drawn, photos, etc.)?
Just drop image files here with these exact names:

```
public/assets/linley-avatar.png
public/assets/andrew-avatar.png
```

They will be picked up **automatically** — no code changes required. The
`<Avatar>` component fades the image in over the SVG when the file loads, and
silently keeps the SVG if the file is missing (see `src/components/Avatar.tsx`).

### Recommended specs
- **Format:** PNG (transparent background preferred) or JPG
- **Aspect ratio:** roughly square / portrait, head-and-shoulders framed
- **Size:** ~600×700px is plenty (they render inside ~160px circular medallions)

### Art direction (for whoever / whatever makes the images)
- **Linley:** long wavy brunette hair with volume, bright confident smile,
  emerald-green satin dress, gold hoop earrings, gold chain necklace, holding a
  spritz with an orange garnish. Calm, polished, in control of the board.
- **Andrew:** short red hair, red beard, light eyes, casual striped shirt,
  holding a drink, slightly nervous but optimistic smile. Likeable underdog.

Keep it premium and good-natured — the comedy comes from the over-serious
dashboard around them, not from making anyone look bad.
