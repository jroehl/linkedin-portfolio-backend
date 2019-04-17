import tinycolor from 'tinycolor2';
import { normalizeKey } from './utils';

const validSections = [
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
];

const sectionsKey = 'SECTIONS';

const getRandom = () => tinycolor.random().toHexString();

export default {
  sectionsKey,
  validSections,
  validKeys: validSections.map(key => ({ key, normalized: normalizeKey(key) })),
  headerExplanation: [
    '"Title" specifies the title of the section.\n("$BACKGROUND" is a required, pre-defined key for specifying background properties)',
    `"Keys" specifies the data that is shown in the section.\nMust be comma separated list of\n- ${validSections
      .slice(1)
      .join('\n- ')}`,
    '"BackgroundColor" specifies the color of the section background.',
    '"Headings" specifies the color and font family of the section headings.',
    '"Text" specifies the color and font family of the section text.'
  ],
  sectionsWorksheet: [
    ['Title', 'Keys', 'BackgroundColor', 'Headings', 'Text'],
    [
      '$BACKGROUND',
      'HEADER, SUMMARY, EMAIL_ADDRESSES, PROFILE',
      getRandom(),
      'Space Mono | #ffffff',
      'Oxygen | #ffffff'
    ],
    ['projects', 'PROJECTS', getRandom(), 'Lobster | #ffffff', 'Oxygen | #ffffff'],
    ['education', 'EDUCATION', getRandom(), 'Pacifico | #ffffff', 'Oxygen | #ffffff'],
    ['certifications', 'CERTIFICATIONS', getRandom(), 'Space Mono | #ffffff', 'Oxygen | #ffffff'],
    ['work', 'POSITIONS', getRandom(), 'Arial | #ffffff', 'Oxygen | #ffffff'],
    [
      'languages & skills',
      'LANGUAGES, SKILLS',
      getRandom(),
      'Montserrat | #ffffff',
      'Oxygen | #ffffff'
    ]
  ]
};
