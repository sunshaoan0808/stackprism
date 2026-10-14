<template>
  <section class="sp-features">
    <div class="sp-features__inner">
      <div class="sp-features__grid">
        <div class="sp-feature-card" v-for="feature in features" :key="feature.title">
          <div class="sp-feature-card__icon" :style="{ background: feature.iconBg }">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="feature.icon"
            ></svg>
          </div>
          <h3 class="sp-feature-card__title">{{ feature.title }}</h3>
          <p class="sp-feature-card__desc">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  const features = [
    {
      title: 'Manifest V3',
      desc: 'Modern & Secure',
      iconBg: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(37,99,235,0.06))',
      icon: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'
    },
    {
      title: '16+ Technology Types',
      desc: 'Comprehensive Detection',
      iconBg: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.06))',
      icon: '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>'
    },
    {
      title: 'Smart Detection',
      desc: 'Accurate & Efficient',
      iconBg: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(20,184,166,0.06))',
      icon: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="M12 5v2"/><path d="M12 17v2"/><path d="M5 12H7"/><path d="M17 12h2"/>'
    },
    {
      title: 'Cross-Browser',
      desc: 'Chrome / Edge / Firefox',
      iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.06))',
      icon: '<path d="M20.27 5.32C18.65 3.7 16.45 2.7 14 2.7c-4.42 0-8 3.58-8 8s3.58 8 8 8c2.45 0 4.65-1 6.27-2.62"/><path d="M12 10.7h8"/><path d="M9 16.68A7.94 7.94 0 0 1 6 10.7c0-2.21.9-4.21 2.34-5.67"/>'
    }
  ]
</script>

<style scoped>
  .sp-features {
    padding: 0 24px 80px;
  }

  .sp-features__inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  .sp-features__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .sp-feature-card {
    padding: 24px;
    border-radius: 16px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
    backdrop-filter: blur(8px);
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .sp-feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.25s;
  }

  .sp-feature-card:hover::before {
    opacity: 1;
  }

  .sp-feature-card:hover {
    transform: translateY(-3px);
    border-color: rgba(37, 99, 235, 0.3);
    box-shadow:
      0 12px 40px rgba(37, 99, 235, 0.1),
      0 0 0 1px rgba(37, 99, 235, 0.08);
  }

  .sp-feature-card__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: #2563eb;
    border: 1px solid rgba(37, 99, 235, 0.15);
  }

  .sp-feature-card:nth-child(2) .sp-feature-card__icon {
    color: #6366f1;
    border-color: rgba(99, 102, 241, 0.15);
  }

  .sp-feature-card:nth-child(3) .sp-feature-card__icon {
    color: #14b8a6;
    border-color: rgba(20, 184, 166, 0.15);
  }

  .sp-feature-card:nth-child(4) .sp-feature-card__icon {
    color: #f59e0b;
    border-color: rgba(245, 158, 11, 0.15);
  }

  .sp-feature-card__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }

  .sp-feature-card__desc {
    font-size: 0.85rem;
    color: var(--vp-c-text-3);
    margin: 0;
  }

  @media (max-width: 960px) {
    .sp-features__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .sp-features__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sp-feature-card {
      transition: none;
    }
  }
</style>
