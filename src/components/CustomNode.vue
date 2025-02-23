<template>
  <div 
    class="custom-node"
    :style="{
      background: NODE_COLORS[data.nodeType],
      color: 'white',
      borderColor: NODE_COLORS[data.nodeType]
    }"
  >
    <Handle 
      type="target"
      :position="Position.Left"
    />
    <div class="node-content">
      <span class="node-icon">{{ NODE_ICONS[data.nodeType] }}</span>
      <span class="node-label">{{ data.nodeType }}</span>
    </div>
    <Handle 
      type="source"
      :position="Position.Right"
    />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NODE_COLORS, NODE_ICONS } from '../constants/nodeTypes'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.custom-node {
  padding: 15px;
  border-radius: 8px;
  min-width: 150px;
  font-size: 12px;
  text-align: center;
  border-width: 2px;
  border-style: solid;
  transition: all 0.2s;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.node-icon {
  font-size: 1.2em;
}

.node-label {
  font-weight: 500;
  text-transform: capitalize;
}
</style>
