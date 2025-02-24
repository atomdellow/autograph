<template>
  <div v-if="node" class="node-details">
    <div class="details-header" :style="{ background: NODE_COLORS[node.data.nodeType] }">
      <span class="node-icon">{{ NODE_ICONS[node.data.nodeType] }}</span>
      <span>{{ node.data.name || node.data.nodeType }}</span>
    </div>
    
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="details-content">
      <!-- General Tab -->
      <div v-if="activeTab === 'general'" class="tab-content">
        <div class="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            v-model="nodeName" 
            @input="updateNode"
            placeholder="Node name"
          />
        </div>
        <div class="form-group">
          <label>Type:</label>
          <div class="type-badge" :style="{ background: NODE_COLORS[node.data.nodeType] }">
            {{ node.data.nodeType }}
          </div>
        </div>
        <div class="form-group">
          <label>Created:</label>
          <div class="info-text">{{ formatDate(node.data.createdAt || Date.now()) }}</div>
        </div>
      </div>

      <!-- Connections Tab -->
      <div v-if="activeTab === 'connections'" class="tab-content">
        <div class="connections-group">
          <h3>Inputs</h3>
          <div v-for="conn in inputConnections" :key="conn.id" class="connection-item">
            <span class="connection-icon">{{ NODE_ICONS[conn.node.data.nodeType] }}</span>
            <span class="connection-name">{{ conn.node.data.name }}</span>
          </div>
          <div v-if="!inputConnections.length" class="empty-state">No input connections</div>
        </div>

        <div class="connections-group">
          <h3>Outputs</h3>
          <div v-for="conn in outputConnections" :key="conn.id" class="connection-item">
            <span class="connection-icon">{{ NODE_ICONS[conn.node.data.nodeType] }}</span>
            <span class="connection-name">{{ conn.node.data.name }}</span>
          </div>
          <div v-if="!outputConnections.length" class="empty-state">No output connections</div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="tab-content">
        <div class="form-group">
          <label>Description:</label>
          <textarea 
            v-model="description" 
            @input="updateNode"
            placeholder="Add a description..."
            rows="3"
          ></textarea>
        </div>
        <div class="form-group">
          <label>Status:</label>
          <select v-model="status" @change="updateNode">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
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

const activeTab = ref('general')
const description = ref('')
const status = ref('active')

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'connections', label: 'Connections' },
  { id: 'settings', label: 'Settings' }
]

const inputConnections = computed(() => 
  connections.value.filter(conn => conn.type === 'Input')
)

const outputConnections = computed(() => 
  connections.value.filter(conn => conn.type === 'Output')
)

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString()
}

function updateNode() {
  emit('update', {
    id: props.node.id,
    data: {
      ...props.node.data,
      name: nodeName.value,
      description: description.value,
      status: status.value
    }
  })
}

// Initialize values when node changes
watch(() => props.node, (newNode) => {
  if (newNode) {
    nodeName.value = newNode.data.name || ''
    description.value = newNode.data.description || ''
    status.value = newNode.data.status || 'active'
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

.tabs {
  display: flex;
  padding: 0 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.tab-button {
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button.active {
  color: #2196F3;
  border-bottom-color: #2196F3;
}

.tab-content {
  padding: 20px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 0.9em;
}

.connections-group {
  margin-bottom: 20px;
}

.connections-group h3 {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
}

.empty-state {
  color: #999;
  font-style: italic;
  padding: 10px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 4px;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.info-text {
  color: #666;
}
</style>
