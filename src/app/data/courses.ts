export interface Course {
  slug: string;
  title: string;
  reviews: number;
  avgRating: number;
  lessons: number;
  price: string;
  imageUrl: string;
  isBundle?: boolean;
}

export const COURSES: Course[] = [
  { slug: 'advanced-angular-forms', title: 'Advanced Angular Forms', reviews: 84, avgRating: 5.0, lessons: 176, price: '€99,00', imageUrl: 'https://import.cdn.thinkific.com/420070/courses/1918572/rLtSIYN3Q6GD0tHJLQbJ_Final%402x.png' },
  { slug: 'nx-workspaces', title: 'Nx Workspaces', reviews: 4, avgRating: 4.8, lessons: 86, price: '€99,00', imageUrl: 'https://import.cdn.thinkific.com/420070/cQtYJH6Q4OdoVQTsRonU_Nx%20Workspaces.png' },
  { slug: 'conscious-angular-testing', title: 'Conscious Angular Testing', reviews: 8, avgRating: 5.0, lessons: 93, price: '€99,00', imageUrl: 'https://import.cdn.thinkific.com/420070/9bCSzYuBS5y50QTofX7D_Image_Angular_testing@2x.png' },
  { slug: 'angular-interview-hacking', title: 'Angular Interview Hacking', reviews: 34, avgRating: 4.9, lessons: 52, price: '€59,99', imageUrl: 'https://import.cdn.thinkific.com/420070/courses/1488530/igYjADxiSReSuwgkY6id_Cover%20image3x.jpg' },
  { slug: 'angular-material-theming-workshop', title: 'Angular Material Theming Course (In-Depth)', reviews: 17, avgRating: 4.8, lessons: 66, price: '€59,99', imageUrl: 'https://import.cdn.thinkific.com/420070/courses/1311752/vUQV9hJuRKe6Bmprxrtm_Cover.png' },
  { slug: 'performant-graphql-backend-just-in-few-days-with-hasura', title: 'Performant Graphql Backend in 1 Day by Using Hasura Engine', reviews: 5, avgRating: 5.0, lessons: 86, price: '€49,99', imageUrl: 'https://import.cdn.thinkific.com/420070/courses/1092217/YTcokW59Rgay8bOPQAGV_Cover.png' },
  { slug: 'all-in-one-angular-bundle', title: 'All-in-One Bundle', reviews: 0, avgRating: 0, lessons: 0, price: '€220,00', imageUrl: 'https://files.cdn.thinkific.com/bundles/bundle_card_image_000/332/839/1767274520.original.png', isBundle: true },
];

export interface CourseDetail {
  subtitle: string;
  bullets: string[];
}

export const COURSE_DETAIL: Record<string, CourseDetail> = {
  'advanced-angular-forms': {
    subtitle: 'Go beyond basic reactive forms and build dynamic, validated, production-grade form experiences',
    bullets: [
      'Deep dive into Reactive Forms architecture and FormGroup/FormArray composition',
      'Building fully dynamic forms driven by JSON schemas',
      'Writing custom, reusable validators and cross-field validation',
      'Implementing ControlValueAccessor for custom form controls',
      'Handling complex nested and repeatable form structures',
      'Testing forms with confidence using TestBed',
    ],
  },
  'nx-workspaces': {
    subtitle: 'Scale your Angular projects with a well-structured Nx monorepo',
    bullets: [
      'Understanding monorepo architecture and when it makes sense',
      'Enforcing module boundaries with Nx tags and lint rules',
      'Sharing libraries across multiple applications',
      'Leveraging computation caching and affected commands',
      'Setting up CI pipelines optimized for Nx workspaces',
    ],
  },
  'conscious-angular-testing': {
    subtitle: 'Build a deliberate, sustainable testing strategy instead of chasing coverage numbers',
    bullets: [
      'Choosing the right level of test for each part of your app',
      'Mastering TestBed for component and service unit tests',
      'Mocking dependencies without over-mocking your codebase',
      'Writing integration tests that catch real regressions',
      'Avoiding brittle tests that break on every refactor',
      'Structuring tests for long-term maintainability',
    ],
  },
  'angular-interview-hacking': {
    subtitle: 'Walk into your next Angular interview fully prepared, from fundamentals to tricky follow-ups',
    bullets: [
      'Opportunity to have a Mock-Interview with a Google Developer Expert in Angular',
      'Constantly growing database of the most popular Interview Questions (90+ questions)',
      'Extensive answers to questions with code examples',
      'Covering of possible follow-up questions',
      'Included possible RxJS and TypeScript questions',
      'Recommendations from an instructor who has been on both sides — as interviewer and interviewee',
      'Questions cover Junior, Middle and Senior levels',
    ],
  },
  'angular-material-theming-workshop': {
    subtitle: 'Master Angular Material theming from SCSS fundamentals to fully custom, dark-mode-ready components',
    bullets: [
      'Understanding the Angular Material theming system and SCSS mixins',
      'Building custom color, typography, and density themes',
      'Theming your own custom components alongside Material ones',
      'Implementing dark mode and runtime theme switching',
      'Avoiding common theming pitfalls and specificity issues',
    ],
  },
  'performant-graphql-backend-just-in-few-days-with-hasura': {
    subtitle: 'Stand up a fast, production-ready GraphQL backend in days using the Hasura engine',
    bullets: [
      'Getting a Hasura GraphQL engine running against a real database',
      'Modeling relationships and permissions declaratively',
      'Securing your API with role-based access control',
      'Extending Hasura with custom business logic',
      'Optimizing query performance at scale',
    ],
  },
};

export const INSTRUCTOR = {
  name: 'Dmytro Mezhenskyi',
  title: 'Google Developer Expert in Angular | Microsoft MVP | Author of Decoded Frontend',
  bio: 'My name is Dmytro Mezhenskyi. I have been working as a Frontend Developer since 2012 and I have experience with different projects, different scales, and frameworks. In 2020 I decided to run my YouTube channel "Decoded Frontend" about Web Development where I share my knowledge. Teaching has inspired me a lot and I decided to continue with it also on other platforms in order to help hundreds of people to be better developers.',
};
