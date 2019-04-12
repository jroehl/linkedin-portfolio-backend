import { getRandomColor, normalizeKey } from './utils';

export default {
  validKeys: [
    'SECTIONS',
    'HEADER',
    'SUMMARY',
    'PROFILE',
    'LANGUAGES',
    'PROJECTS',
    'EDUCATION',
    'CERTIFICATIONS',
    'POSITIONS',
    'SKILLS',
    'EMAIL_ADDRESSES'
  ].map(key => ({
    key,
    normalized: normalizeKey(key)
  })),
  sectionsWorksheet: [
    ['Header', 'Keys', 'BackgroundColor', 'FontColor'],
    ['$BACKGROUND', 'HEADER, SUMMARY, EMAIL_ADDRESSES, PROFILE', getRandomColor(), 'white'],
    ['projects', 'PROJECTS', getRandomColor(), 'white'],
    ['education', 'EDUCATION', getRandomColor(), 'white'],
    ['certifications', 'CERTIFICATIONS', getRandomColor(), 'white'],
    ['work', 'POSITIONS', getRandomColor(), 'white'],
    ['languages & skills', 'LANGUAGES, SKILLS', getRandomColor(), 'white']
  ]
};
