<template>
  <div v-if="node" class="node-details">
    <div class="details-header" :style="{ background: NODE_COLORS[node.data.nodeType] }">
      <span class="node-icon">{{ NODE_ICONS[node.data.nodeType] }}</span>
      <span>{{ node.data.nodeType }}</span>
    </div>
    
    <div class="details-content">
      <div class="form-group">
        <label>Name:</label>
        <input 
          type="text" 
          v-model="nodeName" 
          @input="updateNode('name')"
          placeholder="Node name"
        />
      </div>

      <div class="connections-section">
        <h3>Connections</h3>
        <div v-for="conn in connections" :key="conn.id" class="connection-item">
          <span class="connection-icon">{{ NODE_ICONS[conn.node.data.nodeType] }}</span>
          <span class="connection-type">{{ conn.type }}:</span>
          <span class="connection-name">{{ conn.node.data.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { NODE_COLORS, NODE_ICONS } from '../constants/nodeTypes'

const props = defineProps({
  node: Object,
  edges: Array,
  nodes: Array
})

const emit = defineEmits(['update'])
const nodeName = ref('')

watch(() => props.node, (newNode) => {
  if (newNode) {
    nodeName.value = newNode.data.name || ''
  }
}, { immediate: true })

const connections = computed(() => {
  if (!props.node) return []
  
  return props.edges
    .filter(edge => edge.source === props.node.id || edge.target === props.node.id)
    .map(edge => {
      const isSource = edge.source === props.node.id
      const connectedNode = props.nodes.find(n => 
        n.id === (isSource ? edge.target : edge.source)
      )
      return {
        id: edge.id,
        type: isSource ? 'Output' : 'Input',
        node: connectedNode
      }
    })
})

function updateNode(field) {
  if (!props.node) return
  emit('update', {
    id: props.node.id,
    data: {
      ...props.node.data,
      name: nodeName.value
    }
  })
}
</script>

<style scoped>
.node-details {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
  overflow-y: auto;
}

.details-header {
  position: sticky;
  top: 0;
  padding: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2em;
  z-index: 1001;
}

.details-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.connections-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.connection-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.connection-icon {
  font-size: 1.2em;
}

.connection-type {
  font-size: 0.9em;
  color: #666;
}

.connection-name {
  font-weight: 500;
}
</style>
