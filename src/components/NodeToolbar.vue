<template>
  <div class="node-toolbar">
    <button 
      v-for="(icon, type) in NODE_ICONS" 
      :key="type"
      class="node-type-button"
      :title="type.toLowerCase()"
      @click="() => onNodeTypeSelect(type)"
    >
      <span class="icon">{{ icon }}</span>
      <span class="type-name">{{ type.toLowerCase() }}</span>
    </button>s
  </div>
</template>

<script>
import { NODE_ICONS, NODE_TYPES } from '../constants/nodeTypes'

export default {
  name: 'NodeToolbar',
  
  setup(props, { emit }) {
    const onNodeTypeSelect = (type) => {
      emit('node-type-select', type)
    }

    return {
      NODE_ICONS,
      NODE_TYPES,
      onNodeTypeSelect
    }
  }
}
</script>

<style>
.node-toolbar {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.node-type-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.node-type-button:hover {
  background-color: #f0f0f0;
}

.icon {
  font-size: 1.2em;
}

.type-name {
  text-transform: capitalize;
}
</style>
