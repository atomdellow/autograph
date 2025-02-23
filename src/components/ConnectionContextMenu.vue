<template>
  <div 
    v-if="show"
    class="connection-context-menu"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <button
      v-for="(icon, type) in NODE_ICONS"
      :key="type"
      class="menu-item"
      @click="() => onSelect(type)"
    >
      <span class="icon">{{ icon }}</span>
      <span>New {{ type.toLowerCase() }}</span>
    </button>
  </div>
</template>

<script>
import { NODE_ICONS } from '../constants/nodeTypes'

export default {
  name: 'ConnectionContextMenu',
  props: {
    show: Boolean,
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    sourceNodeId: String
  },

  setup(props, { emit }) {
    const onSelect = (type) => {
      emit('select', {
        type,
        sourceNodeId: props.sourceNodeId
      })
    }

    return {
      NODE_ICONS,
      onSelect
    }
  }
}
</script>

<style>
.connection-context-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 4px;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
}

.menu-item:hover {
  background: #f0f0f0;
}

.menu-item .icon {
  font-size: 1.2em;
}
</style>
