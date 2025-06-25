// Nutritionist specialization utilities
type Specialization =
  | 'weight-loss'
  | 'muscle-gain'
  | 'health-condition'
  | 'sports-nutrition'
  | 'general-health'
  | 'diabetes'
  | 'vegan'
  | 'clinical-nutrition'
  | 'geriatrics'
  | 'weight-gain'
  | 'eating-disorders';

export const getSpecializationEmoji = (spec: Specialization | string): string => {
  const emojiMap: Record<Specialization, string> = {
    'weight-loss': '⚖️',
    'muscle-gain': '💪',
    'health-condition': '🏥',
    'sports-nutrition': '🏃‍♂️',
    'general-health': '🥗',
    'diabetes': '🩸',
    'vegan': '🌱',
    'clinical-nutrition': '📋',
    'geriatrics': '👵',
    'weight-gain': '📈',
    'eating-disorders': '💔'
  };

  return emojiMap[spec as Specialization] || '✨';
};

export const getSpecializationLabel = (spec: Specialization | string): string => {
  const labelMap: Record<Specialization, string> = {
    'weight-loss': 'Slăbire',
    'muscle-gain': 'Masa musculară',
    'health-condition': 'Condiții medicale',
    'sports-nutrition': 'Nutriție sportivă',
    'general-health': 'Sănătate generală',
    'diabetes': 'Diabet',
    'vegan': 'Nutriție vegană',
    'clinical-nutrition': 'Nutriție clinică',
    'geriatrics': 'Nutriție geriatrică',
    'weight-gain': 'Creștere în greutate',
    'eating-disorders': 'Tulburări de alimentație'
  };

  return labelMap[spec as Specialization] || spec;
};

// Optional: Combined helper for both emoji and label
export const getSpecializationDisplay = (spec: Specialization | string) => {
  return {
    emoji: getSpecializationEmoji(spec),
    label: getSpecializationLabel(spec)
  };
};

export const specializations = [
  { value: 'weight-loss', label: 'Slăbire sănătoasă' },
  { value: 'muscle-gain', label: 'Creștere masă musculară' },
  { value: 'health-condition', label: 'Condiții medicale' },
  { value: 'sports-nutrition', label: 'Nutriție sportivă' },
  { value: 'general-health', label: 'Sănătate generală' },
  { value: 'pediatric', label: 'Nutriție pediatrică' },
  { value: 'elderly', label: 'Nutriție vârstnici' },
  { value: 'eating-disorders', label: 'Tulburări alimentare' },
  { value: 'diabetes', label: 'Diabet' }
];

export const consultationTypes = [
  { value: 'online', label: 'Online (Video call)', icon: '💻', desc: 'Video call, flexibilitate maximă' },
  { value: 'cabinet', label: 'La cabinet', icon: '🏢', desc: 'Întâlniri față în față' },
  { value: 'hybrid', label: 'Hibrid', icon: '🔄', desc: 'Combină online și întâlniri la cabinet' }
]