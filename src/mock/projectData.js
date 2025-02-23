export const mockProjects = [
  {
    id: '1',
    name: 'Project Manager',
    description: 'Tool for managing projects',
    localPath: 'C:/Projects/ProjectManager',
    gitRepository: 'https://github.com/user/project-manager',
    documentationPath: '/docs/project-manager',
    database: {
      name: 'project_db',
      location: 'localhost:27017'
    },
    hosting: 'http://localhost:3000',
    languages: ['JavaScript', 'Vue.js'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Autograph',
    description: 'Graph-based project visualization',
    localPath: 'C:/Projects/autograph',
    gitRepository: 'https://github.com/user/autograph',
    languages: ['Vue.js'],
    status: 'active'
  }
]
