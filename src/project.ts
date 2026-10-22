import type { PortfolioProject } from './types';

export const keyboardProject: PortfolioProject = {
  id: 'tbk-micro-mk1',
  eyebrow: 'Selected project · 2025',
  title: 'TBK—“Micro” Mk1',
  subtitle: 'A compact split keyboard, shaped, printed, soldered, and programmed from the desk up.',
  repositoryUrl: 'https://github.com/Badjau/zmk-config-mk1',
  model: {
    source: '/models/tbk-left.drc',
    fallbackImage: '/images/keyboard-fallback.webp',
    photos: [
      {
        source: '/images/keyboard-fallback.webp',
        alt: 'Finished TBK-Micro Mk1 split ergonomic keyboard on a patterned desk mat',
      },
      // Add more product photos here after placing them in public/images/keyboard/.
      // { source: '/images/keyboard/tbk-micro-detail.webp', alt: 'Close-up of the keyboard OLED and keycaps' },
    ],
  },
  chapters: [
    {
      id: 'made-to-fit',
      index: '01',
      label: 'The idea',
      title: 'Made to fit.',
      body: 'A smaller, more enclosed take on the TBK Mini—designed around the way I wanted a split keyboard to feel on my own desk.',
      detail: 'Ergonomic split · 42 keys · Wireless',
      pose: {
        rotation: [-0.2, -0.48, -0.08],
        position: [0, -0.05, 0],
        scale: 1,
      },
    },
    {
      id: 'mesh-to-object',
      index: '02',
      label: 'The form',
      title: 'From mesh to object.',
      body: 'I learned CAD and Blender to close the original open shell, make room for an OLED, and turn a digital shape into something printable.',
      detail: 'CAD · Blender · PLA',
      pose: {
        rotation: [-0.62, 0.34, 0.05],
        position: [0, 0.03, 0],
        scale: 1.08,
      },
    },
    {
      id: 'built-by-hand',
      index: '03',
      label: 'The build',
      title: 'Built by hand.',
      body: 'Printed cases, hand-soldered wiring, brass inserts, custom-cut acrylic, and a MagSafe base brought the two halves together.',
      detail: '3D printing · Soldering · Acrylic',
      pose: {
        rotation: [0.42, -0.25, 0.08],
        position: [0, 0, 0],
        scale: 1.03,
      },
    },
    {
      id: 'firmware-personality',
      index: '04',
      label: 'The system',
      title: 'Firmware with personality.',
      body: 'ZMK runs the wireless halves while twin OLEDs surface battery, Bluetooth profiles, layers, words per minute, and a tiny typing animation.',
      detail: 'ZMK · nRF52840 · OLED',
      pose: {
        rotation: [-0.12, 0.6, -0.04],
        position: [0, 0.08, 0],
        scale: 1.14,
      },
    },
  ],
};
