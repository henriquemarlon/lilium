import { defineConfig } from 'vocs'

export default defineConfig({
  basePath: '/rollups-ml-course',
  baseUrl: 'https://henriquemarlon.github.io',
  description: 'Cartesi Rollups Machine Learning Course',
  title: 'Docs',
  sidebar: [
    {
      text: 'Getting Started',
      link: '/getting-started',
    },
    {
      text: 'Example',
      link: '/example',
    },
  ],
})
