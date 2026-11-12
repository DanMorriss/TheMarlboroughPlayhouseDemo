export interface SponsorSocial {
  platform: string;
  handle: string;
  /** Left out when we only know the handle, not which platform it's on */
  url?: string;
}

export interface Sponsor {
  name: string;
  /** File name in assets/images/sponsors */
  logo: string;
  /** Background colour of the logo's circle; same-coloured bubbles are kept apart */
  colour: string;
  description?: string;
  /** Domain only, e.g. "example.co.uk" */
  website?: string;
  phone?: string;
  socials: SponsorSocial[];
}

const instagram = (handle: string): SponsorSocial => ({
  platform: 'Instagram',
  handle: `@${handle}`,
  url: `https://www.instagram.com/${handle}`,
});

const facebook = (handle: string, path = handle): SponsorSocial => ({
  platform: 'Facebook',
  handle: `@${handle}`,
  url: `https://www.facebook.com/${path}`,
});

const unknownPlatform = (handle: string): SponsorSocial => ({ platform: '', handle: `@${handle}` });

// Display order also sets the order bubbles are placed in on the Sponsors page
export const SPONSORS: Sponsor[] = [
  {
    name: "Elaine's Travel Co.",
    logo: 'elaines-travel-co.png',
    colour: 'peach',
    description:
      "Independent travel agency on Marlborough High Street with over 40 years' experience. Flights, escorted tours, bespoke holidays and cruises.",
    website: 'elainestravel.co.uk',
    phone: '01672 558800',
    socials: [unknownPlatform('elainestravelco')],
  },
  {
    name: 'Riverside Vets',
    logo: 'riverside.png',
    colour: 'green',
    description:
      'Marlborough veterinary practice providing medical and surgical care for pets, with a team of five vets plus registered nurses.',
    website: 'marlboroughvets.co.uk',
    phone: '01672 514875',
    socials: [
      {
        platform: 'Facebook',
        handle: 'Riverside Vets',
        url: 'https://www.facebook.com/www.riversidevet.co.uk',
      },
    ],
  },
  {
    name: 'Our Free Minds',
    logo: 'our-free-minds.png',
    colour: 'yellow',
    description:
      'A self-directed learning community for home-educated young people aged 8 to 16, meeting in Burbage during term time.',
    website: 'ourfreeminds.org',
    socials: [{ platform: 'Facebook group', handle: 'Our Free Minds' }],
  },
  {
    name: 'The Milk Yard',
    logo: 'the-milk-yard.png',
    colour: 'blue',
    description:
      'Self-service honesty shop on the edge of Savernake Forest, selling its own farm-fresh milk, handmade gelato and local produce.',
    phone: '07872 953557',
    socials: [instagram('themilkyardvending'), facebook('themilkyardvending')],
  },
  {
    name: 'Savernake Dental',
    logo: 'savernake-dental.png',
    colour: 'yellow',
    description: 'Dental practice on Marlborough Business Park offering check-ups and everyday dental care.',
    website: 'savernakedentistry.co.uk',
    phone: '01672 512418',
    socials: [unknownPlatform('savernakedentalpractice')],
  },
  {
    name: 'The Doula Gem',
    logo: 'the-doula-gem.png',
    colour: 'pink',
    description:
      'Bespoke, evidence-based birth and postnatal doula support, including overnight care and nourishing meal packages.',
    website: 'thedoulagem.co.uk',
    phone: '07725 405298',
    socials: [unknownPlatform('thedoulagem')],
  },
  {
    name: 'Little Pickles Markets',
    logo: 'little-pickles.png',
    colour: 'lavender',
    description:
      "A network of nearly-new baby and children's sales across Wiltshire since 2010. Buy and sell pre-loved kids' items locally.",
    website: 'littlepicklesmarkets.co.uk',
    phone: '07856 832095',
    socials: [instagram('littlepicklesmk')],
  },
  {
    name: 'MTS Gardens',
    logo: 'mts-gardens.png',
    colour: 'green',
    description:
      'Marlborough-based garden design, build and maintenance, creating beautiful, biodiverse gardens made to thrive for years.',
    website: 'mtsgarden.co.uk',
    phone: '07792 557014',
    socials: [instagram('mtsgardens')],
  },
  {
    name: "It's Your Parties",
    logo: 'its-your-parties.png',
    colour: 'taupe',
    description:
      'Luxury balloon styling for birthdays, baby showers and events across Marlborough, Swindon and the Cotswolds.',
    website: 'itsyourparties.com',
    phone: '07590 995127',
    socials: [instagram('itsyourparties'), facebook('itsyourparties')],
  },
  {
    name: 'Kat Venus Yoga',
    logo: 'katrina-venus-yoga.png',
    colour: 'pink',
    description:
      'Friendly, inclusive group and private yoga, including pregnancy and postnatal classes, from a British Wheel of Yoga accredited teacher.',
    website: 'katvenus.yoga',
    phone: '07483 891126',
    socials: [instagram('katrinavenusyoga'), facebook('katvenusyoga')],
  },
  {
    name: 'Birthworks',
    logo: 'birthworks.png',
    colour: 'yellow',
    description:
      'Independent midwifery offering personal, continuous care through pregnancy, labour and the early weeks with your newborn.',
    website: 'birth-works.co.uk',
    phone: '07901 911890',
    socials: [unknownPlatform('birthworks_independent_midwife')],
  },
  {
    name: 'Marlborough Dog Grooming',
    logo: 'marlborough-dog-grooming.png',
    colour: 'blue',
    phone: '07500 158586',
    socials: [],
  },
  {
    name: 'Nest & Bloom',
    logo: 'nest-and-bloom.png',
    colour: 'yellow',
    description:
      'Professional deep cleaning and sanitising of pushchairs, car seats and travel systems, with a convenient collection service.',
    phone: '07719 478059',
    socials: [unknownPlatform('nestandbloomvalet')],
  },
  {
    name: 'Little Dreams Consulting',
    logo: 'little-dreams.png',
    colour: 'pink',
    socials: [],
  },
  {
    name: 'Easton Royal Academy',
    logo: 'easton-royal-academy.png',
    colour: 'yellow',
    description:
      'A small village primary school between Pewsey and Marlborough, with mixed-age classes, Forest School and wrap-around care.',
    website: 'eastonroyal.excalibur.org.uk',
    phone: '01672 810477',
    socials: [
      facebook('eastonroyalacademy'),
      { platform: 'X', handle: '@easton_royal', url: 'https://x.com/easton_royal' },
    ],
  },
  {
    name: 'Miles of Walks',
    logo: 'miles-of-walks.png',
    colour: 'peach',
    socials: [],
  },
];
