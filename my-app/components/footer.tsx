import { MapPin } from 'lucide-react';
import Image from 'next/image';

const data = {
  facebookLink: 'https://facebook.com/mvpblocks',
  instaLink: 'https://instagram.com/mvpblocks',
  twitterLink: 'https://twitter.com/mvpblocks',
  githubLink: 'https://github.com/mvpblocks',
  dribbbleLink: 'https://dribbble.com/mvpblocks',
  services: {
    webdev: '/web-development',
    webdesign: '/web-design',
    marketing: '/marketing',
    googleads: '/google-ads',
  },
  about: {
    sdc: 'https://www.cpp.edu/cba/digital-innovation/about-us.shtml',
    programs: 'https://www.cpp.edu/cba/digital-innovation/what-we-do/programs.shtml',
    faculty: 'https://www.cpp.edu/cba/digital-innovation/people/faculty.shtml',
    news: 'https://www.cpp.edu/cba/digital-innovation/news-and-events2.shtml',
  },
  help: {
    kamino: '/info',
    cloning: '/info#cloning',
    infrastructure: '/info#infrastructure',
  },
  location: {
    address: '3801 W Temple Ave, Pomona, CA 91768',
  },
  company: {
    name: 'Kamino',
    description:
      'This application empowers you to rapidly spin up and delete Pods of virtual machines hosted on the Mitchell C. Hill Student Data Center (SDC)',
    logo: '/kaminoLogo.svg',
  },
};

// const socialLinks = [
//   { icon: Globe, label: 'Website', href: 'https://www.cpp.edu/cba/digital-innovation/index.shtml' },
// ];

const aboutLinks = [
  { text: 'Student Data Center', href: data.about.sdc },
  { text: 'Programs', href: data.about.programs },
  { text: 'News and Events', href: data.about.news },
];

const helpfulLinks = [
  { text: 'What is Kamino?', href: data.help.kamino },
  { text: 'Cloning', href: data.help.cloning },
  { text: 'Infrastructure', href: data.help.infrastructure },
];

const contactInfo = [
  { icon: MapPin, text: data.location.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center gap-2 sm:justify-start">
              <Image
                src={data.company.logo || '/placeholder.svg'}
                alt="logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-2xl font-semibold">
                {data.company.name}
              </span>
            </div>

            <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            {/* <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition"
                      href={href}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Our Services</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className='text-secondary-foreground/70 transition'
                      href={href}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <span className="text-secondary-foreground/70 transition">
                        {text}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Location</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                    >
                      <Icon className="text-primary size-5 shrink-0 shadow-sm" />
                      {isAddress ? (
                        <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/70 flex-1 transition">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            {/* <p className="text-sm">
              <span className="block sm:inline">All rights reserved.</span>
            </p> */}

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025, made with ❤️ by{' '}
              <a
                href="https://www.linkedin.com/in/maxwell-caron/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Maxwell Caron
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}