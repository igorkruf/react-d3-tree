import React , { useState } from 'react';
import Tree from 'react-d3-tree';
import tree_data from '../data/tree_data.json'





// Кастомная подпись узла
const CustomNodeLabel = ({ nodeData }) => (
  <g>
    <rect x="-50" y="-15" width="100" height="30" fill="#f0f0f0" stroke="#ccc" rx="5" />
    <text x="0" y="0" textAnchor="middle">
      {nodeData.name}
    </text>
    {nodeData.customInfo && (
      <text x="0" y="15" textAnchor="middle" fontSize="10">
        ({nodeData.customInfo})
      </text>
    )}
  </g>
);

const CustomNode = ({ nodeDatum, onMouseOver, onMouseOut, hoveredNodeId, onClick }) => {
      // Определяем, наведен ли курсор на текущий узел
      const isHovered = hoveredNodeId === nodeDatum.id;
      return (
        <g>
          <circle
            r={15}

            fill={isHovered ? 'red' : 'blue'}
            onMouseOver={() => onMouseOver(nodeDatum)}
            onMouseOut={onMouseOut}
            onClick={() =>onClick(nodeDatum)}
          />
          <text fill="#000" stroke="none" x={20} dy="0.3em">
            {nodeDatum.name}
          </text>
        </g>
      );
    };

export default function OrgChartTree() {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [clickedNodeId, setClickedNodeId] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
// //////////////////////////////////////////////////////////////////
  const handleNodeMouseOver = (node) => {
    console.log('навели курсор мыши!!!')  
    setHoveredNodeId(node.id);
    };
  
  const handleNodeMouseOut = () => {
    console.log('убрали курсор мыши')
    setHoveredNodeId(null);
    };

  

///////////////////////////////////////////////////////////////////////
  // Обработчик клика на узел
  const handleNodeClick = (node) => {
    console.log('Кликнули по узлу')
    setClickedNodeId(node.id)
    console.log(node)
    if (node) {
      const nodeName = node.name;

      // Переключаем статус сворачивания
      const newSet = new Set(collapsedNodes);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }

      setCollapsedNodes(newSet);
    }
  };
  // Рекурсивная функция для фильтрации дерева
  const filterTree = (node) => {
    const result = { ...node };
    if (result.children) {
      if (collapsedNodes.has(result.name)) {
        // Скрываем детей, но сохраняем сам узел
        result.children = [];
        result.originalChildrenCount = result.children.length; // обновляем счетчик
      } else {
        result.children = result.children.map(filterTree);
      }
    }
    return result;
  };
////////////////////////////////////////////////////////////////




  const filteredTree = filterTree(tree_data);    

  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{width: '1500px', height: '100vh', border: '1px solid red' }} >
      <Tree 
       
      data={filteredTree} 
      // initialDepth={3}
      nodeSize={{ x: 600, y: 32 }} // <- Расстояние между узлами (x - горизонтально, y - вертикально)     
      renderCustomNodeElement={(rd3tProps) => 
        <CustomNode 
          {...rd3tProps} 
          onMouseOver={handleNodeMouseOver}
          onMouseOut={handleNodeMouseOut}
          hoveredNodeId={hoveredNodeId}
          clickedNodeId={clickedNodeId}
          onClick={handleNodeClick}
          
        />
      }
      
      />
    </div>
  );
}