<script setup lang="ts">
  import { useData } from 'vitepress'
  import DefaultTheme from 'vitepress/theme'
  import HeroSection from './HeroSection.vue'
  import FeatureSection from './FeatureSection.vue'
  import LanguageBanner from './LanguageBanner.vue'

  const { page, frontmatter } = useData()
  const isHome = page.value.relativePath === 'index.md' || page.value.relativePath.match(/^[a-z]{2}(-[A-Z]{2})?\/index\.md$/)
</script>

<template>
  <DefaultTheme.Layout>
    <template v-if="frontmatter.layout === 'landing'" #home-hero-before>
      <HeroSection />
      <FeatureSection />
      <LanguageBanner />
    </template>
  </DefaultTheme.Layout>
</template>
