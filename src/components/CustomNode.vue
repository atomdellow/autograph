<template>
  <div 
    class="custom-node"
    :style="{
      background: NODE_COLORS[data.nodeType],
      color: 'white',
      borderColor: NODE_COLORS[data.nodeType]
    }"
  >
    <Handle type="target" :position="Position.Left" />
    
    <div class="node-content">
      <div class="node-header">
        <span class="node-icon">{{ data.icon || NODE_ICONS[data.nodeType] }}</span>
        <div class="node-type-info">
          <span class="node-type">{{ data.nodeType }}</span>
          <span v-if="data.subType" class="node-subtype">{{ data.subType }}</span>
        </div>
      </div>
      
      <div class="node-details">
        <div class="detail-item name">{{ data.name || 'Unnamed' }}</div>
        <div v-if="data.status" class="detail-item status" :class="data.status">
          ● {{ data.status }}
        </div>
        <div v-if="data.description" class="detail-item description">
          {{ truncate(data.description, 50) }}
        </div>
        <div class="detail-item connections">
          {{ connectionCount }} connection{{ connectionCount !== 1 ? 's' : '' }}
        </div>
      </div>
    </div>

    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NODE_COLORS, NODE_ICONS } from '../constants/nodeTypes'
import { computed } from 'vue'
import { useGraphStore } from '../stores/graphStore'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

const store = useGraphStore()

const connectionCount = computed(() => {
  const connections = store.getNodeConnections(props.id)
  return Array.isArray(connections) ? connections.length : 0
})

function truncate(str, length) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}
</script>

<style scoped>
.custom-node {
  padding: 15px;
  border-radius: 8px;
  min-width: 200px;
  font-size: 12px;
  text-align: left;
  border-width: 2px;
  border-style: solid;
  transition: all 0.2s;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.node-type-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.node-type {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
}

.node-subtype {
  font-size: 0.8em;
  opacity: 0.8;
}

.node-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item {
  font-size: 0.85em;
  opacity: 0.9;
}

.detail-item.name {
  font-weight: 500;
  font-size: 1em;
}

.detail-item.status {
  font-size: 0.8em;
  opacity: 0.8;
}

.detail-item.status.active { color: #4CAF50; }
.detail-item.status.inactive { color: #9E9E9E; }
.detail-item.status.pending { color: #FFC107; }

.detail-item.description {
  font-style: italic;
  opacity: 0.8;
}

.detail-item.connections {
  font-size: 0.8em;
  opacity: 0.7;
}
</style>
