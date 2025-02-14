interface Social {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export const socials: Social[] = [
  {
    platform: 'X',
    url: 'https://x.com/heySoumyo',
    icon: 'fab fa-x-twitter',
    label: 'X'
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/in/soumyo-dey',
    icon: 'fab fa-linkedin',
    label: 'LinkedIn'
  },
  {
    platform: 'github',
    url: 'https://github.com/ace139',
    icon: 'fab fa-github',
    label: 'GitHub'
  },
  {
    platform: 'email',
    url: 'mailto:heysoumyo@gmail.com',
    icon: 'fas fa-envelope',
    label: 'Email'
  },
];
