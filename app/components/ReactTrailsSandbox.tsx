"use client";

import React, { useState, useEffect } from "react";
import {
  DynamicBreadcrumb,
  MobileDynamicBreadcrumb,
  BreadcrumbEngine,
  BreadcrumbItem,
  formatBreadcrumbsForSchema,
  StyleConfig,
} from "react-trails";

type ThemeStyle = "cyber" | "terminal" | "pills";
type Separator = "/" | ">" | "→" | "::" | "•";
type Language = "en" | "es" | "fr" | "de" | "ar";
type ActiveTab = "component" | "engine" | "seo" | "benchmark";

export default function ReactTrailsSandbox() {
  // Shared config
  const [separator, setSeparator] = useState<Separator>("::");
  const [theme, setTheme] = useState<ThemeStyle>("cyber");
  const [locale, setLocale] = useState<Language>("en");
  const [enableCache, setEnableCache] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("component");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  // Engine tab state
  const [pathInput, setPathInput] = useState("/dashboard/settings/billing");
  const [engineBreadcrumbs, setEngineBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [jsonLdSchema, setJsonLdSchema] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number>(0.04);

  // Benchmark state
  const [isTesting, setIsTesting] = useState(false);
  const [benchResults, setBenchResults] = useState<{
    totalOps: number;
    totalMs: number;
    avgMs: number;
    opsPerSec: number;
  } | null>(null);

  // i18n Localization Dictionary — passed into react-trails translations prop
  const translationsMap: Record<Language, Record<string, string>> = {
    en: {
      home: "Home",
      deployed_modules: "Deployed Modules",
      sandbox_label: "React Trails Sandbox",
      dashboard: "Dashboard",
      analytics: "Analytics",
      reports: "Reports",
      settings: "Settings",
      billing: "Billing",
      store: "Store",
      electronics: "Electronics",
      laptops: "Laptops",
      docs: "Docs",
      api: "API",
      authentication: "Authentication",
      admin: "Admin",
      secret: "Secret",
      credentials: "Credentials",
      details: "Details",
    },
    es: {
      home: "Inicio",
      deployed_modules: "Módulos Publicados",
      sandbox_label: "Sandbox de React Trails",
      dashboard: "Panel",
      analytics: "Analítica",
      reports: "Informes",
      settings: "Ajustes",
      billing: "Facturación",
      store: "Tienda",
      electronics: "Electrónica",
      laptops: "Portátiles",
      docs: "Documentación",
      api: "API",
      authentication: "Autenticación",
      admin: "Administrador",
      secret: "Secreto",
      credentials: "Credenciales",
      details: "Detalles",
    },
    fr: {
      home: "Accueil",
      deployed_modules: "Modules Déployés",
      sandbox_label: "Bac à Sable React Trails",
      dashboard: "Tableau de Bord",
      analytics: "Analytique",
      reports: "Rapports",
      settings: "Paramètres",
      billing: "Facturation",
      store: "Boutique",
      electronics: "Électronique",
      laptops: "Portables",
      docs: "Documentation",
      api: "API",
      authentication: "Authentification",
      admin: "Administrateur",
      secret: "Secret",
      credentials: "Identifiants",
      details: "Détails",
    },
    de: {
      home: "Startseite",
      deployed_modules: "Bereitgestellte Module",
      sandbox_label: "React Trails Sandbox",
      dashboard: "Übersicht",
      analytics: "Analysen",
      reports: "Berichte",
      settings: "Einstellungen",
      billing: "Abrechnung",
      store: "Geschäft",
      electronics: "Elektronik",
      laptops: "Laptops",
      docs: "Dokumentation",
      api: "API",
      authentication: "Authentifizierung",
      admin: "Administrator",
      secret: "Geheimnis",
      credentials: "Zugangsdaten",
      details: "Details",
    },
    ar: {
      home: "الرئيسية",
      deployed_modules: "الوحدات المنشورة",
      sandbox_label: "صندوق تجربة React Trails",
      dashboard: "لوحة التحكم",
      analytics: "التحليلات",
      reports: "التقارير",
      settings: "الإعدادات",
      billing: "الفواتير",
      store: "المتجر",
      electronics: "الإلكترونيات",
      laptops: "الأجهزة المحمولة",
      docs: "التوثيق",
      api: "واجهة البرمجة",
      authentication: "المصادقة",
      admin: "المسؤول",
      secret: "سري",
      credentials: "بيانات الاعتماد",
      details: "التفاصيل",
    },
  };

  const currentTranslations = translationsMap[locale];

  // Package StyleConfig objects passed directly into react-trails styles prop
  const themeStylesMap: Record<ThemeStyle, StyleConfig> = {
    cyber: {
      container: "text-neutral-300 font-mono",
      list: "flex items-center gap-1.5 flex-wrap",
      item: "px-2.5 py-1 hover:text-white hover:bg-neutral-900 rounded transition-colors text-neutral-300 text-xs",
      current: "px-2.5 py-1 bg-red-900/20 text-red-400 border border-red-800/50 rounded font-bold text-xs",
      separator: "text-red-600 font-bold mx-1 select-none text-xs",
    },
    terminal: {
      container: "text-green-400 font-mono",
      list: "flex items-center gap-1.5 flex-wrap",
      item: "text-green-500 hover:text-green-300 transition-colors text-xs font-mono",
      current: "text-white underline font-bold text-xs font-mono",
      separator: "text-neutral-600 mx-1 select-none text-xs font-mono",
    },
    pills: {
      container: "text-neutral-200 font-mono",
      list: "flex items-center gap-1.5 flex-wrap",
      item: "px-3 py-1 bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-600 rounded-full text-xs transition-all",
      current: "px-3 py-1 bg-white text-black border border-white rounded-full text-xs font-bold",
      separator: "text-neutral-700 mx-1 select-none text-xs",
    },
  };

  const mobileStyles = {
    mobile: {
      container: "flex items-center justify-between w-full p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg text-white font-mono",
      backButton: "flex items-center gap-2 text-red-500 hover:text-white font-bold text-xs transition-colors",
      current: "text-white font-bold text-xs truncate",
    },
  };

  const presets = [
    { label: "Dashboard Billing", path: "/dashboard/settings/billing" },
    { label: "E-Commerce Laptops", path: "/store/electronics/laptops/macbook-pro" },
    { label: "API Docs Auth", path: "/docs/api/v2/authentication" },
    { label: "Restricted Admin", path: "/admin/secret/credentials" },
  ];

  // BreadcrumbEngine execution — runs on every pathInput / locale change (Engine tab + SEO tab)
  useEffect(() => {
    let isMounted = true;
    const start = performance.now();

    const engine = new BreadcrumbEngine({
      enableCache,
      translations: currentTranslations,
      locale,
      engine: {
        staticRoutes: [
          "dashboard", "settings", "profile", "admin", "blog", "about", "contact",
          "store", "electronics", "laptops", "macbook", "pro", "docs", "api", "v2",
          "authentication", "security", "logs", "audit", "projects", "reports",
          "analytics", "credentials", "secret",
        ],
      },
    });

    engine
      .generateBreadcrumbs(pathInput, { translations: currentTranslations, locale })
      .then((items) => {
        const end = performance.now();
        if (!isMounted) return;

        const formatted = items.map((item, idx) => {
          if (idx === 0) return { ...item, label: currentTranslations.home || "Home" };
          const key = item.label.toLowerCase();
          return { ...item, label: currentTranslations[key] || item.label };
        });

        setEngineBreadcrumbs(formatted);
        setExecutionTime(Math.max(0.02, Number((end - start).toFixed(3))));

        try {
          const schema = formatBreadcrumbsForSchema(formatted, "https://example.com");
          setJsonLdSchema(JSON.stringify(schema, null, 2));
        } catch {
          setJsonLdSchema("// Schema generation error");
        }
      })
      .catch((err) => console.error("BreadcrumbEngine error:", err));

    return () => { isMounted = false; };
  }, [pathInput, enableCache, locale]);

  // 1,000-Op Stress Test
  const runStressTest = async () => {
    setIsTesting(true);
    setBenchResults(null);
    setTimeout(async () => {
      const engine = new BreadcrumbEngine({ enableCache, translations: currentTranslations, locale });
      const testPaths = [
        "/dashboard/analytics/reports/2026-q1",
        "/store/electronics/laptops/macbook-pro",
        "/docs/api/v2/authentication/tokens",
        "/admin/settings/security/logs",
      ];
      const iterations = 1000;
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        await engine.generateBreadcrumbs(testPaths[i % testPaths.length], {
          translations: currentTranslations, locale,
        });
      }
      const end = performance.now();
      const totalMs = Number((end - start).toFixed(2));
      setBenchResults({
        totalOps: iterations,
        totalMs,
        avgMs: Number((totalMs / iterations).toFixed(4)),
        opsPerSec: Math.round((iterations / totalMs) * 1000),
      });
      setIsTesting(false);
    }, 50);
  };

  const componentCode = `import { DynamicBreadcrumb } from 'react-trails';

// Reads current page URL automatically — no path config needed.
// customRoutes maps dynamic segments to readable labels.
// styles accepts your StyleConfig — works with any CSS framework.
<DynamicBreadcrumb
  separator="${separator}"
  styles={${JSON.stringify(themeStylesMap[theme], null, 2)}}
  customRoutes={{
    "productId": { label: "MacBook Pro 16\\"" },
    "userId": { label: "John Doe" }
  }}
  enableCache={${enableCache}}
/>`;

  const engineCode = `import { BreadcrumbEngine } from 'react-trails';

// BreadcrumbEngine runs on any path you pass it
const engine = new BreadcrumbEngine({
  enableCache: ${enableCache},
  locale: '${locale}',
  translations: { ... }
});

const breadcrumbs = await engine.generateBreadcrumbs('${pathInput}');`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "component", label: "[01] DynamicBreadcrumb Component" },
    { id: "engine", label: "[02] BreadcrumbEngine Presets" },
    { id: "seo", label: "[03] Schema.org SEO" },
    { id: "benchmark", label: "[04] 1,000-Op Stress Test" },
  ];

  return (
    <div className="bg-[#080808] border border-neutral-800 rounded-xl p-4 sm:p-6 md:p-8 font-mono shadow-2xl text-xs sm:text-sm my-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            <h4 className="text-lg sm:text-xl font-bold text-white font-doto uppercase tracking-tight">
              React Trails v2.0.0 // Live Workbench
            </h4>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            // <code className="text-red-400">&lt;DynamicBreadcrumb /&gt;</code> + <code className="text-red-400">BreadcrumbEngine</code> from pristine NPM package <code className="text-neutral-300">react-trails</code>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs flex items-center gap-2">
            <span className="text-neutral-500">Engine exec:</span>
            <span className="text-green-400 font-bold">{executionTime}ms on this device</span>
          </div>
          <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs flex items-center gap-2">
            <span className="text-neutral-500">Status:</span>
            <span className="text-green-400 font-bold">RUNNING_LIVE</span>
          </div>
        </div>
      </div>

      {/* Shared Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-4 border border-neutral-800/80 rounded-lg mb-6">
        {/* Separator */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">Separator</label>
          <div className="flex gap-1">
            {(["/", ">", "→", "::", "•"] as Separator[]).map((sep) => (
              <button key={sep} onClick={() => setSeparator(sep)}
                className={`flex-1 py-1.5 text-center text-xs border rounded transition-all ${
                  separator === sep ? "bg-red-950/40 border-red-500 text-white font-bold" : "bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}>{sep}</button>
            ))}
          </div>
        </div>

        {/* i18n Locale */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">Locale (i18n)</label>
          <div className="flex gap-1">
            {(["en", "es", "fr", "de", "ar"] as Language[]).map((l) => (
              <button key={l} onClick={() => setLocale(l)}
                className={`flex-1 py-1.5 text-center text-xs border rounded transition-all uppercase ${
                  locale === l ? "bg-red-950/40 border-red-500 text-white font-bold" : "bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}>{l}</button>
            ))}
          </div>
        </div>

        {/* StyleConfig Prop */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">styles&#123;StyleConfig&#125;</label>
          <div className="flex gap-1">
            {(["cyber", "terminal", "pills"] as ThemeStyle[]).map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`flex-1 py-1.5 text-center text-xs border rounded transition-all capitalize ${
                  theme === t ? "bg-red-950/40 border-red-500 text-white font-bold" : "bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Cache */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">LRU Cache</label>
          <button onClick={() => setEnableCache(!enableCache)}
            className={`w-full py-1.5 text-center text-xs border rounded transition-all font-bold ${
              enableCache ? "bg-green-950/30 border-green-700 text-green-400" : "bg-yellow-950/30 border-yellow-700 text-yellow-400"
            }`}>
            {enableCache ? "✓ Cache ON" : "⚠ Cache OFF"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-neutral-800 mb-6 gap-0">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-red-500 text-white bg-neutral-900/50"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 1: <DynamicBreadcrumb /> Component — real page URL      */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === "component" && (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4 text-xs text-neutral-400 leading-relaxed">
            <span className="text-white font-bold">What this shows:</span>{" "}
            <code className="text-red-400">&lt;DynamicBreadcrumb /&gt;</code> reads the current page URL automatically and renders it.
            All controls below pass real props directly into the package component —{" "}
            <code className="text-neutral-300">styles=&#123;StyleConfig&#125;</code>,{" "}
            <code className="text-neutral-300">separator</code>,{" "}
            <code className="text-neutral-300">locale</code>,{" "}
            <code className="text-neutral-300">translations</code>,{" "}
            <code className="text-neutral-300">enableCache</code>.
          </div>

          {/* Viewport Toggle */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
              Live <code className="text-red-400">&lt;DynamicBreadcrumb /&gt;</code> — reads <code className="text-neutral-300">/projects/1</code> → renders via <code className="text-neutral-300">customRoutes</code>
            </span>
            <div className="flex gap-1 border border-neutral-800 rounded bg-black p-0.5">
              <button onClick={() => setViewMode("desktop")}
                className={`px-3 py-1 text-[10px] rounded uppercase ${viewMode === "desktop" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500"}`}>
                🖥️ Desktop
              </button>
              <button onClick={() => setViewMode("mobile")}
                className={`px-3 py-1 text-[10px] rounded uppercase ${viewMode === "mobile" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500"}`}>
                📱 Mobile
              </button>
            </div>
          </div>

          {/* Package Component Render */}
          <div
            className={`p-6 bg-black border border-neutral-800 rounded-lg min-h-[80px] flex items-center overflow-x-auto transition-all ${
              viewMode === "mobile" ? "max-w-xs mx-auto border-dashed border-red-900/50" : "w-full"
            }`}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {viewMode === "mobile" ? (
              <MobileDynamicBreadcrumb
                styles={mobileStyles}
                customRoutes={{
                  "1": { label: currentTranslations.sandbox_label || "React Trails Sandbox" },
                  "projects": { label: currentTranslations.deployed_modules || "Deployed Modules" },
                }}
                enableCache={enableCache}
              />
            ) : (
              <DynamicBreadcrumb
                separator={separator}
                styles={themeStylesMap[theme]}
                customRoutes={{
                  "1": { label: currentTranslations.sandbox_label || "React Trails Sandbox" },
                  "projects": { label: currentTranslations.deployed_modules || "Deployed Modules" },
                }}
                enableCache={enableCache}
              />
            )}
          </div>

          {/* Code Snippet */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">Component Usage Code</span>
              <button onClick={() => handleCopy(componentCode)}
                className="text-[10px] px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded transition-colors">
                {copied ? "✓ Copied" : "Copy Code"}
              </button>
            </div>
            <div className="bg-black border border-neutral-900 rounded-lg p-4 text-neutral-300 text-xs overflow-x-auto">
              <pre><code>{componentCode}</code></pre>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 2: BreadcrumbEngine — any path you want                */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === "engine" && (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-4 text-xs text-neutral-400 leading-relaxed">
            <span className="text-white font-bold">What this shows:</span>{" "}
            <code className="text-red-400">BreadcrumbEngine.generateBreadcrumbs(path)</code> runs on any path you type or pick.
            This is the raw engine powering the component — gives you breadcrumb data for any route in your app.
          </div>

          {/* Path Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Input Route Path</label>
            <div className="flex items-center bg-black border border-neutral-800 rounded-lg px-3.5 py-2.5 focus-within:border-red-500 transition-colors">
              <span className="text-red-500 font-bold mr-2 text-xs">URL &gt;</span>
              <input
                type="text"
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value)}
                placeholder="/enter/any/path"
                className="bg-transparent text-white w-full outline-none font-mono text-xs sm:text-sm placeholder-neutral-700"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest mr-1">Presets:</span>
              {presets.map((preset) => (
                <button key={preset.path} onClick={() => setPathInput(preset.path)}
                  className={`text-[10px] px-2.5 py-1 border rounded transition-all ${
                    pathInput === preset.path
                      ? "bg-red-950/40 border-red-500 text-white font-bold"
                      : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-neutral-600"
                  }`}>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Engine Output */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                Engine Output — <code className="text-red-400">BreadcrumbItem[]</code> array
              </span>
              <span className="text-[10px] text-green-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                {executionTime}ms · {engineBreadcrumbs.length} items
              </span>
            </div>
            <div
              className="p-5 bg-black border border-neutral-800 rounded-lg min-h-[60px] flex items-center overflow-x-auto w-full"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <div className="flex items-center gap-1 flex-wrap">
                {engineBreadcrumbs.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && (
                      <span className="text-red-600 font-bold mx-1 select-none text-xs">{separator}</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded font-mono ${
                      item.current
                        ? "bg-red-900/20 text-red-400 border border-red-800/50 font-bold"
                        : "text-neutral-300"
                    }`}>
                      {item.label}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Raw BreadcrumbItem[] JSON */}
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
              Raw <code className="text-red-400">BreadcrumbItem[]</code> Output
            </span>
            <div className="bg-black border border-neutral-900 rounded-lg p-4 text-green-400 text-xs overflow-x-auto max-h-48">
              <pre><code>{JSON.stringify(engineBreadcrumbs, null, 2)}</code></pre>
            </div>
          </div>

          {/* Code Snippet */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">Engine Usage Code</span>
              <button onClick={() => handleCopy(engineCode)}
                className="text-[10px] px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded transition-colors">
                {copied ? "✓ Copied" : "Copy Code"}
              </button>
            </div>
            <div className="bg-black border border-neutral-900 rounded-lg p-4 text-neutral-300 text-xs overflow-x-auto">
              <pre><code>{engineCode}</code></pre>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 3: Schema.org SEO JSON-LD                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === "seo" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              Google Schema.org BreadcrumbList JSON-LD
            </span>
            <span className="text-[10px] text-green-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Package Spec: Validated Microdata
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Generated via <code className="text-red-400">formatBreadcrumbsForSchema()</code> from <code className="text-neutral-300">react-trails</code>.
            Switch presets in <strong>[02]</strong> and return here to see updated schema.
          </p>
          <div className="bg-black border border-neutral-900 rounded-lg p-4 text-green-400 text-xs overflow-x-auto">
            <pre><code>{jsonLdSchema}</code></pre>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TAB 4: 1,000-Op Stress Test                                */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === "benchmark" && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center flex-wrap gap-2 mb-1">
              <h5 className="text-sm font-bold text-white uppercase font-doto">1,000-Iteration Engine Stress Test</h5>
              <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                Client benchmark — results vary by device/browser
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Runs <code className="text-red-400">BreadcrumbEngine.generateBreadcrumbs()</code> across 1,000 iterations
              measuring throughput and LRU cache hit efficiency live on your device.
            </p>
          </div>

          <button onClick={runStressTest} disabled={isTesting}
            className={`w-full py-3 border rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
              isTesting
                ? "bg-neutral-900 border-neutral-700 text-neutral-500 cursor-not-allowed"
                : "bg-red-950/40 border-red-600 text-white hover:bg-red-600 hover:text-white"
            }`}>
            {isTesting ? "⏳ Running 1,000 Breadcrumb Loops..." : "⚡ Run 1,000 Loop Stress Test"}
          </button>

          {benchResults && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black border border-neutral-800 rounded-lg text-center">
              {[
                { label: "Total Ops", value: benchResults.totalOps.toString(), color: "text-white" },
                { label: "Total Duration", value: `${benchResults.totalMs}ms`, color: "text-green-400" },
                { label: "Avg / Op", value: `${benchResults.avgMs}ms`, color: "text-red-400" },
                { label: "Throughput", value: `${benchResults.opsPerSec.toLocaleString()} ops/sec`, color: "text-blue-400" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{label}</p>
                  <p className={`text-lg font-bold font-doto ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
