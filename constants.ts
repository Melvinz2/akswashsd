
import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'React Todo MVC',
    description: 'A classic Todo application implementation using React Hooks and Context API. Perfect for understanding state management.',
    language: 'TypeScript',
    difficulty: 'Beginner',
    tags: ['react', 'hooks', 'context', 'css-modules'],
    zipFileName: 'react-todo-mvc.zip',
    fileStructure: `
src/
  components/
    TodoList.tsx
    TodoItem.tsx
  context/
    TodoContext.tsx
  App.tsx
  index.tsx
    `
  },
  {
    id: 'p2',
    title: 'Node.js REST API',
    description: 'Express.js backend with JWT authentication and MongoDB connection boilerplate.',
    language: 'JavaScript',
    difficulty: 'Intermediate',
    tags: ['nodejs', 'express', 'jwt', 'mongodb'],
    zipFileName: 'nodejs-rest-api.zip',
    fileStructure: `
src/
  controllers/
    authController.js
  models/
    User.js
  routes/
    auth.js
  server.js
    `
  },
  {
    id: 'p3',
    title: 'Python Data Scraper',
    description: 'BeautifulSoup and Requests based scraper to collect data from e-commerce sites securely.',
    language: 'Python',
    difficulty: 'Advanced',
    tags: ['python', 'beautifulsoup', 'automation'],
    zipFileName: 'python-scraper.zip',
    fileStructure: `
scraper.py
requirements.txt
utils/
  parser.py
    `
  }
];
