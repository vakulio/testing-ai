export interface Tutorial {
  slug: string;
  title: string;
  author: string;
  authorSlug: string;
  categories: string[];
  readTime: string;
  date: string;
  excerpt: string;
}

export const TUTORIALS: Tutorial[] = [
  {
    slug: 'mastering-service-workers-and-pwas-in-angular',
    title: 'Mastering Service Workers and PWAs in Angular',
    author: 'Jakub Kita',
    authorSlug: 'jakubk198',
    categories: ['Angular'],
    readTime: '9 Min Read',
    date: '20 November',
    excerpt:
      "Did you know that you can make your interactive web app work completely offline and even install it as a native application on your laptop or smartphone? All of this is possible thanks to service workers — and today, I'll show you how. In simple terms...",
  },
  {
    slug: 'first-look-at-signals-in-angular',
    title: 'First look at Signals in Angular',
    author: 'Tom Kotlar',
    authorSlug: 't-kotlar',
    categories: ['Angular'],
    readTime: '6 Min Read',
    date: '25 June',
    excerpt:
      "Welcome to your first glimpse into the reactive universe of Angular Signals. As part of Angular's renaissance, this guide introduces powerful tools which help you build reactive signal-based applications.",
  },
  {
    slug: 'directives-structural-vs-attribute',
    title: 'Structural vs. Attribute Directives',
    author: 'Michał Grzegorczyk',
    authorSlug: 'michalgrzegorczyk',
    categories: ['Angular'],
    readTime: '6 Min Read',
    date: '29 February',
    excerpt:
      'Directives in Angular are fundamental building blocks that allow you to add special features to elements in your Angular application. There are two types: structural and attribute directives.',
  },
  {
    slug: 'rxjs-streams-analogs-in-real-life',
    title: 'RxJS – Streams Analogs in Real Life',
    author: 'Tom Kotlar',
    authorSlug: 't-kotlar',
    categories: ['Angular', 'RxJS'],
    readTime: '6 Min Read',
    date: '30 October',
    excerpt:
      'Every Angular developer encounters RxJS in their codebase. A frequently common challenge for new Angular developers involves grasping RxJS concepts, including Observable, Observer, and Subject.',
  },
  {
    slug: 'tackling-angular-subscriptions-with-rxjs',
    title: 'Tackling Angular Subscriptions with RxJS',
    author: 'Michał Grzegorczyk',
    authorSlug: 'michalgrzegorczyk',
    categories: ['Angular', 'RxJS'],
    readTime: '5 Min Read',
    date: '11 June',
    excerpt:
      'Welcome to another session where we discuss pretty interesting facets of Angular. In this post, we explore common patterns and pitfalls related to unsubscription from RxJS streams.',
  },
  {
    slug: 'beyond-subscriptions-exploring-the-power-of-angulars-async-pipe',
    title: "Beyond Subscriptions: Exploring the Power of Angular's Async Pipe",
    author: 'Michał Grzegorczyk',
    authorSlug: 'michalgrzegorczyk',
    categories: ['Angular', 'RxJS'],
    readTime: '5 Min Read',
    date: '08 June',
    excerpt:
      "Before we start, it's important to know that Angular, a widely-used framework developed by Google, has many powerful tools and functionalities baked into it.",
  },
  {
    slug: 'improve-debugging-skills-in-angular-part-1',
    title: 'improve debugging skills in Angular – Part 1',
    author: 'Predrag Carapic',
    authorSlug: 'pero0904',
    categories: ['Angular'],
    readTime: '4 Min Read',
    date: '11 May',
    excerpt:
      "Today's topic is well-known to all of us since it is a core skill every developer should have. Let's explore how we could get the most out of it and level up our debugging skills. Part one of a small series.",
  },
  {
    slug: 'hot-vs-cold-observable-in-rxjs',
    title: 'Hot vs Cold Observable in RxJS',
    author: 'Predrag Carapic',
    authorSlug: 'pero0904',
    categories: ['Angular', 'RxJS'],
    readTime: '5 Min Read',
    date: '29 March',
    excerpt:
      'As Angular developers, we tend to work with RxJS and observables on a daily basis. In this article, I explain hot and cold observables and the differences between them.',
  },
  {
    slug: 'anatomy-of-angular-builders',
    title: 'Anatomy of Angular Builders',
    author: 'Dmytro Mezhenskyi',
    authorSlug: 'dmytro-mezhenskyi',
    categories: ['Angular'],
    readTime: '4 Min Read',
    date: '16 December',
    excerpt:
      'Essentially, Angular builders are NodeJS scripts executed by Angular CLI and perform different tasks like application build, running unit tests, and many other useful things.',
  },
  {
    slug: 'how-to-provide-data-to-component-portal-using-dependency-injection',
    title: 'How to provide data to ComponentPortal using Dependency injection',
    author: 'Dmytro Mezhenskyi',
    authorSlug: 'dmytro-mezhenskyi',
    categories: ['Angular', 'Angular CDK', 'Off-topic'],
    readTime: '4 Min Read',
    date: '11 June',
    excerpt:
      'Some time ago I published a video that showed how to use the Angular CDK Portal module. Almost immediately I got a question: how to provide data to the ComponentPortal using dependency injection.',
  },
];
