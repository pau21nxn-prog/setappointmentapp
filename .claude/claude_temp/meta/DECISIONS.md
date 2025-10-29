# Decision Log

> **File**: `.claude/meta/DECISIONS.md`
> **Last Updated**: October 29, 2025

---

## Architectural Decisions

| Date       | Decision                        | Rationale                                               | Status      |
| ---------- | ------------------------------- | ------------------------------------------------------- | ----------- |
| 2025-10-28 | Use Next.js 14 with App Router  | SSR for SEO, excellent performance, modern approach     | ✅ Approved |
| 2025-10-28 | Use Supabase for database       | Free tier sufficient, real-time features, easy setup    | ✅ Approved |
| 2025-10-28 | Use Vercel for hosting          | Optimized for Next.js, free tier, automatic deployments | ✅ Approved |
| 2025-10-28 | Use Cloudflare for CDN          | Enterprise-grade CDN, DDoS protection, free SSL         | ✅ Approved |
| 2025-10-28 | Use Resend for email            | Developer-friendly, React templates, generous free tier | ✅ Approved |
| 2025-10-28 | Use GitFlow workflow            | Clear separation of environments, supports CI/CD        | ✅ Approved |
| 2025-10-28 | TypeScript only (no JavaScript) | Type safety, better DX, catches errors early            | ✅ Approved |
| 2025-10-28 | Tailwind CSS for styling        | Rapid development, consistent design, small bundle      | ✅ Approved |
| 2025-10-28 | Context7 MCP for documentation  | Always up-to-date docs, improves AI assistance quality  | ✅ Approved |
| 2025-10-29 | Modular documentation structure | Token optimization, focused context loading             | ✅ Approved |

---

## Future Considerations

- Consider implementing user authentication for admin panel
- Evaluate adding analytics for conversion tracking
- Consider implementing automated reminder system (cron jobs)
- Evaluate adding calendar integration (Google Calendar, Outlook)

---

[Return to Main Index](../CLAUDE.md)
