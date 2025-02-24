<template>
  <div class="graphflow-container">
    <!-- Main toolbar -->
    <div class="type-toolbar">
      <button 
        v-for="(icon, type) in NODE_ICONS" 
        :key="type"
        :class="['type-button', { active: selectedType === type }]"
        @click="onTypeSelect(type)"
      >
        <span class="icon">{{ icon }}</span>
        {{ type.toLowerCase() }}
      </button>
    </div>

    <!-- Always show SubTypeToolbar when a type is selected -->
    <SubTypeToolbar 
      v-if="selectedType"
      :selectedType="selectedType"
      :activeSubType="selectedSubType"
      @select="onSubTypeSelect"
    />

    <VueFlow
      :nodes="store.nodes"
      :edges="store.edges"
      class="basicflow"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      @paneClick="onPaneClick"
      @nodeClick="onNodeClick"
      @nodesChange="onNodesChange"
      @edgesChange="onEdgesChange"
      :node-types="nodeTypes"
      :connect-mode="ConnectionMode.Loose"
      :default-edge-options="{ type: 'smoothstep' }"
      @connect="onConnect"
    >
      <template #node-default="nodeProps">
        <CustomNode 
          :id="nodeProps.id"
          :data="nodeProps.data"
        />
      </template>
    </VueFlow>

    <NodeDetails 
      v-if="store.selectedNode"
      :node="store.selectedNode"
      :edges="store.edges"
      :nodes="store.nodes"
      @update="(data) => store.updateNode(data.id, data.data)"
    />
  </div>
</template>

<script setup>
import { VueFlow, useVueFlow, ConnectionMode } from '@vue-flow/core'
import { ref, computed, onMounted, markRaw } from 'vue'
import { NODE_COLORS, NODE_ICONS } from '../constants/nodeTypes'
import CustomNode from './CustomNode.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import NodeDetails from './NodeDetails.vue'
import { useGraphStore } from '../stores/graphStore'
import SubTypeToolbar from './SubTypeToolbar.vue'
import { getSubTypeDefaults } from '../constants/nodeSubTypes'

const store = useGraphStore()
const { fitView, project } = useVueFlow()
const selectedType = ref('PROJECT')
const selectedSubType = ref(null)

const nodeTypes = markRaw({
  custom: CustomNode
})

// Remove the elements computed property since we're using store directly

onMounted(() => {
  console.log('Mounted')
  setTimeout(() => {
    fitView()
    console.log('Fitted view')
  }, 100)
})

function onNodeClick(event) {
  store.setSelectedNode(event.node)
}

function onConnect(params) {
  // Create edge without modifying node positions
  store.addEdge({
    ...params,
    // Ensure we're not passing position data
    type: 'smoothstep'  // optional: makes connections look smoother
  })
}

function onPaneClick(evt) {
  if (!selectedType.value) return
  
  // Get correct position from mouse click
  const position = project({ x: evt.clientX, y: evt.clientY })
  store.addNode(selectedType.value, selectedSubType.value, position)
}

function onTypeSelect(type) {
  selectedType.value = type
  selectedSubType.value = null // Reset subtype when changing main type
}

function onSubTypeSelect({ type, subType }) {
  if (!type || !subType) return
  
  selectedSubType.value = subType

  // Don't automatically create node when selecting subtype
  // Wait for user to click on the pane instead
}

function onNodesChange(changes) {
  changes.forEach(change => {
    if (change.type === 'remove') {
      store.removeNode(change.id)
    } else if (change.type === 'position' && change.position) {
      store.updateNodePosition(change.id, change.position)
    }
  })
}

function onEdgesChange(changes) {
  changes.forEach(change => {
    if (change.type === 'remove') {
      store.removeEdge(change.id)
    }
  })
}
</script>

<style>
.graphflow-container {
  width: 100%;
  height: 100vh;
  position: relative;
  padding-right: 300px;
}

.vue-flow {
  flex-grow: 1;
  width: 100%;
  height: 100%;
}

.vue-flow__node-default {
  padding: 15px;
  border-radius: 8px;
  min-width: 150px;
  font-size: 12px;
  text-align: center;
  border-width: 2px;
  border-style: solid;
  transition: all 0.2s;
}

.vue-flow__node-default:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.vue-flow__handle {
  transition: all 0.2s;
}

.vue-flow__handle:hover {
  background: #2196F3 !important;
  border-color: #1976D2 !important;
}

.vue-flow__edge {
  stroke: #555;
  stroke-width: 2;
}

.vue-flow__edge-path {
  stroke-width: 2;
}

.vue-flow__edge:hover {
  stroke: #2196F3;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  font-size: 1.2em;
}

.type-toolbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 10;
  margin-bottom: 60px; /* Make room for subtypes toolbar */
}

.type-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-button:hover {
  background: #f5f5f5;
}

.type-button.active {
  background: #e3f2fd;
  border-color: #2196F3;
}

.type-button .icon {
  font-size: 1.2em;
}

.right-handles {
  position: absolute;
  right: -12px;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 10px;
}

.add-handle {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.add-handle:hover {
  background: rgba(255, 255, 255, 0.5);
}

.remove-handle {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  background: #ff4444;
  color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.vue-flow__handle:hover .remove-handle {
  opacity: 1;
}
</style>
