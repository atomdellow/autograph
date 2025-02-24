<template>
  <div class="graphflow-container">
    <!-- Simple toolbar -->
    <div class="type-toolbar">
      <button 
        v-for="(icon, type) in NODE_ICONS" 
        :key="type"
        :class="['type-button', { active: selectedType === type }]"
        @click="selectedType = type"
      >
        <span class="icon">{{ icon }}</span>
        {{ type.toLowerCase() }}
      </button>
    </div>

    <VueFlow
      v-model="elements"
      class="basicflow"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
      @paneClick="onPaneClick"
      @nodeClick="onNodeClick"
      :node-types="nodeTypes"
      :connect-mode="ConnectionMode.Loose"
      @connect="onConnect"
    >
      <template #node-default="nodeProps">
        <CustomNode 
          :id="nodeProps.id"
          :data="nodeProps.data"
          :edges="elements.filter(el => el.source && el.target)"
        />
      </template>
    </VueFlow>

    <NodeDetails 
      v-if="selectedNode"
      :node="selectedNode"
      :edges="elements.filter(el => el.source)"
      :nodes="elements.filter(el => el.type)"
      @update="updateNodeData"
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

const store = useGraphStore()
const selectedType = ref('PROJECT') // Default selected type
const { fitView, project } = useVueFlow()
const selectedNode = ref(null)

const nodeTypes = markRaw({
  custom: CustomNode
})

// Compute elements from store
const elements = computed(() => [...store.nodes, ...store.edges])

// Add handle styling
const handleStyle = {
  width: '12px',
  height: '12px',
  background: 'white',
  border: '2px solid #555',
  borderRadius: '50%'
}

onMounted(() => {
  console.log('Mounted')
  setTimeout(() => {
    fitView()
    console.log('Fitted view')
  }, 100)
})

function onNodeClick(event) {
  const { node } = event
  selectedNode.value = node
  console.log('Selected node:', node)
}

function onConnect(params) {
  console.log('Connection created:', params)
  const newEdge = {
    id: `edge-${params.source}-${params.target}`,
    source: params.source,
    target: params.target
  }
  store.addEdge(newEdge)
}

function addHandle(nodeId) {
  const node = elements.value.find(el => el.id === nodeId)
  if (!node) return

  if (!node.data.handles) {
    node.data.handles = []
  }

  const handleId = `handle-${node.data.handles.length + 1}`
  node.data.handles.push({
    id: handleId,
    type: 'source'
  })
}

function removeHandle(nodeId, handleId) {
  const node = elements.value.find(el => el.id === nodeId)
  if (!node) return

  // Remove handle
  node.data.handles = node.data.handles.filter(h => h.id !== handleId)
  
  // Remove any connections using this handle
  elements.value = elements.value.filter(el => 
    el.type !== 'edge' || 
    (el.sourceHandle !== handleId && el.targetHandle !== handleId)
  )
}

function onPaneClick(evt) {
  if (!selectedType.value) return
  
  const position = project({ x: evt.clientX, y: evt.clientY })
  
  const newNode = {
    id: `${selectedType.value.toLowerCase()}-${store.nodes.length + 1}`,
    type: 'custom',  // Use our custom node type
    position,
    data: { 
      nodeType: selectedType.value,
      name: `New ${selectedType.value.toLowerCase()}`,
      status: 'pending',
      createdAt: Date.now()
    }
  }
  
  store.addNode(newNode)
  console.log('Added node:', newNode)
}

function updateNodeData({ id, data }) {
  const node = elements.value.find(el => el.id === id)
  if (node) {
    node.data = { ...node.data, ...data }
  }
}

function getNodeEdges(nodeId, type) {
  return elements.value.filter(el => 
    el.hasOwnProperty('source') && 
    el.hasOwnProperty('target') && 
    el[type] === nodeId
  )
}

function getEdgesForNode(nodeId) {
  return elements.value.filter(el => 
    el.source && el.target && (el.source === nodeId || el.target === nodeId)
  )
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
