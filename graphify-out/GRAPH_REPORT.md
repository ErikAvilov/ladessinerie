# Graph Report - ladessinerie  (2026-10-28)

## Corpus Check
- Large corpus: 146 files · ~1,581,690 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 630 nodes · 1217 edges · 80 communities (24 shown, 53 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Site Panels
- Site Theme
- API Routes
- Site Panels (3)
- Cart & Meteor Flight
- components/illustration-image.tsx
- API Routes (6)
- TypeScript Config
- Particulier Dive
- API Routes (9)
- Site Panels (10)
- Site Panels (11)
- Dependencies
- components/pro-dive-overlay.tsx
- components/pro-category-client.tsx
- Site Panels (15)
- Dependencies (16)
- app/contact
- components/navigation-progress.tsx
- Dependencies (19)
- app/admin
- app/admin (21)
- API Routes (22)
- Site Panels (23)
- Site Panels (24)
- Site Panels (25)
- AGENTS.md
- Site Panels (27)
- Site Panels (28)
- Dependencies (31)
- Dependencies (32)
- next.config.mjs
- next-env.d.ts
- Dependencies (35)
- Dependencies (36)
- Dependencies (37)
- Dependencies (38)
- Dependencies (39)
- Dependencies (40)
- Dependencies (41)
- Dependencies (42)
- Print Catalog Images
- Print Catalog Images (45)
- Print Catalog Images (46)
- Print Catalog Images (47)
- Print Catalog Images (48)
- Print Catalog Images (49)
- Print Catalog Images (50)
- Print Catalog Images (51)
- Print Catalog Images (52)
- Print Catalog Images (53)
- Print Catalog Images (54)
- Print Catalog Images (55)
- Print Catalog Images (56)
- Print Catalog Images (57)
- Print Catalog Images (58)
- Print Catalog Images (59)
- Print Catalog Images (60)
- Print Catalog Images (61)
- Print Catalog Images (62)
- Print Catalog Images (63)
- Print Catalog Images (64)
- Print Catalog Images (65)
- Print Catalog Images (66)
- Print Catalog Images (67)
- Print Catalog Images (68)
- Print Catalog Images (69)
- Print Catalog Images (70)
- UI Assets
- UI Assets (72)
- UI Assets (73)
- UI Assets (74)
- UI Assets (75)
- UI Assets (76)
- UI Assets (77)
- UI Assets (78)
- README.md

## God Nodes (most connected - your core abstractions)
1. `illustrationAlt()` - 17 edges
2. `Illustration` - 17 edges
3. `compilerOptions` - 16 edges
4. `getIllustrations()` - 15 edges
5. `getIllustrationById()` - 15 edges
6. `shouldUseBlobStorage()` - 14 edges
7. `useSiteTheme()` - 12 edges
8. `AdminDashboard()` - 11 edges
9. `assertPersistentStorageConfigured()` - 11 edges
10. `writePublicJsonBlob()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `confirmDelete()` --calls--> `deleteIllustration()`  [EXTRACTED]
  components/admin-dashboard.tsx → lib/admin-actions.ts
- `saveTheme()` --calls--> `updateSiteTheme()`  [EXTRACTED]
  components/admin-site-theme.tsx → lib/admin-actions.ts
- `PanelsLayout()` --calls--> `getPanelsIllustrations`  [EXTRACTED]
  app/(panels)/layout.tsx → lib/panels-data.ts
- `HomePage()` --calls--> `getPanelsIllustrations`  [EXTRACTED]
  app/(panels)/page.tsx → lib/panels-data.ts
- `generateMetadata()` --calls--> `getParticulierCategory()`  [EXTRACTED]
  app/(panels)/particulier/[category]/page.tsx → lib/particulier-categories.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Particulier print catalog images** — public_illustrations_print_bellecour_asset, public_illustrations_print_boule_dete_asset, public_illustrations_print_bulldream_asset, public_illustrations_print_coffee_coffee_coffee_asset, public_illustrations_print_coffee_dream_asset, public_illustrations_print_coquelico_co_asset, public_illustrations_print_dance_with_me_asset, public_illustrations_print_famille_asset, public_illustrations_print_fourviere_asset, public_illustrations_print_fuck_allergies_asset, public_illustrations_print_illu_teuil_asset, public_illustrations_print_kavepoulpe_asset, public_illustrations_print_marguerites_au_plat_asset, public_illustrations_print_mon_ideal_asset, public_illustrations_print_my_dream_asset, public_illustrations_print_papier_petales_asset, public_illustrations_print_papo_illu_asset, public_illustrations_print_pik_nik_asset, public_illustrations_print_retro_flower_asset, public_illustrations_print_rockillu_asset, public_illustrations_print_slow_coffee_asset, public_illustrations_print_superchair_asset, public_illustrations_print_swimming_coffee_asset, public_illustrations_print_table_dautomne_asset, public_illustrations_print_table_dete_asset, public_illustrations_print_tabou_fleur_asset, public_illustrations_print_wavy_blue_asset [INFERRED 0.85]

## Communities (80 total, 53 thin omitted)

### Community 0 - "Site Panels"
Cohesion: 0.06
Nodes (52): PanelsLayout(), revalidate, HomePage(), revalidate, AboutPageClient(), HomePageClient(), HomePageClientProps, DESKTOP_LAYOUT (+44 more)

### Community 1 - "Site Theme"
Cohesion: 0.05
Nodes (52): AdminSiteThemePanel(), saveTheme(), selectTab(), syncFromHash(), AdminSiteThemePanelProps, isThemeTab(), setHash(), TABS (+44 more)

### Community 2 - "API Routes"
Cohesion: 0.10
Nodes (49): AdminPage(), dynamic, parseSizes(), POST(), runtime, metadata, revalidate, RootLayout() (+41 more)

### Community 3 - "Site Panels (3)"
Cohesion: 0.07
Nodes (35): dynamic, EditIllustrationPage(), EditIllustrationPageProps, ArtPageProps, generateMetadata(), ParticulierArtPage(), revalidate, dynamic (+27 more)

### Community 4 - "Cart & Meteor Flight"
Cohesion: 0.08
Nodes (34): CaddieIcon(), CaddieIconProps, loadCaddieSvg(), CADDIE_SIZE, FloatingCaddie(), FloatingCaddieProps, FloatingCaddieSize, CART_SIZE (+26 more)

### Community 5 - "components/illustration-image.tsx"
Cohesion: 0.10
Nodes (26): metadata, IllustrationImage(), handleError(), handleLoad(), markReady(), IllustrationImageProps, InstantLink(), InstantLinkProps (+18 more)

### Community 6 - "API Routes (6)"
Cohesion: 0.16
Nodes (24): DELETE(), POST(), sleep(), adminCookieOptions(), clearAdminCookieOptions(), assertLoginAllowed(), Bucket, clearLoginFailures() (+16 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 8 - "Particulier Dive"
Cohesion: 0.15
Nodes (14): useNavigationProgress(), ParticulierDiveContext, ParticulierDiveContextValue, ParticulierDivePayload, ParticulierDiveProvider(), ParticulierDiveOverlay(), ParticulierDiveOverlayProps, Rect (+6 more)

### Community 9 - "API Routes (9)"
Cohesion: 0.16
Nodes (14): CheckoutBody, CheckoutLineInput, normalizeLines(), POST(), runtime, siteOrigin(), toStripeImages(), metadata (+6 more)

### Community 10 - "Site Panels (10)"
Cohesion: 0.17
Nodes (5): ArtDetailSkeleton(), CategoryGridSkeleton(), PanierSkeleton(), ROUND, ShimmerProps

### Community 11 - "Site Panels (11)"
Cohesion: 0.25
Nodes (11): CategoryPageProps, dynamic, generateMetadata(), ProCategoryPage(), PageTransition(), filterProIllustrationsByCategory(), getProCategory(), isProCategorySlug() (+3 more)

### Community 12 - "Dependencies"
Cohesion: 0.15
Nodes (13): framer-motion, dependencies, framer-motion, server-only, sharp, stripe, @tailwindcss/postcss, @vercel/analytics (+5 more)

### Community 13 - "components/pro-dive-overlay.tsx"
Cohesion: 0.25
Nodes (9): DIVE_DURATION_MS, ProDiveOverlay(), ProDiveOverlayProps, Rect, ARC_LAYOUT, DiveState, ProPageClient(), ProCategory (+1 more)

### Community 14 - "components/pro-category-client.tsx"
Cohesion: 0.27
Nodes (8): ParticulierCategoryClient(), ProCategoryClient(), ProCategoryClientProps, ProjectCard(), useSiteTheme(), proProjectPath(), prefetched, usePrefetchOnIntent()

### Community 15 - "Site Panels (15)"
Cohesion: 0.33
Nodes (7): CategoryPageProps, dynamic, generateMetadata(), ParticulierCategoryPage(), filterIllustrationsByCategory(), getParticulierCategory(), isParticulierCategorySlug()

### Community 16 - "Dependencies (16)"
Cohesion: 0.22
Nodes (9): devDependencies, @types/node, @types/react, @types/react-dom, typescript, @types/node, @types/react, @types/react-dom (+1 more)

### Community 17 - "app/contact"
Cohesion: 0.29
Nodes (4): dynamic, metadata, ContactForm(), ContactFormProps

### Community 18 - "components/navigation-progress.tsx"
Cohesion: 0.32
Nodes (6): isInternalNavAnchor(), NavigationProgressContext, NavigationProgressProvider(), onClick(), NavigationProgressValue, sameDestination()

### Community 19 - "Dependencies (19)"
Cohesion: 0.25
Nodes (7): name, private, scripts, build, dev, start, version

### Community 20 - "app/admin"
Cohesion: 0.47
Nodes (3): metadata, AdminShell(), unlockDocumentScroll()

### Community 21 - "app/admin (21)"
Cohesion: 0.60
Nodes (4): AdminLoginPage(), handleSubmit(), nextPathFromLocation(), safeNextPath()

### Community 22 - "API Routes (22)"
Cohesion: 0.50
Nodes (4): clean(), ContactBody, POST(), runtime

### Community 26 - "AGENTS.md"
Cohesion: 0.67
Nodes (3): Next.js agent rules, Next.js breaking API changes, CLAUDE.md includes AGENTS.md

## Knowledge Gaps
- **212 isolated node(s):** `dynamic`, `metadata`, `revalidate`, `revalidate`, `dynamic` (+207 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 257 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Illustration` connect `Site Panels` to `API Routes`, `Site Panels (3)`, `Cart & Meteor Flight`, `components/illustration-image.tsx`, `components/pro-category-client.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `illustrationAlt()` connect `Site Panels (3)` to `Site Panels`, `components/illustration-image.tsx`, `components/pro-category-client.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `getIllustrations()` connect `API Routes` to `Site Panels`, `Site Panels (11)`, `Site Panels (15)`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `dynamic`, `metadata`, `revalidate` to the rest of the system?**
  _212 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Site Panels` be split into smaller, more focused modules?**
  _Cohesion score 0.05672926447574335 - nodes in this community are weakly interconnected._
- **Should `Site Theme` be split into smaller, more focused modules?**
  _Cohesion score 0.05273937532002048 - nodes in this community are weakly interconnected._
- **Should `API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.09921355111917725 - nodes in this community are weakly interconnected._