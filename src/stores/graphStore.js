import { defineStore } from 'pinia'
import { NODE_ICONS } from '../constants/nodeTypes'
import { getSubTypeDefaults } from '../constants/nodeSubTypes'

export const useGraphStore = defineStore('graph', {
  state: () => ({
    nodes: [],
    edges: [],
    selectedNode: null
  }),

  getters: {
    getNodeConnections: (state) => (nodeId) => {
      if (!nodeId || !state.edges) return []
      
      return state.edges.filter(edge => 
        edge && (edge.source === nodeId || edge.target === nodeId)
      )
    }
  },

  actions: {
    addNode(type, subType, position) {
      if (!type || !position) return null
      
      try {
        const defaults = getSubTypeDefaults(type, subType)
        const newNode = {
          id: `${type.toLowerCase()}-${this.nodes.length + 1}`,
          type: 'custom',
          position: {
            x: position.x,
            y: position.y
          },
          data: {
            nodeType: type,
            subType: subType,
            name: defaults.label || `New ${type.toLowerCase()}`,
            icon: defaults.icon || NODE_ICONS[type],
            status: 'pending',
            createdAt: Date.now()
          }
        }
        this.nodes.push(newNode)
        return newNode
      } catch (error) {
        console.error('Error creating node:', error)
        return null
      }
    },

    addEdge(params) {
      if (!params.source || !params.target) return null
      
      const newEdge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep'  // Use smoothstep by default
      }
      this.edges.push(newEdge)
      return newEdge
    },

    updateNode(nodeId, data) {
      const node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        node.data = { ...node.data, ...data }
      }
    },

    setSelectedNode(node) {
      this.selectedNode = node
    },

    removeNode(nodeId) {
      // Remove the node
      this.nodes = this.nodes.filter(node => node.id !== nodeId)
      // Remove associated edges
      this.edges = this.edges.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      )
    },

    updateNodePosition(nodeId, newPosition) {
      const node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        node.position = { ...newPosition }
      }
    },

    removeEdge(edgeId) {
      this.edges = this.edges.filter(edge => edge.id !== edgeId)
    }
  }
})
