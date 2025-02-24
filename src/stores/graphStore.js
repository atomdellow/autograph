import { defineStore } from 'pinia'

export const useGraphStore = defineStore('graph', {
  state: () => ({
    nodes: [],
    edges: []
  }),

  getters: {
    getNodeConnections: (state) => (nodeId) => {
      return state.edges.filter(edge => 
        edge.source === nodeId || edge.target === nodeId
      )
    }
  },

  actions: {
    addNode(node) {
      this.nodes.push(node)
    },

    addEdge(edge) {
      this.edges.push(edge)
    },

    updateNode(nodeId, data) {
      const node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        Object.assign(node.data, data)
      }
    }
  }
})
