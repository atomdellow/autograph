<template>
  <div class="subtype-toolbar" v-show="selectedType && NODE_SUBTYPES[selectedType]">
    <div class="subtype-header">
      <span class="type-icon">{{ NODE_ICONS[selectedType] }}</span>
      <span>{{ selectedType.toLowerCase() }} types</span>
    </div>
    <div class="subtype-options">
      <button 
        v-for="(config, subType) in NODE_SUBTYPES[selectedType]"
        :key="subType"
        :class="['subtype-button', { active: activeSubType === subType }]"
        @click="onSelect(subType)"
      >
        <span class="icon">{{ config.icon }}</span>
        <span class="label">{{ config.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { NODE_ICONS } from '../constants/nodeTypes'
import { NODE_SUBTYPES } from '../constants/nodeSubTypes'
import { watch } from 'vue'

const props = defineProps({
  selectedType: {
    type: String,
    required: true
  },
  activeSubType: String
})

const emit = defineEmits(['select'])

function onSelect(subType) {
  emit('select', {
    type: props.selectedType,
    subType
  })
}
</script>

<style scoped>
.subtype-toolbar {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 9;
  transition: all 0.3s ease;
}

.subtype-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #666;
}

.subtype-options {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.subtype-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.subtype-button:hover {
  background: #f5f5f5;
  border-color: #2196F3;
}

.subtype-button.active {
  background: #e3f2fd;
  border-color: #2196F3;
}

.icon {
  font-size: 1.2em;
}
</style>
