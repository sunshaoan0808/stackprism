<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps<{
    lang?: string
  }>()
</script>

<template>
  <section class="sp-hero">
    <!-- 背景渐变光晕 -->
    <div class="sp-hero__bg" aria-hidden="true">
      <div class="sp-hero__glow sp-hero__glow--blue"></div>
      <div class="sp-hero__glow sp-hero__glow--purple"></div>
      <div class="sp-hero__glow sp-hero__glow--teal"></div>
    </div>

    <div class="sp-hero__inner">
      <!-- 左侧文案 -->
      <div class="sp-hero__copy">
        <!-- Logo + Title -->
        <div class="sp-hero__brand">
          <div class="sp-hero__logo" aria-label="StackPrism logo">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 4 L52 28 L28 52 L4 28 Z" fill="none" />
              <!-- Top: teal -->
              <path d="M28 4 L52 28 L28 28 Z" fill="#14B8A6" />
              <!-- Right: blue -->
              <path d="M52 28 L28 52 L28 28 Z" fill="#2563EB" />
              <!-- Bottom: orange/yellow -->
              <path d="M28 52 L4 28 L28 28 Z" fill="#F59E0B" />
              <!-- Left: purple -->
              <path d="M4 28 L28 4 L28 28 Z" fill="#6366F1" />
              <!-- Inner highlight lines -->
              <path d="M28 4 L28 28 M52 28 L28 28 M28 52 L28 28 M4 28 L28 28" stroke="rgba(255,255,255,0.15)" stroke-width="0.5" />
            </svg>
          </div>
          <div class="sp-hero__title-group">
            <h1 class="sp-hero__title">StackPrism</h1>
            <p class="sp-hero__subtitle">Web Technology Stack Identifier</p>
          </div>
        </div>

        <!-- Tagline -->
        <p class="sp-hero__tagline">
          A Manifest V3 browser extension that detects web technology stacks, supporting
          <span class="sp-hero__highlight">Chrome / Edge / Firefox</span>
          .
        </p>

        <!-- Feature list -->
        <ul class="sp-hero__features">
          <li>Frontend &amp; UI Frameworks</li>
          <li>Build Tools &amp; Runtime</li>
          <li>Analytics &amp; CDN</li>
          <li>Security &amp; Response Headers</li>
          <li>Payment &amp; Auth Services</li>
          <li>CMS &amp; SaaS Platforms</li>
        </ul>

        <!-- Browser icons -->
        <div class="sp-hero__browsers">
          <div class="sp-hero__browser">
            <!-- Chrome -->
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19" fill="#fff" stroke="#e5e7eb" stroke-width="1" />
              <circle cx="20" cy="20" r="8" fill="#4285F4" />
              <path d="M20 12 A8 8 0 0 1 26.93 16 L20 20 Z" fill="#EA4335" />
              <path d="M26.93 16 L34 16 A14 14 0 0 1 20 34 L20 26 A8 8 0 0 0 26.93 16 Z" fill="#FBBC05" />
              <path d="M20 34 A14 14 0 0 1 6 20 L13.07 24 A8 8 0 0 0 20 28 Z" fill="#34A853" />
              <circle cx="20" cy="20" r="5" fill="#4285F4" />
              <circle cx="20" cy="20" r="3" fill="white" />
            </svg>
            <span>Chrome</span>
          </div>
          <div class="sp-hero__browser">
            <!-- Edge -->
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19" fill="#fff" stroke="#e5e7eb" stroke-width="1" />
              <path
                d="M32 18c0 8-5.6 13-13 13a12 12 0 0 1-9-4c1 1 3 2.5 6 2.5 5 0 8-3.5 8-7.5 0-2-1-4-3-5.5C24.5 19 28 21 28 25c0-1.5-.5-3-1.5-4 2 1 4 3.5 4 6.5 0 5-4.5 9-10.5 9C13 36.5 8 31 8 24c0-7.5 5.5-13 12.5-13C26 11 32 14 32 18z"
                fill="url(#edge-grad)"
              />
              <defs>
                <linearGradient id="edge-grad" x1="8" y1="11" x2="32" y2="36.5" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#0078D4" />
                  <stop offset="100%" stop-color="#50E6FF" />
                </linearGradient>
              </defs>
            </svg>
            <span>Edge</span>
          </div>
          <div class="sp-hero__browser">
            <!-- Firefox -->
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19" fill="#fff" stroke="#e5e7eb" stroke-width="1" />
              <circle cx="20" cy="20" r="12" fill="#FF9500" />
              <path
                d="M20 8c-6.6 0-12 5.4-12 12 0 5 3 9.4 7.4 11.3-1-2-.6-4.5 1-6.2.8-.8 2-1.3 3-2 1.5-1 2.5-2.6 2.1-4.5 2 1.8 2.5 4.4 1.4 6.5 3.5-1.8 5.1-5.8 4-9.4C28.8 19 30 22 30 25.5c.2-1.7.3-3.4 0-5.1C29 15 25 11 20 8z"
                fill="#FF0039"
              />
              <path
                d="M20 8c-1.3 0-2.6.2-3.8.5.7.4 1.3 1 1.8 1.7 1.4 2 1 4.7-.8 6.2-1.2 1-2.7 1.4-3.7 2.5-2 2.2-2 5.5-.4 7.8 1 1.5 2.5 2.5 4.2 2.5 1.8 0 3.2-.8 4.2-2C23.4 25 24 22 23 20c1.4 1 2.5 2.5 2.8 4.2.4-1.4.6-2.9.6-4.4C26.4 13.5 23.5 9.3 20 8z"
                fill="#FF9500"
              />
            </svg>
            <span>Firefox</span>
          </div>
        </div>

        <!-- CTA buttons -->
        <div class="sp-hero__actions">
          <a href="/guide/install" class="sp-btn sp-btn--primary">安装扩展</a>
          <a href="https://github.com/setube/stackprism" class="sp-btn sp-btn--secondary" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      <!-- 右侧截图卡片 -->
      <div class="sp-hero__screenshots" aria-label="Product screenshots">
        <!-- 浅色模式卡片 -->
        <div class="sp-screenshot sp-screenshot--light">
          <div class="sp-screenshot__bar">
            <span class="sp-screenshot__logo-text">StackPrism</span>
            <span class="sp-screenshot__version">v1.3.90</span>
            <div class="sp-screenshot__actions">
              <div class="sp-screenshot__dot"></div>
              <div class="sp-screenshot__dot"></div>
              <div class="sp-screenshot__dot sp-screenshot__dot--teal"></div>
            </div>
          </div>
          <div class="sp-screenshot__url">https://github.com/setube/stackprism</div>
          <div class="sp-screenshot__stats">
            <span class="sp-screenshot__stat sp-screenshot__stat--teal">
              <strong>16</strong>
              Tech
            </span>
            <span class="sp-screenshot__stat">
              <strong>68</strong>
              Resources
            </span>
            <span class="sp-screenshot__stat">
              <strong>17</strong>
              Headers
            </span>
          </div>
          <div class="sp-screenshot__tabs">
            <span class="sp-screenshot__tab sp-screenshot__tab--active">Focus 13</span>
            <span class="sp-screenshot__tab">All 16</span>
            <span class="sp-screenshot__tab sp-screenshot__tab--select">Select category ▾</span>
          </div>
          <div class="sp-screenshot__results">
            <div class="sp-screenshot__category">
              FRONTEND FRAMEWORK
              <span>3 item(s)</span>
            </div>
            <div class="sp-screenshot__techs">
              <span class="sp-screenshot__tech">⚡ Hotwire Turbo</span>
              <span class="sp-screenshot__tech">🔥 Lit 1.1.2</span>
              <span class="sp-screenshot__tech">⚛ React</span>
            </div>
            <div class="sp-screenshot__category">
              UI / CSS FRAMEWORK
              <span>1 item(s)</span>
            </div>
            <div class="sp-screenshot__techs">
              <span class="sp-screenshot__tech">🌊 Tailwind CSS</span>
            </div>
            <div class="sp-screenshot__category">
              BUILD &amp; RUNTIME
              <span>4 item(s)</span>
            </div>
            <div class="sp-screenshot__techs">
              <span class="sp-screenshot__tech">📦 ES Modules</span>
              <span class="sp-screenshot__tech">🌐 Open Graph</span>
              <span class="sp-screenshot__tech">⚡ Priority Hints</span>
            </div>
          </div>
          <div class="sp-screenshot__footer">
            <span>🔍 Search</span>
            <span>📄 Raw data</span>
            <span>📋 Copy all</span>
            <span>GitHub</span>
          </div>
        </div>

        <!-- 深色模式卡片 -->
        <div class="sp-screenshot sp-screenshot--dark">
          <div class="sp-screenshot__bar">
            <span class="sp-screenshot__logo-text">StackPrism</span>
            <span class="sp-screenshot__version">v1.3.90</span>
            <div class="sp-screenshot__actions">
              <div class="sp-screenshot__dot"></div>
              <div class="sp-screenshot__dot"></div>
              <div class="sp-screenshot__dot sp-screenshot__dot--teal"></div>
            </div>
          </div>
          <div class="sp-screenshot__url">https://github.com/setube/stackprism</div>
          <div class="sp-screenshot__stats">
            <span class="sp-screenshot__stat sp-screenshot__stat--teal">
              <strong>16</strong>
              Tech
            </span>
            <span class="sp-screenshot__stat">
              <strong>68</strong>
              Resources
            </span>
            <span class="sp-screenshot__stat">
              <strong>17</strong>
              Headers
            </span>
          </div>
          <div class="sp-screenshot__tabs">
            <span class="sp-screenshot__tab sp-screenshot__tab--active">Focus 13</span>
            <span class="sp-screenshot__tab">All 16</span>
            <span class="sp-screenshot__tab sp-screenshot__tab--select">Select category ▾</span>
          </div>
          <div class="sp-screenshot__results">
            <div class="sp-screenshot__category">
              FRONTEND FRAMEWORK
              <span>3 item(s)</span>
            </div>
            <div class="sp-screenshot__techs">
              <span class="sp-screenshot__tech">⚡ Hotwire Turbo</span>
              <span class="sp-screenshot__tech">🔥 Lit 1.1.2</span>
              <span class="sp-screenshot__tech">⚛ React</span>
            </div>
            <div class="sp-screenshot__category">
              UI / CSS FRAMEWORK
              <span>1 item(s)</span>
            </div>
            <div class="sp-screenshot__techs">
              <span class="sp-screenshot__tech">🌊 Tailwind CSS</span>
            </div>
            <div class="sp-screenshot__category">
              LANGUAGE / RUNTIME
              <span>1 item(s)</span>
            </div>
            <div class="sp-screenshot__techs">
              <span class="sp-screenshot__tech">🟨 JavaScript</span>
            </div>
          </div>
          <div class="sp-screenshot__footer">
            <span>🔍 Search</span>
            <span>📄 Raw data</span>
            <span>📋 Copy all</span>
            <span>GitHub</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .sp-hero {
    position: relative;
    overflow: hidden;
    padding: 80px 24px 64px;
    min-height: 80vh;
    display: flex;
    align-items: center;
  }

  .sp-hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .sp-hero__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.25;
  }

  .sp-hero__glow--blue {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
    background: radial-gradient(circle, #2563eb, transparent 70%);
    animation: glow-drift 8s ease-in-out infinite;
  }

  .sp-hero__glow--purple {
    width: 500px;
    height: 500px;
    bottom: -150px;
    right: 20%;
    background: radial-gradient(circle, #6366f1, transparent 70%);
    animation: glow-drift 10s ease-in-out infinite reverse;
  }

  .sp-hero__glow--teal {
    width: 400px;
    height: 400px;
    top: 10%;
    left: -100px;
    background: radial-gradient(circle, #14b8a6, transparent 70%);
    animation: glow-drift 12s ease-in-out infinite;
  }

  @keyframes glow-drift {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(20px, -30px) scale(1.05);
    }
    66% {
      transform: translate(-15px, 20px) scale(0.95);
    }
  }

  .sp-hero__inner {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
    width: 100%;
  }

  /* Brand row */
  .sp-hero__brand {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
  }

  .sp-hero__logo {
    flex-shrink: 0;
    filter: drop-shadow(0 4px 16px rgba(37, 99, 235, 0.3));
    transition: filter 0.3s;
  }

  .sp-hero__logo:hover {
    filter: drop-shadow(0 8px 24px rgba(37, 99, 235, 0.5));
  }

  .sp-hero__title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sp-hero__title {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0;
    background: linear-gradient(135deg, #14213d 0%, #2563eb 50%, #14b8a6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dark .sp-hero__title {
    background: linear-gradient(135deg, #e2e8f0 0%, #60a5fa 50%, #2dd4bf 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }

  .sp-hero__subtitle {
    font-size: 0.95rem;
    color: var(--vp-c-text-2);
    font-weight: 500;
    letter-spacing: 0.01em;
    margin: 0;
  }

  /* Tagline */
  .sp-hero__tagline {
    font-size: clamp(1rem, 2vw, 1.25rem);
    line-height: 1.7;
    color: var(--vp-c-text-1);
    margin: 0 0 24px;
    font-style: italic;
  }

  .sp-hero__highlight {
    background: linear-gradient(90deg, #2563eb, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-style: normal;
    font-weight: 600;
  }

  /* Feature list */
  .sp-hero__features {
    list-style: none;
    padding: 0;
    margin: 0 0 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
  }

  .sp-hero__features li {
    font-size: 0.9rem;
    color: var(--vp-c-text-2);
    padding-left: 20px;
    position: relative;
  }

  .sp-hero__features li::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #14b8a6);
  }

  /* Browser icons */
  .sp-hero__browsers {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
  }

  .sp-hero__browser {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    font-weight: 500;
  }

  .sp-hero__browser svg {
    transition: transform 0.2s;
  }

  .sp-hero__browser:hover svg {
    transform: scale(1.1);
  }

  /* CTA buttons */
  .sp-hero__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .sp-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .sp-btn--primary {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #fff;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
  }

  .sp-btn--primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
    color: #fff;
  }

  .sp-btn--secondary {
    background: transparent;
    color: var(--vp-c-text-1);
    border: 1.5px solid var(--vp-c-divider);
    backdrop-filter: blur(8px);
  }

  .sp-btn--secondary:hover {
    border-color: #2563eb;
    color: #2563eb;
    transform: translateY(-1px);
  }

  /* Screenshots */
  .sp-hero__screenshots {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    height: 480px;
  }

  .sp-screenshot {
    position: absolute;
    width: 280px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.18),
      0 4px 16px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(12px);
    animation: card-float 6s ease-in-out infinite;
    font-size: 11.5px;
  }

  .sp-screenshot--light {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.8);
    top: 0;
    right: 20px;
    z-index: 2;
    transform: rotate(-2deg);
  }

  .sp-screenshot--dark {
    background: rgba(15, 20, 35, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.08);
    top: 60px;
    right: -20px;
    z-index: 1;
    transform: rotate(2deg);
    animation-delay: 1s;
    color: #e2e8f0;
  }

  @keyframes card-float {
    0%,
    100% {
      transform: translateY(0) rotate(-2deg);
    }
    50% {
      transform: translateY(-8px) rotate(-2deg);
    }
  }

  .sp-screenshot--dark {
    animation-name: card-float-dark;
  }

  @keyframes card-float-dark {
    0%,
    100% {
      transform: translateY(0) rotate(2deg);
    }
    50% {
      transform: translateY(-8px) rotate(2deg);
    }
  }

  .sp-screenshot__bar {
    display: flex;
    align-items: center;
    padding: 10px 12px 6px;
    gap: 6px;
  }

  .sp-screenshot__logo-text {
    font-weight: 700;
    font-size: 13px;
    background: linear-gradient(135deg, #2563eb, #14b8a6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sp-screenshot__version {
    font-size: 10px;
    opacity: 0.5;
  }

  .sp-screenshot__actions {
    margin-left: auto;
    display: flex;
    gap: 5px;
  }

  .sp-screenshot__dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.08);
  }

  .sp-screenshot--dark .sp-screenshot__dot {
    background: rgba(255, 255, 255, 0.1);
  }

  .sp-screenshot__dot--teal {
    background: #14b8a6 !important;
  }

  .sp-screenshot__url {
    padding: 3px 12px 8px;
    font-size: 10px;
    opacity: 0.45;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sp-screenshot__stats {
    display: flex;
    gap: 12px;
    padding: 8px 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .sp-screenshot--dark .sp-screenshot__stats {
    border-color: rgba(255, 255, 255, 0.06);
  }

  .sp-screenshot__stat {
    font-size: 11px;
    opacity: 0.6;
  }

  .sp-screenshot__stat--teal strong {
    color: #14b8a6;
    opacity: 1;
  }

  .sp-screenshot__stat strong {
    font-weight: 700;
    font-size: 13px;
    opacity: 1;
  }

  .sp-screenshot__tabs {
    display: flex;
    gap: 4px;
    padding: 8px 10px;
  }

  .sp-screenshot__tab {
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10.5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: default;
  }

  .sp-screenshot--dark .sp-screenshot__tab {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .sp-screenshot__tab--active {
    background: rgba(37, 99, 235, 0.12);
    border-color: rgba(37, 99, 235, 0.3) !important;
    color: #2563eb;
    font-weight: 600;
  }

  .sp-screenshot__tab--select {
    margin-left: auto;
    opacity: 0.5;
  }

  .sp-screenshot__results {
    padding: 4px 12px;
  }

  .sp-screenshot__category {
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    opacity: 0.45;
    padding: 8px 0 4px;
    text-transform: uppercase;
  }

  .sp-screenshot__techs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding-bottom: 4px;
  }

  .sp-screenshot__tech {
    font-size: 10.5px;
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .sp-screenshot--dark .sp-screenshot__tech {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .sp-screenshot__footer {
    display: flex;
    gap: 10px;
    padding: 8px 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    font-size: 10px;
    opacity: 0.4;
  }

  .sp-screenshot--dark .sp-screenshot__footer {
    border-color: rgba(255, 255, 255, 0.06);
  }

  /* Responsive */
  @media (max-width: 960px) {
    .sp-hero__inner {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    .sp-hero__screenshots {
      justify-content: center;
      height: 400px;
    }

    .sp-screenshot--light {
      right: 40px;
    }

    .sp-screenshot--dark {
      right: 0;
    }
  }

  @media (max-width: 640px) {
    .sp-hero {
      padding: 60px 20px 48px;
    }

    .sp-hero__features {
      grid-template-columns: 1fr;
    }

    .sp-hero__screenshots {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sp-hero__glow,
    .sp-screenshot {
      animation: none;
    }
  }
</style>
