// tailwind.config.js
import { join } from 'path'

export default {
  content: [
    join(__dirname, '../../packages/ui/**/*.{js,ts,jsx,tsx}'),
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
}
