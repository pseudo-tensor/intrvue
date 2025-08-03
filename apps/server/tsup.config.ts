import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  bundle: true,
  external: ['@prisma/client'],
  noExternal: ['@repo/types', '@repo/store'],
  clean: true,
})
