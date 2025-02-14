interface Social {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export const socials: Social[] = [
  {
    platform: 'email',
    url: 'mailto:your.email@example.com',
    icon: 'fas fa-envelope',
    label: 'Email'
  },
  {
    platform: 'github',
    url: 'https://github.com/yourusername',
    icon: 'fab fa-github',
    label: 'GitHub'
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/in/yourusername',
    icon: 'fab fa-linkedin',
    label: 'LinkedIn'
  },
  {
    platform: 'twitter',
    url: 'https://twitter.com/yourusername',
    icon: 'fab fa-x-twitter',
    label: 'Twitter'
  },
  {
    platform: 'medium',
    url: 'https://medium.com/@yourusername',
    icon: 'fab fa-medium',
    label: 'Medium'
  },
  {
    platform: 'substack',
    url: 'https://yourusername.substack.com',
    icon: 'fas fa-newspaper',
    label: 'Substack'
  }
];
