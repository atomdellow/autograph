import { defineStore } from 'pinia'
import { NODE_TYPES, NODE_COLORS } from '../constants/nodeTypes'
import { mockProjects } from '../mock/projectData'

export const useGraphStore = defineStore('graph', {
  state: () => ({
    nodes: [],
    edges: [],
    nextNodeId: 1
  }),

  actions: {
    initializeFromProjects() {
      this.nodes = []
      this.edges = []
      
      mockProjects.forEach((project, index) => {
        // Create project node
        const projectNode = this.createNode({
          id: `project-${project.id}`,
          type: NODE_TYPES.PROJECT,
          data: {
            label: project.name,
            status: project.status,
            details: project
          },
          position: { x: 100, y: 100 * (index + 1) }
        })
        this.nodes.push(projectNode)

        // Create related nodes
        if (project.database?.name) {
          const dbNode = this.createNode({
            id: `db-${project.id}`,
            type: NODE_TYPES.DATABASE,
            data: {
              label: project.database.name,
              details: project.database
            },
            position: { x: 300, y: 100 * (index + 1) }
          })
          this.nodes.push(dbNode)
          this.addEdge({
            source: projectNode.id,
            target: dbNode.id
          })
        }

        if (project.gitRepository) {
          const repoNode = this.createNode({
            id: `repo-${project.id}`,
            type: NODE_TYPES.REPOSITORY,
            data: {
              label: 'Git Repository',
              details: { url: project.gitRepository }
            },
            position: { x: -100, y: 100 * (index + 1) }
          })
          this.nodes.push(repoNode)
          this.addEdge({
            source: projectNode.id,
            target: repoNode.id
          })
        }
      })
    },

    createNode(nodeData) {
      return {
        ...nodeData,
        type: nodeData.type || 'custom',
        style: {
          background: NODE_COLORS[nodeData.type],
          color: '#fff'
        }
      }
    },

    addNodeOfType(position, type) {
      const id = `${type.toLowerCase()}-${this.nextNodeId}`
      const newNode = this.createNode({
        id,
        type,
        position,
        data: {
          label: `New ${type.toLowerCase()}`,
          status: type === NODE_TYPES.PROJECT ? 'active' : undefined,
          details: {}
        }
      })
      
      this.nodes.push(newNode)
      this.nextNodeId++
      return newNode
    },

    addEdge(connection) {
      const newEdge = {
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target
      }
      this.edges.push(newEdge)
    },

    updateNodePosition(nodeId, position) {
      const node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        node.position = position
      }
    }
  }
})
