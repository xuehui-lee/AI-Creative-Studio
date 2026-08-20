---
name: automotive-marketing-materials
description: Research official vehicle references and create, edit, resize, retouch, compose, adapt, and quality-check complete automotive operational images containing approved copy, official logo, and verified price information. Use for Xiaohongshu, Weibo, WeChat Official Accounts, automaker APP placements, mall banners, vehicle-use knowledge graphics, new-car lead-generation posters, car-buying-season campaign images, covers, carousel images, long images, and platform resizing when a designer is unavailable. Ask which publishing platforms and placements are required, and ask for final displayed copy when either is missing before producing images.
---

# Automotive Marketing Materials

Produce routine automotive campaign images from approved vehicle, product, brand, and copy assets. Focus on image generation and image processing; do not invent or rewrite campaign copy.

## Load references

- Read [references/image-workflows.md](references/image-workflows.md) for every task.
- Read [references/official-source-research.md](references/official-source-research.md) whenever a brand or specified vehicle is involved.
- Read [references/platform-output-routing.md](references/platform-output-routing.md) whenever the output will be published on a platform.
- Read [references/volkswagen-anhui-colors.md](references/volkswagen-anhui-colors.md) for every Volkswagen Anhui visual.
- Read [references/volkswagen-anhui-typography.md](references/volkswagen-anhui-typography.md) for every Volkswagen Anhui visual containing text.
- Read [references/volkswagen-anhui-example-style.md](references/volkswagen-anhui-example-style.md) when developing the photography direction, overall color mood, composition, or applied Logo placement for a Volkswagen Anhui visual.
- Read [references/volkswagen-anhui-logo-wordmark.md](references/volkswagen-anhui-logo-wordmark.md) when the visual uses the VW roundel or ID. wordmark.
- Also read [references/volkswagen-anhui-moving-frame.md](references/volkswagen-anhui-moving-frame.md) when the VW roundel is combined with the moving frame.
- Read [references/wuling-brand-visual-guideline.md](references/wuling-brand-visual-guideline.md) for every Wuling visual. The source document, 《五菱品牌视觉识别规范 2.0 版》, is the highest-priority authority for Wuling Logo selection, construction, color, background version, placement, size, clear space, lockup, and prohibited treatments. Confirm the applicable main-brand, Silver-series, Light-series, or Red-series system before production.
- Also read [references/wuling-silver-visual-guideline.md](references/wuling-silver-visual-guideline.md) for every Silver-series visual. Use it only to supplement Silver-series matters that the 2.0 guideline does not cover; if any Logo rule conflicts, follow the 2.0 guideline.
- Read [references/wuling-character-guideline.md](references/wuling-character-guideline.md) only when the IP characters 小五 (`Wula`) or 小菱 (`Ling`), or their official character artwork, are used. In Chinese-facing content, always call them “小五” and “小菱”.
- Read [references/automotive-visual-qa.md](references/automotive-visual-qa.md) before approving a preview or delivering an export.
- Use [assets/image-job-template.md](assets/image-job-template.md) when the request needs a structured brief.

## Core workflow

1. Classify the request as **edit**, **generate**, **compose**, **adapt**, or a combination.
2. Inspect every supplied image before editing. Record pixel size, aspect ratio, transparency, visible defects, asset role, and likely crop constraints.
3. If a brand or vehicle is named, browse the official brand website before production. Resolve the exact model, year or generation, trim when relevant, exterior color, official vehicle imagery, official logo, and displayed price terminology. Save direct source URLs and access dates.
   - When an internal brand guideline is bundled for the named brand, treat that guideline as the primary source for Logo construction, placement, color, and spacing. For Wuling, 《五菱品牌视觉识别规范 2.0 版》 has priority over every other bundled file for all Logo-related decisions. Use web research only to obtain current assets and information not defined by the guideline.
   - Treat bundled historical examples as visual evidence, not as normative brand specifications. When an example conflicts with a formal guideline, follow the formal guideline.
4. Confirm the minimum production inputs: publishing platforms, placement within each platform, final displayed copy, visual reference or style direction, deadline, and desired editable source format. If the platform, placement, or final displayed copy is missing, ask the user and stop before image production.
   - For Wuling, also confirm the applicable brand or vehicle-series system before choosing the mark, palette, image style, or layout.
5. Resolve dimensions separately for every platform placement. Prefer a user-supplied current template or APP design specification; otherwise verify the platform's current official publishing specification. If an exact size cannot be verified, ask the user rather than silently choosing one.
6. Separate required assets into **available**, **officially retrievable**, and **blocking**. Never replace an exact vehicle, product, logo, QR code, legal line, or required copy with an invented substitute.
7. Choose a workflow from references/image-workflows.md.
8. For a newly generated complete visual containing a specified vehicle, give ImageGen the official vehicle images and official Logo asset as identity references, then generate the vehicle, environment, Logo, locked copy, verified price when required, CTA, and disclaimer together in one integrated final render. Let the model choose or adapt the vehicle angle, camera height, perspective, pose, lighting, reflections, contact shadow, environmental occlusion, information hierarchy, and typography placement to fit the scene. Do not generate an empty background and then paste an official vehicle cutout, Logo, or text onto it as the default production method.
   - Official vehicle images are identity references, not foreground layers to be pasted into the generated background.
   - The official Logo is a strict identity reference. Require ImageGen to reproduce its construction, proportions, color, clear space, orientation, and lockup without redesigning it.
   - Prefer several complementary official views when available so the generated angle can remain faithful to the model.
   - Pass every approved text string verbatim, including punctuation, numbers, units, capitalization, and intended line breaks. Tell ImageGen to render only those strings and not translate, rewrite, abbreviate, or invent copy.
   - A required machine-readable QR code is the sole default exception: place the original QR asset afterward and verify it scans. Do not ask ImageGen to recreate QR modules.
9. Produce a complete ImageGen master that already includes the approved text, official Logo, verified price block when required, vehicle/product, background, CTA, and disclaimer. Deliver the user a complete image rather than loose layers or a background-only result.
   - Compare every generated character and the complete Logo construction against the locked inputs at full resolution. If either is wrong, use another ImageGen generation or targeted ImageGen edit while preserving the already-correct scene and vehicle; do not silently repair the Logo or typography with external post-composition.
10. Check vehicle identity, official-source accuracy, brand accuracy, image realism, text fidelity, price terminology, platform safe areas, and visible defects. Compare the integrated render against official references before adapting sizes.
11. Generate or adapt a separate complete ImageGen composition for every requested platform and placement, keeping vehicle, environment, Logo, and text together in each result. Do not stretch the vehicle, product, people, Logo, or typography, and do not treat one crop as universally valid.
12. Export the requested files, inspect the final-resolution outputs, and deliver a manifest containing platform, placement, dimensions, format, filename, specification source, official vehicle-source URLs, access date, generation approach, and status.

## Production boundaries

- Treat user-supplied copy as required and locked. Preserve its wording, punctuation, numbers, units, line-item relationships, and disclaimer hierarchy unless the user explicitly requests copy changes.
- If the user has not supplied final displayed copy, ask for the exact headline, secondary text, CTA, price or benefit line, and disclaimer needed in the image. Do not generate a draft image while waiting.
- If the user has not specified publishing platforms, ask whether the images are for Xiaohongshu, Weibo, WeChat Official Accounts, an automaker APP, or another platform. After the platform is named, ask for the exact placement when multiple placements are possible, such as cover, article image, feed image, carousel, splash screen, homepage banner, or mall card.
- Retrieve specified-vehicle references and official Logo assets from the official brand website. Ask the user only when the official source is unavailable, ambiguous, protected from access, or insufficient to identify the exact version.
- Search current official price information when the user wants a price shown but has not supplied one. Preserve the official term exactly, such as “建议零售价”“官方指导价”“限时售价” or “综合权益”. Never turn one category into another.
- For a newly generated complete graphic, generate the vehicle, environment, exact Chinese copy, official Logo, verified price, CTA, and disclaimer together with ImageGen. Do not default to adding Logo or text afterward with deterministic layout tools. The original QR code may be added afterward because it must remain machine-readable.
- Do not use “AI background + pasted vehicle cutout” as a fallback after an integrated generation misses the vehicle. Retry the integrated render with clearer official references and stricter identity constraints. After two materially revised attempts still fail identity or realism checks, stop and request better official references or escalate to a designer instead of delivering a visibly composited result.
- Treat misspelled copy, altered numbers, invented words, malformed Logo geometry, wrong Logo color, or an incorrect lockup as generation failures. Retry with clearer Logo references, shorter locked text blocks, explicit line breaks, or a targeted ImageGen edit. After two materially revised attempts still fail, stop and request a better Logo reference or escalate to a designer; do not convert the failed result into a post-typeset or pasted-Logo version unless the user explicitly changes the requested method.
- Preserve source files. Write outputs to a separate job directory and never overwrite the only copy of an input.
- Use a specialist or designer for flagship key visuals, novel visual systems, complex compositing, high-end retouching, regulated claim layouts, or work that fails repeated vehicle-identity checks.

## Supported operations

### Edit existing images

- Remove or replace a background.
- Clean unwanted objects, reflections, dirt, clutter, or image artifacts.
- Extend a background to a new aspect ratio.
- Adjust lighting, contrast, color, sharpness, and tonal consistency.
- Replace a scene while preserving the approved vehicle or product.
- Create transparent-background vehicle or product cutouts.

### Generate complete images

- Research and obtain official vehicle identity references before generation.
- Generate the specified vehicle, campaign environment, official Logo, locked copy, verified price when required, CTA, and disclaimer together in one visually integrated ImageGen render, using official vehicle and Logo images as identity references.
- Allow the generated vehicle angle and perspective to adapt to the road, terrain, camera, light, and environment; require natural contact, reflections, scale, and occlusion.
- Require exact text and Logo fidelity inside the ImageGen result. Use deterministic composition only for an original scannable QR code or when the user explicitly requests a template/compositing workflow.
- Produce two or three meaningfully different directions when visual exploration is requested.

### Compose operational materials

- Place official vehicle/product imagery, official Logo, locked copy, verified price terminology, CTA, disclaimer, and QR code into a supplied or approved template.
- Build banners, posters, covers, carousel images, long-image modules, knowledge diagrams, and marketplace cards.
- Keep editable text and layout layers when the production tool supports them.

### Adapt across platforms

- Use the approved master as a visual reference, then let ImageGen create a complete composition for each ratio with the vehicle, environment, Logo, and locked text together.
- Protect the vehicle, headline, offer, CTA, logo, disclaimer, and QR safe areas.
- Validate actual platform templates supplied by the user. When none are supplied, verify current official platform specifications before rendering. For an internal automaker APP, request its design template or exact pixel dimensions because public social-platform presets do not apply.

## Approval gates

- **Gate 1 — Input ready:** publishing platforms and placements are known, dimensions are verified, final displayed copy is present, and official vehicle, Logo, and price sources have been resolved.
- **Gate 2 — Master preview:** direction, vehicle, scene, color, layout, and copy placement are approved.
- **Gate 3 — Platform family:** all ratios preserve hierarchy and identity.
- **Gate 4 — Final QA:** full-resolution exports pass technical and visual checks.

For simple one-image edits, combine the gates and complete the task directly. For a multi-platform campaign family, pause at Gate 2 only when the user requests an approval gate or when choosing the wrong direction would cause substantial rework.

## Delivery

Return:

1. Complete final images with vehicle/product, background, approved text, official Logo, verified price when requested, and required functional elements already included.
2. Editable source files when requested and supported.
3. An output manifest listing filename, platform, placement, dimensions, format, platform-specification source, official vehicle-source URLs, access date, and status.
4. A concise note naming any unresolved issue, substituted non-critical asset, or item requiring human review.

Do not deliver copy strategy, headline variants, social captions, or platform posting text unless separately requested outside this skill.
