export interface TutorialSection {
  heading: string;
  paragraph: string;
  code?: string;
}

export interface TutorialBody {
  intro: string;
  sections: TutorialSection[];
}

export const TUTORIAL_BODY: Record<string, TutorialBody> = {
  'mastering-service-workers-and-pwas-in-angular': {
    intro:
      'Progressive Web Apps let your Angular application work offline, cache assets intelligently, and install like a native app. The Angular service worker package wraps the browser Service Worker API and takes care of most of the boilerplate for you.',
    sections: [
      {
        heading: 'Adding the service worker package',
        paragraph:
          'The Angular CLI ships a schematic that wires up @angular/service-worker, generates a manifest, and registers the worker in your bootstrap code. Running it against an existing project takes seconds and gives you a production-ready caching strategy out of the box.',
        code: 'ng add @angular/pwa',
      },
      {
        heading: 'Understanding the cache strategy',
        paragraph:
          "ngsw-config.json controls which assets are pre-cached at install time and which data URLs are served with a freshness or performance strategy. Getting this file right is the difference between an app that feels instant offline and one that silently serves stale data.",
      },
      {
        heading: 'Prompting for install',
        paragraph:
          'Listening to the beforeinstallprompt event lets you show your own custom "Install App" button instead of relying on the browser default, giving users a much smoother path to adding your PWA to their home screen.',
      },
    ],
  },
  'first-look-at-signals-in-angular': {
    intro:
      'Signals are a new reactive primitive in Angular that let the framework track exactly which parts of your component depend on which pieces of state, enabling fine-grained change detection without zone.js.',
    sections: [
      {
        heading: 'Creating a signal',
        paragraph:
          'A signal wraps a value and notifies consumers whenever that value changes. Reading a signal inside a template or a computed automatically subscribes that consumer to future updates.',
        code: `import { signal } from '@angular/core';

const count = signal(0);
count.set(count() + 1);`,
      },
      {
        heading: 'Derived state with computed',
        paragraph:
          'computed() lets you derive new signals from existing ones. The derived value is recalculated lazily and only when one of its dependencies actually changes, which keeps expensive calculations cheap.',
      },
      {
        heading: 'Effects',
        paragraph:
          'effect() runs side effects whenever the signals it reads change, which is useful for syncing state to localStorage, logging, or triggering imperative DOM APIs outside of the render cycle.',
      },
    ],
  },
  'directives-structural-vs-attribute': {
    intro:
      'Angular directives extend HTML with new behavior. Structural directives change the shape of the DOM by adding or removing elements, while attribute directives change the appearance or behavior of an existing element.',
    sections: [
      {
        heading: 'Structural directives',
        paragraph:
          "*ngIf and *ngFor are the classic examples: they decide whether an element exists in the DOM at all, or how many times it's repeated. Under the hood they work with <ng-template> and a structural directive's TemplateRef.",
        code: `@if (isVisible) {
  <p>Now you see me</p>
}`,
      },
      {
        heading: 'Attribute directives',
        paragraph:
          'ngClass and ngStyle are built-in attribute directives, but the real power comes from writing your own — for example a directive that highlights an element on hover using @HostListener and @HostBinding.',
      },
      {
        heading: 'When to write a custom directive',
        paragraph:
          "If you find yourself repeating the same @HostListener or DOM manipulation logic across multiple components, that's usually a sign it belongs in a shared directive instead.",
      },
    ],
  },
  'rxjs-streams-analogs-in-real-life': {
    intro:
      'RxJS concepts click a lot faster once you map them onto things you already understand. An Observable is like a subscription to a newsletter — nothing happens until someone subscribes, and each subscriber gets their own independent stream of issues.',
    sections: [
      {
        heading: 'Observable as a newsletter',
        paragraph:
          "Nobody receives anything until they subscribe, and unsubscribing stops future emissions. This is exactly why Observables in Angular are described as lazy: the producer function only runs once there's at least one subscriber.",
        code: `const newsletter$ = new Observable<string>((subscriber) => {
  subscriber.next('Issue #1');
});`,
      },
      {
        heading: 'Subject as a live broadcast',
        paragraph:
          'A Subject is more like a live radio broadcast: if you tune in late, you miss what already aired. All subscribers share the exact same execution, unlike a plain Observable which reruns for every subscriber.',
      },
      {
        heading: 'Operators as a factory line',
        paragraph:
          'Piping operators together is like a factory conveyor belt — each station (map, filter, debounceTime) transforms or filters the item before it reaches the next stage, without ever touching the original source.',
      },
    ],
  },
  'tackling-angular-subscriptions-with-rxjs': {
    intro:
      "Forgetting to unsubscribe from an Observable is one of the most common sources of memory leaks in Angular applications. Luckily there are several idiomatic patterns to make sure every subscription gets cleaned up.",
    sections: [
      {
        heading: 'The async pipe',
        paragraph:
          "Whenever possible, let the async pipe handle subscription and unsubscription for you directly in the template. It automatically unsubscribes when the component is destroyed, which eliminates an entire class of bugs.",
        code: `<p>{{ user$ | async | json }}</p>`,
      },
      {
        heading: 'takeUntilDestroyed',
        paragraph:
          'For subscriptions that must live in the component class, the takeUntilDestroyed operator ties the stream lifetime to the component or directive DestroyRef, so you no longer need a manual ngOnDestroy teardown.',
      },
      {
        heading: 'Avoiding manual Subscription bookkeeping',
        paragraph:
          "Manually pushing subscriptions into an array and calling unsubscribe() in ngOnDestroy still works, but it's easy to forget one. Prefer the declarative approaches above whenever the API allows it.",
      },
    ],
  },
  "beyond-subscriptions-exploring-the-power-of-angulars-async-pipe": {
    intro:
      "The async pipe is one of Angular's most underrated features. Beyond simply unwrapping an Observable or Promise in a template, it also manages subscription lifecycle and integrates cleanly with change detection.",
    sections: [
      {
        heading: 'Automatic subscription management',
        paragraph:
          'The async pipe subscribes when the bound expression first becomes available and unsubscribes automatically when the directive is destroyed, removing the need for manual cleanup code entirely.',
        code: `<div *ngIf="data$ | async as data">
  {{ data.title }}
</div>`,
      },
      {
        heading: 'Working with multiple streams',
        paragraph:
          'Using the "as" syntax to alias the resolved value lets you reference the same emitted value multiple times in a template without re-subscribing to the source Observable for each usage.',
      },
      {
        heading: 'Pitfalls to avoid',
        paragraph:
          "Piping the same Observable through async multiple times in a template subscribes multiple times unless the source is shared with shareReplay or similar operators — worth knowing before it causes duplicate HTTP calls.",
      },
    ],
  },
  'improve-debugging-skills-in-angular-part-1': {
    intro:
      'Debugging is a skill you can deliberately practice, not just something that happens to you. This first part covers the fundamentals: reading stack traces, using breakpoints effectively, and narrowing down where a bug actually lives.',
    sections: [
      {
        heading: 'Reading the stack trace first',
        paragraph:
          "Before changing any code, read the full stack trace top to bottom. The line that threw is not always the root cause — often it's several frames up, where a bad value was first produced.",
      },
      {
        heading: 'Conditional breakpoints',
        paragraph:
          'Instead of pausing on every iteration of a loop, use a conditional breakpoint that only triggers when a specific value or index is reached. This saves an enormous amount of time on data-heavy bugs.',
        code: `debugger; // only reached when the condition you set is true`,
      },
      {
        heading: 'Isolating the reproduction',
        paragraph:
          "Reducing a bug to the smallest possible reproduction — a single component, a single input — makes the root cause obvious far more often than staring at the full application.",
      },
    ],
  },
  'hot-vs-cold-observable-in-rxjs': {
    intro:
      "Whether an Observable is 'hot' or 'cold' determines when its producer starts emitting values and whether subscribers share that execution. Getting this wrong is a common source of duplicate HTTP requests and inconsistent state.",
    sections: [
      {
        heading: 'Cold Observables',
        paragraph:
          'A cold Observable creates a brand new producer for every subscriber. An HttpClient.get() call is a great example: each subscription triggers its own independent HTTP request.',
        code: `const cold$ = new Observable((sub) => {
  console.log('producer runs');
  sub.next(Math.random());
});`,
      },
      {
        heading: 'Hot Observables',
        paragraph:
          'A hot Observable, like a Subject or a DOM event stream, has a single shared producer. Subscribers only receive values emitted after they subscribed, and they all share the same underlying execution.',
      },
      {
        heading: 'Converting cold to hot',
        paragraph:
          'Operators like share() and shareReplay() let you multicast a cold Observable to multiple subscribers, avoiding duplicate work such as firing the same network request more than once.',
      },
    ],
  },
  'anatomy-of-angular-builders': {
    intro:
      'Angular builders are the NodeJS scripts behind every "ng build", "ng test", or "ng serve" command. Understanding their anatomy lets you customize the build pipeline or write your own custom builder entirely.',
    sections: [
      {
        heading: 'What a builder actually is',
        paragraph:
          "At its core a builder is just a function that receives options and a BuilderContext, does some work, and returns a BuilderOutput indicating success or failure. angular.json simply maps target names to these functions.",
        code: `export default createBuilder(async (options, context) => {
  return { success: true };
});`,
      },
      {
        heading: 'The architect API',
        paragraph:
          'The Architect API in the Angular CLI is responsible for resolving a target from angular.json, loading the corresponding builder implementation, and invoking it with the merged configuration and command-line options.',
      },
      {
        heading: 'Writing a custom builder',
        paragraph:
          'Custom builders are useful for tasks like running a post-build asset upload step or wrapping a third-party bundler, while still integrating cleanly with familiar "ng run" tooling.',
      },
    ],
  },
  'how-to-provide-data-to-component-portal-using-dependency-injection': {
    intro:
      "The Angular CDK Portal module lets you render a component dynamically into a different part of the DOM. A common follow-up question is how to pass data into that dynamically created component, since there's no template binding available.",
    sections: [
      {
        heading: 'The problem with ComponentPortal',
        paragraph:
          "Because a ComponentPortal instantiates its component through Angular's dependency injection rather than a template, you can't simply bind @Input() properties the way you normally would.",
      },
      {
        heading: 'Creating a custom injector',
        paragraph:
          "The solution is to construct a custom Injector with your data provided under a token, and pass it to the ComponentPortal's constructor. The dynamically created component can then inject that token like any other service.",
        code: `const injector = Injector.create({
  providers: [{ provide: DATA_TOKEN, useValue: myData }],
  parent: this.injector,
});
new ComponentPortal(MyComponent, null, injector);`,
      },
      {
        heading: 'Reading the data in the target component',
        paragraph:
          'Inside the portal-hosted component, injecting DATA_TOKEN via the constructor or inject() gives access to exactly the same data instance that was passed in, keeping the flow fully type-safe.',
      },
    ],
  },
};
