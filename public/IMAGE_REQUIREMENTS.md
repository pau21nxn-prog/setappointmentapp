# Image Requirements for SetAppointmentApp

## Social Sharing Image (Open Graph / Twitter Card)

### Required Files

1. **og-image.png** (1200x630px)
   - Primary social sharing image for Facebook, LinkedIn, Twitter
   - Format: PNG or JPG
   - Size: 1200 x 630 pixels (1.91:1 ratio)
   - Max file size: < 8MB (ideally < 300KB for performance)
   - Current status: **TODO - Needs to be created**

### Design Guidelines

**Content to Include:**

- SetAppointmentApp logo
- Headline: "Launch Your Business Website in 15 Days"
- Subheadline: "or Get Your Money Back"
- Trust indicators: "50+ Five-Star Reviews • 100% Satisfaction"
- Call-to-action: "Book Free Consultation"
- Brand colors: Emerald green (#10b981) and professional gradients

**Design Tips:**

- Use high contrast text for readability
- Ensure text is legible at small sizes (thumbnails)
- Keep important content in the center (safe zone)
- Avoid text near edges (may get cropped on some platforms)
- Use professional, high-quality graphics
- Include visual elements that represent web development

### Optional Additional Images

2. **logo.png** (512x512px)
   - Square logo for organization schema
   - Transparent background
   - Format: PNG
   - Current status: **TODO**

3. **favicon.ico** (32x32px, 16x16px)
   - Browser tab icon
   - Format: ICO (multi-resolution)
   - Current status: Using Next.js default

4. **apple-touch-icon.png** (180x180px)
   - iOS home screen icon
   - Format: PNG
   - Current status: **TODO**

### Tools for Creation

**Online Design Tools:**

- [Canva](https://www.canva.com/) - Templates available
- [Figma](https://www.figma.com/) - Professional design tool
- [Adobe Express](https://www.adobe.com/express/) - Quick creation

**Stock Images:**

- [Unsplash](https://unsplash.com/) - Free high-quality photos
- [Pexels](https://www.pexels.com/) - Free stock photos
- [Pixabay](https://pixabay.com/) - Free images and vectors

### Testing

After adding images, test social sharing with:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Open Graph Check](https://opengraph.xyz/)

### Current References

Images are referenced in:

- `src/app/layout.tsx` - OpenGraph and Twitter metadata
- `src/lib/seo/structuredData.ts` - JSON-LD organization schema

### Priority

**High Priority:**

- og-image.png (Essential for social media sharing)

**Medium Priority:**

- logo.png (Improves brand recognition in search results)

**Low Priority:**

- apple-touch-icon.png (Nice to have for mobile users)
- Custom favicon.ico (Replaces Next.js default)

---

**Last Updated:** 2025-10-30
**Phase:** 3 - SEO & Analytics
