# Cloudflare Configuration

> **File**: `.claude/reference/CLOUDFLARE.md`
> **Last Updated**: October 29, 2025

---

## DNS Configuration

**DNS Records** (after Cloudflare activation):

```
Type    Name    Content                   Proxy Status
A       @       76.76.21.21              Proxied (Orange)
CNAME   www     cname.vercel-dns.com     Proxied (Orange)
TXT     @       [Vercel verification]     DNS Only
```

---

## SSL/TLS Settings

- **SSL/TLS Mode**: Full (Strict)
- **Edge Certificates**: Automatic HTTPS Rewrites ON
- **Always Use HTTPS**: ON
- **Minimum TLS Version**: 1.2
- **Opportunistic Encryption**: ON
- **TLS 1.3**: ON

---

## Speed Optimization Settings

- **Auto Minify**:
  - JavaScript: ON
  - CSS: ON
  - HTML: ON
- **Brotli Compression**: ON
- **Rocket Loader**: ON (monitor for compatibility)
- **Early Hints**: ON
- **Enhanced HTTP/2 Prioritization**: ON

---

## Caching Configuration

- **Caching Level**: Standard
- **Browser Cache TTL**: 4 hours
- **Always Online**: ON
- **Development Mode**: OFF (use only during development)

---

## Page Rules (3 Free Rules)

**Rule 1: Force HTTPS**

- URL: `http://*yourdomain.com/*`
- Setting: Always Use HTTPS

**Rule 2: Cache Static Assets**

- URL: `*yourdomain.com/*.{jpg,jpeg,png,gif,css,js,woff,woff2,svg,ico}`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 month

**Rule 3: Bypass Cache for API Routes**

- URL: `*yourdomain.com/api/*`
- Setting: Cache Level: Bypass

---

## Firewall Rules (5 Free Rules)

**Rule 1: Block Bad Bots**

```
Expression: (cf.client.bot) and not (cf.verified_bot)
Action: Challenge (Managed Challenge)
```

**Rule 2: Rate Limit Form Submissions**

```
Expression: (http.request.uri.path eq "/api/appointments/create")
Action: Challenge (when rate > 5 requests/minute)
```

**Rule 3: Block Known Threats**

```
Expression: (cf.threat_score gt 40)
Action: Block
```

**Rule 4: Allow Only POST to API**

```
Expression: (http.request.uri.path eq "/api/appointments/create") and (http.request.method ne "POST")
Action: Block
```

**Rule 5: Geographic Filtering (Optional)**

```
Expression: (ip.geoip.country in {"CN" "RU"}) and (http.request.uri.path contains "/api/")
Action: Challenge
```

---

## Cache Purging (Automated in CI/CD)

```yaml
# .github/workflows/production.yml
- name: Purge Cloudflare Cache
  run: |
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}'
```

---

**Context7**: `use context7 for Cloudflare API cache purging automation`

[Return to Main Index](../CLAUDE.md)
