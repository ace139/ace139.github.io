export type SocialPlatform = 'x-twitter' | 'linkedin' | 'github' | 'email';

interface Social {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export const socials: Social[] = [
  {
    platform: 'x-twitter',
    url: 'https://x.com/heySoumyo',
    label: 'X',
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/in/soumyo-dey',
    label: 'LinkedIn',
  },
  {
    platform: 'github',
    url: 'https://github.com/ace139',
    label: 'GitHub',
  },
  {
    platform: 'email',
    url: 'mailto:heysoumyo@gmail.com',
    label: 'Email',
  },
];
