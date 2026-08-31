export const colors = {
  cream: '#FDF6EC',
  outerBg: '#E7E2D8',
  sky: '#A8D8EA',
  sage: '#B7CDBA',
  leaf: '#7C9A72',
  leafSoft: '#EAF2E4',
  lavender: '#D8C8E8',
  gold: '#F6C453',
  peach: '#F4A896',
  ink: '#3A3A3A',
  inkSoft: '#6B6560',
  white: '#FFFFFF',
  ghost: '#B9B2A8',
  writingLine: '#D8CFC0',
  cardBorder: '#E7E2D8',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  sm: 14,
  md: 20,
  lg: 28,
  full: 9999,
} as const;

export const shadow = {
  soft: {
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  lift: {
    shadowColor: '#3A3A3A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 34,
    elevation: 8,
  },
} as const;

export const typography = {
  h1: {
    fontFamily: 'Fraunces',
    fontSize: 32,
    fontWeight: '600' as const,
    color: '#3A3A3A',
    lineHeight: 38,
  },
  h2: {
    fontFamily: 'Fraunces',
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#3A3A3A',
    lineHeight: 30,
  },
  h3: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#3A3A3A',
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '400' as const,
    color: '#3A3A3A',
    lineHeight: 21,
  },
  bodyBold: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#3A3A3A',
    lineHeight: 21,
  },
  caption: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '400' as const,
    color: '#6B6560',
    lineHeight: 17,
  },
  eyebrow: {
    fontFamily: 'Nunito',
    fontSize: 10.5,
    fontWeight: '800' as const,
    color: '#6B6560',
    letterSpacing: 3.5,
    textTransform: 'uppercase' as const,
  },
  quote: {
    fontFamily: 'Caveat',
    fontSize: 26,
    fontWeight: '600' as const,
    color: '#7D5A45',
    lineHeight: 32,
  },
  ghost: {
    fontFamily: 'Patrick Hand',
    fontSize: 14,
    color: '#B9B2A8',
  },
} as const;

export const sectionColors = {
  mindScience: '#F4F1EB',
  breathing: '#EAF5F9',
  checkin: '#FDF6EC',
  reflection: '#F3EEF9',
  senses: '#FDF6EC',
  challenge: '#F1F7EF',
  evening: 'linear-gradient(180deg, #FBF1DE 0%, #FBEFEC 100%)',
  pausePoint: '#FBF6EC',
  cover: 'linear-gradient(180deg, #FDF6EC 0%, #FBF1E1 60%, #F7E9D3 100%)',
} as const;
