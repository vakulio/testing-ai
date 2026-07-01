export interface RecommendedEvent {
  title: string;
  discountCode: string;
  discountText: string;
  dateRange: string;
  location: string;
  description: string;
  speakers: string;
  url: string;
}

export interface RecommendedLink {
  title: string;
  description: string;
  url: string;
}

export interface Recommendations {
  intro: string;
  events: RecommendedEvent[];
  externalCourses: RecommendedLink[];
  readings: RecommendedLink[];
}

export const RECOMMENDATIONS: Recommendations = {
  intro:
    'Here, you can find a list of courses, events, and sources that I personally used and can recommend you as a great source for certain topics',
  events: [
    {
      title: 'WeAreDevelopers World Congress',
      discountCode: 'WWC_DecodedFrontend15',
      discountText: '15% off',
      dateRange: '17-19 July',
      location: 'Berlin',
      description:
        "is the world's leading event for developers from 17-19 July in Berlin. WeAreDevelopers is welcoming 15,000+ developers and 500+ speakers for an unforgettable event.",
      speakers:
        'Scott Hanselman, Scott Farquhar, Douglas Crockford, Thomas Dohmke, Demetris Cheatham, John & Brenda Romero, Prashanth Chandrasekar, Madona Wambua, Jonas Andrulis, Denis Yarats, Scott Chacon and many more!',
      url: 'https://worldcongress.dev/',
    },
  ],
  externalCourses: [
    {
      title: 'Angular – The complete guide (2021 Edition)',
      description:
        'It was my starting point many years ago when I started to learn Angular, and this course stays great and up-to-date',
      url: '#',
    },
    {
      title: 'The Complete JavaScript Course 2022',
      description:
        "I was not a beginner in JavaScript when I bought this course, but I found a lot of things about JS I didn't know before, and it allowed me to structure my knowledge. Great recommendation for beginners!",
      url: '#',
    },
  ],
  readings: [
    {
      title: 'Danywalls | Angular ♥ Web',
      description:
        'Dany Paredes is a senior front-end developer at Angular GDE. He posts high-quality articles about Angular and surrounding technologies that I can recommend for reading',
      url: 'https://www.danywalls.com/',
    },
  ],
};
