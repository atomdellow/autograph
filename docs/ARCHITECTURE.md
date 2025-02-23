# Autograph Component Architecture

## Core Files and Their Purposes

### 1. Constants (`/src/constants/nodeTypes.js`)
- Defines all node types, colors, and icons
- Single source of truth for node appearances
- Used by all components for consistent styling
```javascript
NODE_TYPES    // Available node types (PROJECT, DATABASE, etc.)
NODE_COLORS   // Color mapping for each type
NODE_ICONS    // Icon mapping for each type
```

### 2. Custom Node (`/src/components/CustomNode.vue`)
- Template for how each node looks
- Handles node appearance and structure
- Key properties:
```javascript
props: ['data', 'type']  // data contains label, type controls appearance
Position.Left   // Left handle position
Position.Right  // Right handle position
```

### 3. Graph Editor (`/src/components/GraphEditor.vue`)
- Main container component
- Manages node creation and connections
- Key functions:
```javascript
onPaneClick()      // Creates new nodes
onConnect()        // Handles node connections
nodeTypes          // Registers custom node components
```

### 4. Node Toolbar (`/src/components/NodeToolbar.vue`)
- Provides UI for node type selection
- Emits selected type to Graph Editor
- Uses NODE_ICONS for consistent display

## Data Flow

1. User selects node type from toolbar
2. Click on canvas triggers `onPaneClick`
3. New node created with:
   - Unique ID
   - Selected type
   - Position from click
   - Default handles (left/right)
4. Node rendered using CustomNode component
5. Handles enable connections between nodes

## Node Properties

### Required Node Properties
```javascript
{
  id: string,          // Unique identifier
  type: NODE_TYPES,    // Determines appearance
  position: {x, y},    // Location on canvas
  data: {              // Custom data
    label: string,     // Node display text
    handles: []        // Optional additional handles
  }
}
```

### Handle Properties
```javascript
{
  type: 'source' | 'target',  // Handle type
  position: Position.Left | Position.Right,  // Handle position
  id: string                  // Optional unique identifier
}
```

## Styling

- Node colors come from NODE_COLORS
- Icons from NODE_ICONS
- Handle positions fixed left/right for horizontal flow
- Custom styling applied through node props

## Events

- `node-type-select`: Emitted by toolbar on type selection
- `connect`: Triggered when nodes are connected
- `paneClick`: Triggered for node creation
