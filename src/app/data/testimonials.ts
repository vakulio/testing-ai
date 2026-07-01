export interface Testimonial {
  title: string;
  author: string;
  quote: string;
  rating: number;
  courseSlug?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    title: 'Amazing course to understand Hasura in depth',
    author: 'Afzal Ahmad',
    quote:
      'This is the best course I have ever attended, I can imagine the effort to convey the knowledge which was in-depth. Couldn\'t be better than this.',
    rating: 5,
    courseSlug: 'performant-graphql-backend-just-in-few-days-with-hasura',
  },
  {
    title: 'Complete, Clear and Concise',
    author: 'Florent Letendre',
    quote:
      'Although it is targeted for interview, I wish I saw this course when I started Angular. I actually learned and adjusted many of my Angular concepts. The RxJS chapter was great.',
    rating: 5,
    courseSlug: 'angular-interview-hacking',
  },
  {
    title: 'This course is something incredible!',
    author: 'Kostiantyn Kifor',
    quote:
      'In my opinion, Dmytro currently creates the best Angular content. He explains everything very clearly. After this course, you will master all the skills.',
    rating: 5,
    courseSlug: 'angular-interview-hacking',
  },
  {
    title: 'Awesome tips from junior to senior!',
    author: 'Elia Pari',
    quote:
      'The course is really solid. It covers all the major topics regarding the framework. There are lots of useful tips for junior and senior developers.',
    rating: 5,
    courseSlug: 'angular-interview-hacking',
  },
  {
    title: 'Dmytro is a very talented tutor',
    author: 'shah zaman',
    quote:
      'Dmytro is a very talented tutor! He explained each topic very thoroughly. I would definitely recommend this course. Really thanks, Dmytro!',
    rating: 5,
    courseSlug: 'angular-interview-hacking',
  },
  {
    title: 'Much more than excellent',
    author: 'Антон Gonza',
    quote: 'Highly recommend the course!',
    rating: 5,
    courseSlug: 'angular-interview-hacking',
  },
  {
    title: 'An Excellent Resource for Advanced Angular Forms',
    author: 'Aurora Shehu',
    quote:
      'I recently took the Advanced Angular Forms video course and was thoroughly impressed. The course was well-organized and easy to follow, with clear explanations.',
    rating: 5,
    courseSlug: 'advanced-angular-forms',
  },
  {
    title: 'The best courses about Angular Forms',
    author: 'Ral Oliver',
    quote: 'I have done a lot of courses about Angular in the last 5 years, and this one is the best one.',
    rating: 5,
    courseSlug: 'advanced-angular-forms',
  },
  {
    title: 'Recommended for all Angular developers',
    author: 'Giorgi Merabishvili',
    quote:
      'Absolutely brilliant workshop. Gives you a solid understanding of SCSS and helps you understand how Angular Material theming works under the hood.',
    rating: 5,
    courseSlug: 'angular-material-theming-workshop',
  },
  {
    title: 'Absolutely fantastic course',
    author: 'James Evans',
    quote:
      'This is an incredible course, it is the most in-depth Angular Forms course I have ever seen and I have seen quite a few. Dmytro goes into so much detail.',
    rating: 5,
    courseSlug: 'advanced-angular-forms',
  },
  {
    title: 'Got the job thanks to the course!',
    author: 'Aleksander Kroworz',
    quote:
      'I was applying for a mid Angular developer position. The questions and topics discussed in this course occurred in my real interview, e.g. Dependency Injection.',
    rating: 5,
    courseSlug: 'angular-interview-hacking',
  },
];
