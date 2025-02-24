import { NODE_ICONS } from './nodeTypes'

export const NODE_SUBTYPES = {
  PROJECT: {
    WEB: { icon: '🌐', label: 'Web Project' },
    MOBILE: { icon: '📱', label: 'Mobile App' },
    DESKTOP: { icon: '💻', label: 'Desktop App' },
    LIBRARY: { icon: '📚', label: 'Library' }
  },
  DATABASE: {
    SQL: { icon: '🗃️', label: 'SQL Database' },
    NOSQL: { icon: '🔄', label: 'NoSQL Database' },
    CACHE: { icon: '⚡', label: 'Cache Store' }
  },
  API: {
    REST: { icon: '🔌', label: 'REST API' },
    GRAPHQL: { icon: '⚡', label: 'GraphQL API' },
    GRPC: { icon: '🔧', label: 'gRPC Service' }
  },
  HOSTING: {
    CLOUD: { icon: '☁️', label: 'Cloud Hosting' },
    SERVERLESS: { icon: '⚡', label: 'Serverless' },
    CONTAINER: { icon: '🐳', label: 'Container Platform' }
  },
  REPOSITORY: {
    GIT: { icon: '🔄', label: 'Git Repository' },
    NPM: { icon: '📦', label: 'NPM Package' },
    DOCKER: { icon: '🐳', label: 'Docker Registry' }
  },
  DOCUMENTATION: {
    WIKI: { icon: '📖', label: 'Wiki' },
    API_DOCS: { icon: '📑', label: 'API Documentation' },
    GUIDE: { icon: '📚', label: 'User Guide' }
  }
}

export const getSubTypeDefaults = (type, subType) => {
  const config = NODE_SUBTYPES[type]?.[subType]
  return {
    icon: config?.icon || NODE_ICONS[type],
    label: config?.label || `New ${type.toLowerCase()}`,
    type,
    subType
  }
}
