export const NODE_TYPES = {
  PROJECT: 'project',
  DATABASE: 'database',
  HOSTING: 'hosting',
  REPOSITORY: 'repository',
  DOCUMENTATION: 'documentation'
}

export const NODE_COLORS = {
  [NODE_TYPES.PROJECT]: '#4CAF50',
  [NODE_TYPES.DATABASE]: '#2196F3',
  [NODE_TYPES.HOSTING]: '#FF9800',
  [NODE_TYPES.REPOSITORY]: '#9C27B0',
  [NODE_TYPES.DOCUMENTATION]: '#607D8B'
}

export const NODE_ICONS = {
  [NODE_TYPES.PROJECT]: '🖥️',
  [NODE_TYPES.DATABASE]: '🗄️',
  [NODE_TYPES.HOSTING]: '🌐',
  [NODE_TYPES.REPOSITORY]: '📦',
  [NODE_TYPES.DOCUMENTATION]: '📄'
}
