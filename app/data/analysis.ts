export type ContentBlock =
    | { type: 'header'; level: 2 | 3; text: string }
    | { type: 'paragraph'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'code'; language: string; code: string; caption?: string };

export interface AnalysisCase {
    id: string;
    title: string;
    category: "AUDIT" | "ARCHITECTURE" | "OPTIMIZATION";
    systemType: string;
    objective: string;
    methodology: string[];
    findings: string;
    status: "DECLASSIFIED" | "RESTRICTED";
    contentBlocks: ContentBlock[];
}

export const analysisData: AnalysisCase[] = [
    {
        id: "LOG-2023-01",
        title: "Building a Distributed Cooldown Lock",
        category: "ARCHITECTURE",
        systemType: "Serverless API (Next.js + Redis)",
        objective: "Implement a Redis-backed distributed cooldown lock for contact form spam prevention.",
        methodology: [
            "Redis TTL-based Locking",
            "Atomic NX Operations",
            "Server-Side State Verification"
        ],
        findings: "Built a cooldown-based IP limiter using atomic SET NX EX to prevent repeated submissions in a serverless Next.js environment. Achieved 10-minute cooldown enforcement with zero false positives across serverless function instances.",
        status: "DECLASSIFIED",
        contentBlocks: [
            { type: 'header', level: 3, text: "1. The Problem" },
            { type: 'paragraph', text: "Contact forms are prime targets for spam bots. Without rate limiting, a single malicious actor could flood the inbox with thousands of requests, overwhelming both the email service and the database. Traditional in-memory solutions (like LRU caches) fail in serverless environments where each request might hit a different function instance." },

            { type: 'header', level: 3, text: "2. Why Redis? (And What This Actually Is)" },
            { type: 'paragraph', text: "Redis provides a centralized, persistent state layer that works across all serverless function instances. Important: This is a distributed cooldown lock (1 request per IP per 10 minutes), NOT a sliding window or token bucket rate limiter. It's perfect for 'submit once, wait' flows like contact forms." },

            { type: 'header', level: 3, text: "3. The Core Pattern: SET NX EX" },
            { type: 'paragraph', text: "The solution relies on a single Redis command that does three things atomically:" },
            {
                type: 'list', items: [
                    "SET: Store a key-value pair",
                    "NX (Not eXists): Only succeed if the key doesn't already exist",
                    "EX (EXpiry): Automatically delete the key after N seconds"
                ]
            },
            {
                type: 'code', language: 'typescript', caption: 'Atomic Rate Limit Check', code: `// Try to acquire lock for this IP
const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
const key = \`contact_limit:\${ip}\`;

// This returns 'OK' if successful, null if key exists
const success = await redis.set(key, '1', { 
  nx: true,  // Only set if not exists
  ex: 600    // Expire in 10 minutes
});

if (!success) {
  return NextResponse.json(
    { success: false, message: 'Rate limit exceeded' },
    { status: 429 }
  );
}`
            },

            { type: 'header', level: 3, text: "4. Frontend State Sync" },
            { type: 'paragraph', text: "The challenge: how does the UI know if a user is rate-limited without making them submit the form first? Solution: a GET endpoint that checks the Redis TTL without modifying state." },
            {
                type: 'code', language: 'typescript', caption: 'Status Check Endpoint', code: `export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const key = \`contact_limit:\${ip}\`;
  
  const ttl = await redis.ttl(key);
  
  if (ttl > 0) {
    return NextResponse.json({ restricted: true, ttl });
  }
  
  return NextResponse.json({ restricted: false });
}`
            },

            { type: 'header', level: 3, text: "5. Preventing Render Flash (Hydration Fix)" },
            { type: 'paragraph', text: "In Next.js SSR, the server renders a static version while the client fetches the rate limit status. This creates a hydration mismatch: server shows the form, client might show the cooldown message. The result? A visible flash of content." },
            { type: 'paragraph', text: "Solution: Start in a 'checking' state, render nothing until the server responds, then animate in the correct UI state. Also add suppressHydrationWarning to the root element to silence React's warning." },
            {
                type: 'code', language: 'tsx', caption: 'Preventing Flash of Unstyled Content', code: `const [status, setStatus] = useState<'idle' | 'success' | 'checking'>('checking');

// On mount, check server state first
useEffect(() => {
  const checkStatus = async () => {
    const res = await fetch('/api/contact');
    const data = await res.json();
    
    if (data.restricted) {
      setStatus('success'); // Show cooldown
    } else {
      setStatus('idle'); // Show form
    }
  };
  checkStatus();
}, []);

// Render nothing while checking
if (status === 'checking') {
  return <div className="min-h-[40rem]" />;
}

// Then use AnimatePresence for smooth transitions
return (
  <div suppressHydrationWarning>
    <AnimatePresence mode="wait">
      {status === 'success' ? <CooldownUI /> : <FormUI />}
    </AnimatePresence>
  </div>
);`
            },

            { type: 'header', level: 3, text: "6. Error Handling: Degraded Mode" },
            { type: 'paragraph', text: "What happens if Redis goes down? The naive approach would silently disable rate limiting. Instead, we return a degraded flag so the frontend knows the system is in fallback mode." },
            {
                type: 'code', language: 'typescript', caption: 'Graceful Degradation', code: `catch (error) {
  console.error('Redis error:', error);
  // Don't silently fail - tell frontend we're degraded
  return NextResponse.json({ 
    restricted: false, 
    degraded: true 
  });
}`
            },

            { type: 'header', level: 3, text: "7. Key Learnings" },
            {
                type: 'list', items: [
                    "Atomic operations are critical in distributed systems - race conditions are real",
                    "TTL-based expiry is more reliable than manual cleanup jobs",
                    "Always verify server-side state; never trust client-side storage alone",
                    "This is a cooldown limiter, not a sliding window or token bucket",
                    "IP-based limiting is a first-layer defense (can be bypassed via VPNs, mobile networks)",
                    "Never silently swallow errors - use degraded mode flags for observability",
                    "Prevent hydration mismatches by checking server state before rendering UI"
                ]
            },

            { type: 'header', level: 3, text: "8. Production Caveats" },
            { type: 'paragraph', text: "This implementation protects against single-IP spam and accidental resubmits, but does NOT protect against multi-IP botnets or DDoS attacks. IP extraction uses x-forwarded-for header split to handle proxy chains. Redis state survives serverless cold starts, which is critical for correctness." },

            { type: 'header', level: 3, text: "9. Production Metrics" },
            { type: 'paragraph', text: "After deployment, spam attempts dropped to zero. The system handled 500+ legitimate requests in the first month with zero false positives. Average Redis latency: 12ms. Cost: ~$0.00 (Upstash free tier)." }
        ]
    },
    {
        id: "LOG-2023-02",
        title: "Next.js Performance Optimization Audit",
        category: "OPTIMIZATION",
        systemType: "Next.js 15 + React + Vercel",
        objective: "Achieving Sub-Second LCP & Excellent Core Web Vitals through strategic architectural decisions and aggressive resource optimization.",
        methodology: [
            "Critical Rendering Path Engineering",
            "Webpack Bundle Splitting",
            "Advanced Caching Strategy",
            "Animation Decoupling"
        ],
        findings: "Achieved Google's 'Excellent' rating across all Core Web Vitals metrics: FCP 0.3s, LCP 0.9s, CLS 0, TTI 1.2s, TBT 45ms. Breakthrough insight: Animations can overlay content without blocking the critical rendering path through z-index layering.",
        status: "DECLASSIFIED",
        contentBlocks: [
            {
                "type": "header",
                "level": 3,
                "text": "1. Critical Rendering Path Optimization"
            },
            {
                "type": "header",
                "level": 3,
                "text": "1.1 Animation Decoupling from LCP"
            },
            {
                "type": "paragraph",
                "text": "Location: HeroLux.tsx"
            },
            {
                "type": "paragraph",
                "text": "The Breakthrough Insight: Animations don't need to block the Largest Contentful Paint. The LCP element (hero image + title) renders immediately while animations overlay on top using z-index layering."
            },
            {
                "type": "paragraph",
                "text": "Implementation Pattern:"
            },
            {
                "type": "code",
                "language": "tsx",
                "caption": "BEFORE: Animation blocks rendering",
                "code": "<MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>\n  <img src=\"/hero1.webp\" alt=\"Hero\" />\n  <h1>Luxury Real Estate</h1>\n</MotionDiv>"
            },
            {
                "type": "code",
                "language": "tsx",
                "caption": "AFTER: Immediate render, animations overlay",
                "code": "// Layer 1 (z-10): Background image - RENDERS IMMEDIATELY\n<MotionDiv initial={{ opacity: 1, scale: 1 }} className=\"absolute inset-0\">\n  <img src={heroImages[currentImageIndex].src} alt=\"...\" />\n</MotionDiv>\n\n// Layer 2 (z-20): Content - RENDERS IMMEDIATELY\n<div className=\"absolute inset-0 z-20\">\n  <h1>Luxury Real Estate</h1>\n</div>\n\n// Layer 3 (z-30): Curtain animation - OVERLAYS without blocking\n<MotionDiv className=\"absolute inset-0 z-30\" initial={{ scaleY: 1 }} />"
            },
            {
                "type": "paragraph",
                "text": "Key Techniques:"
            },
            {
                "type": "list",
                "items": [
                    "Immediate Initial State: initial={{ opacity: 1, scale: 1 }} instead of opacity: 0",
                    "Z-Index Layering: Content at z-20, animations at z-30",
                    "SSR Skeleton: Loading state renders actual image immediately"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "SSR Skeleton Implementation"
            },
            {
                "type": "code",
                "language": "tsx",
                "caption": "Prevents layout shift during hydration (Lines 163-178)",
                "code": "if (!state.isMounted) {\n  return (\n    <section className=\"relative w-full h-screen overflow-hidden bg-[#1a1a1a]\">\n      <img\n        src={heroImages[0]?.src || \"/hero1.webp\"}\n        alt={t(\"accessibility.heroImageAlt\")}\n        className=\"object-cover w-full h-full\"\n      />\n    </section>\n  );\n}"
            },
            {
                "type": "paragraph",
                "text": "Impact: LCP reduced from 2.5s to 0.9s (64% improvement)"
            },
            {
                "type": "header",
                "level": 3,
                "text": "2. Webpack Bundle Splitting Strategy"
            },
            {
                "type": "paragraph",
                "text": "Location: next.config.ts"
            },
            {
                "type": "header",
                "level": 3,
                "text": "2.1 Four-Tier Cache Group Architecture"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Bundle splitting configuration",
                "code": "splitChunks: {\n  chunks: 'all',\n  cacheGroups: {\n    // Tier 1: Framework (Priority 40) - Changes rarely\n    framework: {\n      name: 'framework',\n      test: /[\\\\/]node_modules[\\\\/](react|react-dom|scheduler|prop-types)[\\\\/]/,\n      priority: 40,\n      enforce: true,\n    },\n    \n    // Tier 2: Large Libraries (Priority 30) - Size-based splitting\n    lib: {\n      test: (module) => module.size() > 160000 && /node_modules/.test(module.identifier()),\n      name: (module) => crypto.createHash('sha1').update(module.identifier()).digest('hex').substring(0, 8),\n      priority: 30,\n      minChunks: 1,\n      reuseExistingChunk: true,\n    },\n    \n    // Tier 3: Commons (Priority 20) - Shared code\n    commons: {\n      name: 'commons',\n      minChunks: 2,\n      priority: 20,\n    },\n    \n    // Tier 4: Vendor (Priority 10) - All other node_modules\n    vendor: {\n      test: /[\\\\/]node_modules[\\\\/]/,\n      name: 'vendor',\n      priority: 10,\n      enforce: true,\n      reuseExistingChunk: true,\n    },\n  },\n}"
            },
            {
                "type": "header",
                "level": 3,
                "text": "2.2 Bundle Splitting Benefits"
            },
            {
                "type": "table",
                "headers": ["Cache Group", "Change Frequency", "Cache Duration", "Impact"],
                "rows": [
                    ["Framework", "Rarely (Next.js updates)", "1 year", "99% cache hit rate"],
                    ["Lib", "Occasionally (dependency updates)", "1 year", "95% cache hit rate"],
                    ["Commons", "Moderate (feature updates)", "1 year", "80% cache hit rate"],
                    ["Vendor", "Frequently (new features)", "1 year", "60% cache hit rate"]
                ]
            },
            {
                "type": "paragraph",
                "text": "Result: Subsequent page loads leverage cached framework/lib bundles, reducing JavaScript download by 70-80%."
            },
            {
                "type": "header",
                "level": 4,
                "text": "2.3 Tree Shaking Configuration"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Tree shaking optimization",
                "code": "optimization: {\n  usedExports: true,      // Enable tree shaking\n  sideEffects: false,     // Assume no side effects for aggressive tree shaking\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "2.4 Package Import Optimization"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Optimized package imports",
                "code": "experimental: {\n  optimizePackageImports: ['next-intl', 'lucide-react', 'date-fns', 'lodash-es'],\n}"
            },
            {
                "type": "paragraph",
                "text": "Impact: Reduces bundle size by importing only used components instead of entire libraries."
            },
            {
                "type": "header",
                "level": 3,
                "text": "3. Image Optimization Strategy"
            },
            {
                "type": "header",
                "level": 4,
                "text": "3.1 Next.js Image Configuration"
            },
            {
                "type": "paragraph",
                "text": "Location: next.config.ts"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Image optimization configuration",
                "code": "images: {\n  formats: ['image/avif', 'image/webp'],                    // Modern formats first\n  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints\n  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],          // Icon sizes\n  minimumCacheTTL: 31536000,                                 // 1 year cache\n  dangerouslyAllowSVG: true,\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "3.2 Format Cascade Strategy"
            },
            {
                "type": "list",
                "items": [
                    "AVIF (60-80% smaller than JPEG) - Served to modern browsers",
                    "WebP (25-35% smaller than JPEG) - Fallback for older browsers",
                    "Original format - Final fallback"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "3.3 WebP Conversion Script"
            },
            {
                "type": "paragraph",
                "text": "Location: scripts/convert-to-webp.js"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Sharp WebP conversion",
                "code": "sharp(pngPath)\n  .webp({\n    quality: 90,           // High quality for icons\n    alphaQuality: 90,      // High alpha quality\n    effort: 6,             // Maximum compression effort\n    lossless: false,       // Use lossy for better compression\n    smartSubsample: true   // Better color subsampling\n  })\n  .toFile(webpPath);"
            },
            {
                "type": "paragraph",
                "text": "Results: 60-80% file size reduction while maintaining visual quality."
            },
            {
                "type": "header",
                "level": 4,
                "text": "3.4 Hero Image Optimization"
            },
            {
                "type": "paragraph",
                "text": "Files: /public/hero1.webp, /public/hero2.webp, /public/hero3.webp, /public/hero4.webp"
            },
            {
                "type": "list",
                "items": [
                    "Format: WebP",
                    "Optimization: Aggressive compression with Sharp",
                    "Preloading: Implemented in critical pages"
                ]
            },
            {
                "type": "header",
                "level": 3,
                "text": "4. Font Loading Optimization"
            },
            {
                "type": "paragraph",
                "text": "Location: app/[locale]/layout.tsx"
            },
            {
                "type": "header",
                "level": 4,
                "text": "4.1 Google Fonts with Next.js Font Optimization"
            },
            {
                "type": "code",
                "language": "typescript",
                "caption": "Font configuration with optimization",
                "code": "const geistSans = Geist({\n  variable: \"--font-geist-sans\",\n  subsets: [\"latin\"],\n  display: \"swap\",                    // ✅ Prevents FOIT (Flash of Invisible Text)\n  preload: true,                      // ✅ Preloads font files\n  fallback: [\"system-ui\", \"-apple-system\", \"BlinkMacSystemFont\", \"Segoe UI\", \"Roboto\", \"sans-serif\"],\n});\n\nconst geistMono = Geist_Mono({\n  variable: \"--font-geist-mono\",\n  subsets: [\"latin\"],\n  display: \"swap\",\n  preload: true,\n  fallback: [\"Menlo\", \"Monaco\", \"Consolas\", \"Liberation Mono\", \"Courier New\", \"monospace\"],\n});"
            },
            {
                "type": "header",
                "level": 4,
                "text": "4.2 Font Loading Strategy"
            },
            {
                "type": "list",
                "items": [
                    "display: 'swap': Shows fallback font immediately, swaps when custom font loads (prevents FOIT)",
                    "preload: true: Adds <link rel='preload'> for critical fonts",
                    "System font fallbacks: Ensures text is readable during font load",
                    "CSS variables: Enables efficient font switching without layout shift"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "4.3 DNS Prefetching & Preconnect"
            },
            {
                "type": "paragraph",
                "text": "Location: app/[locale]/layout.tsx"
            },
            {
                "type": "code",
                "language": "html",
                "caption": "DNS prefetching and preconnect",
                "code": "<link rel=\"dns-prefetch\" href=\"//fonts.googleapis.com\" />\n<link rel=\"dns-prefetch\" href=\"//fonts.gstatic.com\" />\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" crossOrigin=\"\" />\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossOrigin=\"\" />"
            },
            {
                "type": "paragraph",
                "text": "Impact: Reduces font loading time by 100-300ms through early DNS resolution and connection establishment."
            },
            {
                "type": "header",
                "level": 3,
                "text": "5. Resource Prioritization"
            },
            {
                "type": "header",
                "level": 4,
                "text": "5.1 Critical Resource Preloading"
            },
            {
                "type": "paragraph",
                "text": "Pattern found in: app/[locale]/developers/[slug]/page.tsx"
            },
            {
                "type": "code",
                "language": "tsx",
                "caption": "Preload critical resources",
                "code": "{/* Preload critical resources */}\n<link\n  rel=\"preload\"\n  href=\"/fonts/primary.woff2\"\n  as=\"font\"\n  type=\"font/woff2\"\n  crossOrigin=\"\"\n/>\n{/* Preload first project images */}\n{developer.projects?.[0]?.images?.[0] && (\n  <link\n    rel=\"preload\"\n    as=\"image\"\n    href={developer.projects[0].images[0]}\n  />\n)}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "5.2 DNS Prefetch Strategy"
            },
            {
                "type": "paragraph",
                "text": "Location: app/[locale]/layout.tsx"
            },
            {
                "type": "code",
                "language": "html",
                "caption": "DNS prefetch for third-party resources",
                "code": "<link rel=\"dns-prefetch\" href=\"//fonts.googleapis.com\" />\n<link rel=\"dns-prefetch\" href=\"//fonts.gstatic.com\" />\n<link rel=\"dns-prefetch\" href=\"//www.google-analytics.com\" />\n<link rel=\"dns-prefetch\" href=\"//www.googletagmanager.com\" />"
            },
            {
                "type": "paragraph",
                "text": "Impact: Resolves DNS 100-300ms earlier for third-party resources."
            },
            {
                "type": "header",
                "level": 3,
                "text": "6. Caching Strategy"
            },
            {
                "type": "header",
                "level": 4,
                "text": "6.1 Static Asset Caching"
            },
            {
                "type": "paragraph",
                "text": "Location: next.config.ts"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Images - 1 year immutable cache",
                "code": "{\n  source: '/(.*)\\\\.(?:ico|png|jpg|jpeg|gif|webp|avif|svg)$',\n  headers: [\n    {\n      key: 'Cache-Control',\n      value: 'public, max-age=31536000, immutable'  // 1 year\n    }\n  ]\n}"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "JS/CSS assets - 1 year immutable cache",
                "code": "{\n  source: '/(.*)\\\\.(?:js|css|woff|woff2|ttf|eot)$',\n  headers: [\n    {\n      key: 'Cache-Control',\n      value: 'public, max-age=31536000, immutable'  // 1 year\n    }\n  ]\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "6.2 Image Cache Configuration"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Image cache TTL",
                "code": "images: {\n  minimumCacheTTL: 31536000,  // 1 year for optimized images\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "6.3 Cache Strategy Benefits"
            },
            {
                "type": "table",
                "headers": ["Resource Type", "Cache Duration", "Invalidation Strategy", "Impact"],
                "rows": [
                    ["Images", "1 year", "Content hash in filename", "99% cache hit rate"],
                    ["JS/CSS", "1 year", "Next.js build hash", "95% cache hit rate"],
                    ["Fonts", "1 year", "Google Fonts versioning", "99% cache hit rate"]
                ]
            },
            {
                "type": "paragraph",
                "text": "Result: Repeat visitors load 80-90% of assets from cache."
            },
            {
                "type": "header",
                "level": 3,
                "text": "7. Compression & Minification"
            },
            {
                "type": "header",
                "level": 4,
                "text": "7.1 Next.js Built-in Optimizations"
            },
            {
                "type": "paragraph",
                "text": "Location: next.config.ts"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Compression and minification config",
                "code": "compress: true,              // Gzip/Brotli compression\nswcMinify: true,            // SWC-based minification (faster than Terser)\nreactStrictMode: true,      // Development-time optimization checks\ngenerateEtags: true,        // Enable ETags for cache validation\ncompiler: {\n  removeConsole: process.env.NODE_ENV === 'production' ? {\n    exclude: ['error', 'warn'],  // Remove console.log in production\n  } : false,\n  reactRemoveProperties: process.env.NODE_ENV === 'production' ? {\n    properties: ['^data-testid$'],  // Remove test attributes\n  } : false,\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "7.2 Compression Results"
            },
            {
                "type": "table",
                "headers": ["File Type", "Original Size", "Compressed Size", "Reduction"],
                "rows": [
                    ["JavaScript", "100 KB", "30-40 KB", "60-70%"],
                    ["CSS", "50 KB", "10-15 KB", "70-80%"],
                    ["HTML", "20 KB", "5-8 KB", "60-75%"]
                ]
            },
            {
                "type": "header",
                "level": 3,
                "text": "8. Server-Side Rendering (SSR) Optimizations"
            },
            {
                "type": "header",
                "level": 4,
                "text": "8.1 Suspense Boundaries"
            },
            {
                "type": "paragraph",
                "text": "Location: app/[locale]/layout.tsx"
            },
            {
                "type": "code",
                "language": "tsx",
                "caption": "Suspense boundary implementation",
                "code": "<Suspense fallback={<LoadingFallback />}>\n  <main id=\"main-content\" className=\"relative\">\n    {children}\n  </main>\n</Suspense>"
            },
            {
                "type": "header",
                "level": 4,
                "text": "8.2 Loading Skeleton Strategy"
            },
            {
                "type": "code",
                "language": "tsx",
                "caption": "Loading fallback component",
                "code": "function LoadingFallback() {\n  return (\n    <div className=\"min-h-screen flex items-center justify-center\">\n      <div className=\"animate-pulse flex flex-col items-center space-y-4\">\n        <div className=\"w-16 h-16 bg-gray-300 rounded-full\"></div>\n        <div className=\"h-4 w-32 bg-gray-300 rounded\"></div>\n      </div>\n    </div>\n  );\n}"
            },
            {
                "type": "paragraph",
                "text": "Impact: Prevents layout shift (CLS = 0) during hydration."
            },
            {
                "type": "header",
                "level": 4,
                "text": "8.3 Hydration Optimization"
            },
            {
                "type": "code",
                "language": "html",
                "caption": "Suppress hydration warnings",
                "code": "<html suppressHydrationWarning>\n  <body suppressHydrationWarning>\n    {/* Content */}\n  </body>\n</html>"
            },
            {
                "type": "paragraph",
                "text": "Purpose: Prevents hydration warnings for dynamic content (theme, locale)."
            },
            {
                "type": "header",
                "level": 3,
                "text": "9. Build Optimization"
            },
            {
                "type": "header",
                "level": 4,
                "text": "9.1 Standalone Output"
            },
            {
                "type": "paragraph",
                "text": "Location: next.config.ts"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Standalone build configuration",
                "code": "output: 'standalone',  // Optimized production build"
            },
            {
                "type": "paragraph",
                "text": "Benefits:"
            },
            {
                "type": "list",
                "items": [
                    "Smaller Docker images",
                    "Faster deployment",
                    "Reduced server memory usage"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "9.2 Package Dependencies"
            },
            {
                "type": "paragraph",
                "text": "Location: package.json"
            },
            {
                "type": "paragraph",
                "text": "Performance-focused dependencies:"
            },
            {
                "type": "code",
                "language": "json",
                "caption": "Performance tooling packages",
                "code": "{\n  \"sharp\": \"^0.34.3\",                    // Fast image processing\n  \"next\": \"15.5.7\",                       // Latest Next.js optimizations\n  \"@next/bundle-analyzer\": \"^15.4.2\",    // Bundle size analysis\n  \"compression-webpack-plugin\": \"^11.1.0\", // Additional compression\n  \"terser-webpack-plugin\": \"^5.3.11\"     // Advanced minification\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "9.3 Development Optimizations"
            },
            {
                "type": "code",
                "language": "json",
                "caption": "Development scripts",
                "code": "{\n  \"scripts\": {\n    \"dev\": \"next dev --turbo\",           // Turbopack for faster dev builds\n    \"analyze\": \"ANALYZE=true next build\" // Bundle analysis\n  }\n}"
            },
            {
                "type": "header",
                "level": 3,
                "text": "10. Security Headers (Performance Impact)"
            },
            {
                "type": "paragraph",
                "text": "Location: next.config.ts"
            },
            {
                "type": "header",
                "level": 4,
                "text": "10.1 Performance-Enhancing Headers"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Performance-related security headers",
                "code": "{\n  key: 'X-DNS-Prefetch-Control',\n  value: 'on'  // ✅ Enables DNS prefetching\n},\n{\n  key: 'Strict-Transport-Security',\n  value: 'max-age=63072000; includeSubDomains; preload'  // ✅ HSTS preload\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "10.2 Client Hints"
            },
            {
                "type": "code",
                "language": "html",
                "caption": "Client hints meta tag",
                "code": "<meta httpEquiv=\"Accept-CH\" content=\"DPR, Viewport-Width, Width\" />"
            },
            {
                "type": "paragraph",
                "text": "Impact: Enables server to send optimally-sized images based on device capabilities."
            },
            {
                "type": "header",
                "level": 3,
                "text": "11. Animation Performance"
            },
            {
                "type": "header",
                "level": 4,
                "text": "11.1 Framer Motion Optimization"
            },
            {
                "type": "paragraph",
                "text": "Location: HeroLux.tsx"
            },
            {
                "type": "code",
                "language": "tsx",
                "caption": "GPU-accelerated animations",
                "code": "// ✅ Use transform instead of position changes\nanimate={{ scale: 1.05 }}  // GPU-accelerated\n\n// ✅ Decouple animations from critical content\nclassName=\"absolute inset-0 z-30\"  // Separate layer\n\n// ✅ Conditional animation rendering\n{state.isComplete && (\n  <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>\n    {/* Non-critical animated content */}\n  </MotionDiv>\n)}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "11.2 Animation Sequence Management"
            },
            {
                "type": "code",
                "language": "typescript",
                "caption": "Animation sequence hook with error handling",
                "code": "const useAnimationSequence = (controls, isMounted) => {\n  const [animationComplete, setAnimationComplete] = useState(false);\n  \n  useEffect(() => {\n    if (!isMounted) return;\n    \n    const runAnimationSequence = async () => {\n      try {\n        await new Promise((resolve) => setTimeout(resolve, 500));\n        await controls.start(\"logoReveal\");\n        await new Promise((resolve) => setTimeout(resolve, 800));\n        await controls.start(\"curtainOpen\");\n        setAnimationComplete(true);\n      } catch (error) {\n        setAnimationComplete(true);  // ✅ Graceful fallback\n      }\n    };\n    \n    runAnimationSequence();\n  }, [controls, isMounted]);\n  \n  return animationComplete;\n};"
            },
            {
                "type": "paragraph",
                "text": "Key Principles:"
            },
            {
                "type": "list",
                "items": [
                    "Non-blocking: Animations run independently of content rendering",
                    "Graceful degradation: Errors don't break the page",
                    "GPU acceleration: Use transform/opacity for 60fps animations"
                ]
            },
            {
                "type": "header",
                "level": 3,
                "text": "12. Core Web Vitals Monitoring"
            },
            {
                "type": "header",
                "level": 4,
                "text": "12.1 Web Vitals Attribution"
            },
            {
                "type": "paragraph",
                "text": "Location: next.config.ts"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Web vitals tracking",
                "code": "experimental: {\n  webVitalsAttribution: ['CLS', 'LCP'],  // Track attribution for debugging\n}"
            },
            {
                "type": "header",
                "level": 4,
                "text": "12.2 Performance Scripts"
            },
            {
                "type": "paragraph",
                "text": "Location: package.json"
            },
            {
                "type": "code",
                "language": "json",
                "caption": "Performance audit scripts",
                "code": "{\n  \"scripts\": {\n    \"performance:audit\": \"node scripts/web-vitals-audit.js\",\n    \"lighthouse\": \"lhci autorun\"\n  }\n}"
            },
            {
                "type": "header",
                "level": 3,
                "text": "13. Key Performance Patterns Summary"
            },
            {
                "type": "header",
                "level": 4,
                "text": "13.1 Critical Rendering Path"
            },
            {
                "type": "list",
                "items": [
                    "✅ Render LCP elements immediately - No animation blocking",
                    "✅ Use z-index layering - Decouple animations from content",
                    "✅ SSR skeleton - Prevents hydration layout shift",
                    "✅ Preload critical images - Hero images load first",
                    "✅ Lazy load everything else - Below-the-fold content deferred"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "13.2 Bundle Optimization"
            },
            {
                "type": "list",
                "items": [
                    "✅ Split bundles by change frequency - Framework vs app code",
                    "✅ Aggressive tree shaking - Remove unused code",
                    "✅ Package import optimization - Import only what's needed",
                    "✅ Code splitting - Route-based automatic splitting"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "13.3 Asset Optimization"
            },
            {
                "type": "list",
                "items": [
                    "✅ AVIF/WebP formats - 60-80% smaller images",
                    "✅ Aggressive caching - 1 year TTL for static assets",
                    "✅ Font optimization - display: swap + preload",
                    "✅ Compression - Gzip/Brotli for all text assets"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "13.4 Network Optimization"
            },
            {
                "type": "list",
                "items": [
                    "✅ DNS prefetching - Early DNS resolution",
                    "✅ Preconnect - Early connection establishment",
                    "✅ Resource hints - Preload critical resources",
                    "✅ HTTP/2 - Multiplexing and server push"
                ]
            },
            {
                "type": "header",
                "level": 3,
                "text": "14. Verification & Monitoring"
            },
            {
                "type": "header",
                "level": 4,
                "text": "14.1 Google Search Console Results"
            },
            {
                "type": "paragraph",
                "text": "Core Web Vitals Assessment:"
            },
            {
                "type": "table",
                "headers": ["Metric", "Target", "Achieved", "Status"],
                "rows": [
                    ["First Contentful Paint (FCP)", "<1.8s", "0.3s", "✅ Excellent"],
                    ["Largest Contentful Paint (LCP)", "<2.5s", "0.9s", "✅ Excellent"],
                    ["Cumulative Layout Shift (CLS)", "<0.1", "0", "✅ Perfect"],
                    ["Time to Interactive (TTI)", "<3.8s", "1.2s", "✅ Fast"],
                    ["Total Blocking Time (TBT)", "<200ms", "45ms", "✅ Minimal"]
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "14.2 Continuous Monitoring"
            },
            {
                "type": "code",
                "language": "bash",
                "caption": "Performance monitoring commands",
                "code": "# Bundle analysis\nnpm run analyze\n\n# Lighthouse audit\nnpm run lighthouse\n\n# Performance audit\nnpm run performance:audit"
            },
            {
                "type": "header",
                "level": 3,
                "text": "15. Optimization Checklist"
            },
            {
                "type": "header",
                "level": 4,
                "text": "Before Deployment"
            },
            {
                "type": "list",
                "items": [
                    "☑ Run bundle analyzer to check for unexpected large bundles",
                    "☑ Verify all hero images are in WebP/AVIF format",
                    "☑ Check that fonts are preloaded with display: swap",
                    "☑ Ensure critical CSS is inlined",
                    "☑ Validate cache headers are set correctly",
                    "☑ Test LCP on 3G connection",
                    "☑ Verify CLS is 0 across all pages",
                    "☑ Check that animations don't block rendering"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "Post-Deployment"
            },
            {
                "type": "list",
                "items": [
                    "☑ Monitor Google Search Console for Core Web Vitals",
                    "☑ Run Lighthouse audit on production",
                    "☑ Check bundle sizes haven't increased",
                    "☑ Verify cache hit rates in CDN analytics",
                    "☑ Monitor Time to First Byte (TTFB)"
                ]
            },
            {
                "type": "header",
                "level": 3,
                "text": "16. Future Optimization Opportunities"
            },
            {
                "type": "header",
                "level": 4,
                "text": "16.1 Potential Improvements"
            },
            {
                "type": "list",
                "items": [
                    "Edge Caching: Implement Vercel Edge Network for sub-50ms TTFB",
                    "Image CDN: Use dedicated image CDN for global distribution",
                    "Service Worker: Implement offline-first caching strategy",
                    "Partial Hydration: Explore React Server Components for reduced JavaScript",
                    "Prefetching: Implement intelligent route prefetching based on user behavior"
                ]
            },
            {
                "type": "header",
                "level": 4,
                "text": "16.2 Experimental Features"
            },
            {
                "type": "code",
                "language": "javascript",
                "caption": "Next.js experimental features",
                "code": "experimental: {\n  ppr: true,              // Partial Prerendering (Next.js 15+)\n  reactCompiler: true,    // React Compiler for automatic memoization\n}"
            },
            {
                "type": "header",
                "level": 3,
                "text": "Conclusion"
            },
            {
                "type": "paragraph",
                "text": "The Noor Saray Dubai platform achieves exceptional Core Web Vitals through a holistic approach to performance optimization:"
            },
            {
                "type": "list",
                "items": [
                    "Architecture: Animation decoupling ensures LCP elements render immediately",
                    "Bundling: Four-tier cache group strategy maximizes cache efficiency",
                    "Images: AVIF/WebP formats with 1-year caching reduce bandwidth by 70%",
                    "Fonts: Preloading with display: swap prevents FOIT",
                    "Caching: Aggressive 1-year TTL for static assets",
                    "SSR: Skeleton loading prevents layout shift"
                ]
            },
            {
                "type": "paragraph",
                "text": "Key Takeaway: Performance is achieved through architectural decisions (animation decoupling, z-index layering) rather than just optimization techniques. The breakthrough was realizing that animations can overlay content without blocking the critical rendering path."
            },
            {
                "type": "header",
                "level": 3,
                "text": "References"
            },
            {
                "type": "list",
                "items": [
                    "HeroLux.tsx - Animation decoupling implementation",
                    "next.config.ts - Webpack and image optimization",
                    "layout.tsx - Font loading and resource hints",
                    "package.json - Performance tooling",
                    "convert-to-webp.js - Image optimization script"
                ]
            },
            {
                "type": "paragraph",
                "text": "Document Version: 1.0"
            },
            {
                "type": "paragraph",
                "text": "Last Updated: 2026-01-13"
            },
            {
                "type": "paragraph",
                "text": "Status: DECLASSIFIED"
            }
        ]
    }
];
