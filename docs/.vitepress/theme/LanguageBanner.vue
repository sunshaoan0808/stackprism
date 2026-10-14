<template>
  <section class="sp-lang-banner">
    <div class="sp-lang-banner__inner">
      <div class="sp-lang-banner__card">
        <div class="sp-lang-banner__label">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>10 Languages</span>
        </div>
        <div class="sp-lang-banner__langs" aria-label="Supported languages">
          <span v-for="lang in languages" :key="lang.code" class="sp-lang-banner__lang">
            {{ lang.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  const languages = [
    { code: 'zh-CN', label: '简体中文' },
    { code: 'en', label: 'English' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'ja', label: '日本語' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'cs', label: 'Čeština' },
    { code: 'pl', label: 'Polski' }
  ]
</script>

<style scoped>
  .sp-lang-banner {
    padding: 0 24px 96px;
  }

  .sp-lang-banner__inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  .sp-lang-banner__card {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 20px 28px;
    border-radius: 16px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
    flex-wrap: wrap;
  }

  .sp-lang-banner__label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 700;
    white-space: nowrap;
    color: var(--vp-c-text-1);
    background: linear-gradient(135deg, #2563eb, #14b8a6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sp-lang-banner__label svg {
    color: #2563eb;
    flex-shrink: 0;
    -webkit-text-fill-color: initial;
  }

  .sp-lang-banner__langs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 6px;
    align-items: center;
  }

  .sp-lang-banner__lang {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    position: relative;
    padding-right: 12px;
  }

  .sp-lang-banner__lang:not(:last-child)::after {
    content: '·';
    position: absolute;
    right: 0;
    color: var(--vp-c-text-3);
  }

  @media (max-width: 640px) {
    .sp-lang-banner__card {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }
</style>
