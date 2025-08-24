import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {Tree} from 'react-d3-tree';
import tree_data from '../data/tree_data.json';
// import list_available_tree_data from '../data/list_available_data.json'
import NodeInfo from './components/node_info/NodeInfo';
import KmpsInfo from './components/kmps_info/KmpsInfo';
import KmpsTable from './components/kmps_table/KmpsTable.jsx';
import './App.css';
import useLocalStorage from 'use-local-storage';
import { getCookie, 
         getPathToValue, 
         setValueByPath, 
         removeNodeByPath, 
         findNodeInObject,
        updateCountHoursForAllParentNode} from './components/functions.js'


export default function customTree() {
  let [treeData, setTreeData] = useState(null);
  let [idActiveKmps, setIdActiveKmps] = useLocalStorage('id_active_kmps', '');
  let [activeKmpsData, setActiveKmpsData] = useState();
  // let [allHours, setAllHours] = useLocalStorage('kmps_all_hours', 0);;
  let [listDraftKmps, setListDraftKmps] = useState([]);
  let [isTable, setIsTable] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [clickedNodeId, setClickedNodeId] = useState(null);
  const [visibleNodeInfo, setVisibleNodeInfo] =useState(false)
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [successAddedDraftKmps, setSuccessAddedDraftKmps] = useState(false);
  const [scale, setScale] = useState(0.8); // Начальный масштаб
  let [availableHours, setAvailableHours] = useLocalStorage('kmps_availabel_hours', 0);
  let [listDisciplinesNames, setListDisciplineNames] = useLocalStorage('kmps_list_disciplines_names', []);
  let [listDisciplines, setListDisciplines] = useLocalStorage('kmps_list_disciplines', [])
  let [countHours, setCountHours] = useLocalStorage('kmps_count_hours', 0);
  
  
  // let refIsDraftKmps = useRef(false);
  let nodeinfoWrapper = useRef();
  let timerRef = useRef();
  let treeWrapper = useRef();

// Получаем данные для построения графа ////////////////////////////////////////////////////
useLayoutEffect(()=>{

   try {
    console.log('До очистки:', localStorage.length, 'элементов');
    localStorage.clear();
    console.log('После очистки:', localStorage.length, 'элементов');
    console.log(localStorage.getItem('kmps_availabel_hours'));
    setAvailableHours(0);
    // // Проверим, можем ли мы записать
    // localStorage.setItem('test', '123');
    // console.log('Записали test:', localStorage.getItem('test'));
    // localStorage.removeItem('test');
  } catch (error) {
    console.error('Ошибка при работе с localStorage:', error);
  }

  return () => {
    // Очистка при размонтировании (не влияет на первоначальную очистку)
    
    
  };
}, [])

useEffect(()=>{
   
  async function getListDisciplineNames(){
       let fetchUrl = document.querySelector('#root').dataset.list_disciplines_all;
       let response = await fetch(`${fetchUrl}`, {
            method: 'GET',
            credentials: 'include',
            });
       let result = await response.json();
       console.log('дисциплины-disciplines_names: ', result.data);
       setListDisciplineNames(result.data); 
       }
  getListDisciplineNames();



  async function getListDisciplines(){
      let fetchUrl = document.querySelector('#root').dataset.list_disciplines;
      let response = await fetch(`${fetchUrl}`, {
          method: 'GET',
          credentials: 'include',
          });
      let result = await response.json();
      console.log('дисциплины disciplines: ', result.data);
      setListDisciplines(result.data); 
      }
  getListDisciplines();
  
  getTreeData();
  
   

},[])

async function getTreeData(){
    // let fetchUrl = document.querySelector('.kmps-react_d3_tree #root').dataset.base_url
    let fetchUrl = document.querySelector('#root').dataset.base_url
    console.log('запросили данные для графа КМПС')
    let responce = await fetch(fetchUrl, {
      method: 'GET',
      credentials: 'include',
    });
    let result = await responce.json();
   
    setTreeData(result);
    setIdActiveKmps(result.id);
    setCountHours(result.count_hours);
    getListDraftKmps(result);
    setActiveKmpsData(result);
    setAllHours()
    
  }

 async function getListDraftKmps(treeData){
    // let fetchUrl = document.querySelector('.kmps-react_d3_tree #root').dataset.list_draft_kmps_url
    let fetchUrl = document.querySelector('#root').dataset.list_draft_kmps_url
    console.log('запросили список черновиков КМПС')
    let response = await fetch(fetchUrl, {
      method: 'GET',
      credentials: 'include',
    });
    let result = await response.json();
    console.log(treeData);
    console.log('Список черновиков текущего пользователя');
    console.log(result.list_draft_kmps);
    let listKmps = [{"pk":treeData.id, "name":treeData.name}];
    listKmps.push(...result.list_draft_kmps);
    console.log(listKmps);
    setListDraftKmps(listKmps);
    // setTreeData(result);
    // setCountHours(result.count_hours)
    // setAvailableHours()
    
  }
// useEffect(async()=>{
// let response = await fetch()

// }, [])


useEffect(()=>{

    let rectNodeinfoWrapper = nodeinfoWrapper.current.getBoundingClientRect();
    // console.log('rect bottom');
    // console.log(rectNodeinfoWrapper.bottom);
    // console.log(parseInt(nodeinfoWrapper.current.style.top));
    // console.log(window.innerHeight);
    nodeinfoWrapper.current.style.top =`${(parseInt(nodeinfoWrapper.current.style.top))-((rectNodeinfoWrapper.bottom - window.innerHeight)>0?(rectNodeinfoWrapper.bottom - window.innerHeight):0)-12}px`
  },[visibleNodeInfo])
// Обработчики событий мыши на узле //////////////////////////////////////////////////////////////////
  const handleNodeMouseOver = (node, e) => {
    console.log(node.path);
    console.log('e', e);
    timerRef.current=setTimeout(()=>{
      console.log('сработало через 1 сек')

      setVisibleNodeInfo(true);
      let rect = treeWrapper.current.getBoundingClientRect();
      nodeinfoWrapper.current.style.left=`${e.clientX - rect.x}px`
      nodeinfoWrapper.current.style.top =`${e.clientY - rect.y}px`
      setHoveredNode(node);
    }, 1000);
    
    
  };
  
  const handleNodeMouseOut = () => {
    // nodeinfoWrapper.current.classList.remove('node-info__wrapper_visible');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
 
    // 
    const handleNodeInfoMouseOut = () => {
      console.log('убрали курсор мыши c nodeinfo');
      setVisibleNodeInfo(false);
    };


// Обработчики событий мыши на связи ////////////////////////////////////////////////////////////////////
    const handleLinkMouseOver = (sourceNode,targetNode,event ) => {
      console.log('parent:', sourceNode);
      console.log('Дочерний:', targetNode);
      console.log('Событие:', event);
    };
    const handleLinkMouseOut = () => {
    console.log('убрали курсор мыши со связи')
    };


// Обработчик клика на узел
  // const handleNodeClick = (node) => {
  //   console.log('Кликнули по узлу')
    
  //   if (node) {
  //     const nodeName = node.name;

  //     // Переключаем статус сворачивания
  //     const newSet = new Set(collapsedNodes);
  //     if (newSet.has(nodeName)) {
  //       newSet.delete(nodeName);
  //     } else {
  //       newSet.add(nodeName);
  //     }

  //     setCollapsedNodes(newSet);
  //   }
  // };
  // // Рекурсивная функция для фильтрации дерева
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




  const filteredTree = filterTree(treeData);    
  
  useEffect(() => {
  if (treeWrapper.current && filteredTree) {
    const { width, height } = treeWrapper.current.getBoundingClientRect();
    console.log('width', width)
    // Для горизонтального дерева:
    setTranslate({
      x: 500, // Отступ слева
      y: height / 2, // Центр по вертикали
    });

   
  }
}, []);

let increaseAvailableHours = (disciplineId, competencyId, newCountHours)=>{
    
    setAvailableHours(availableHours+1);
    let newTreeData =JSON.parse(JSON.stringify(treeData));
    let competencyNode = findNodeInObject(newTreeData, 'id', competencyId );
    competencyNode.count_hours['total_hours'] -=1; 
    competencyNode.count_hours[disciplineId] = newCountHours;
    console.log('competencyNode');
    console.log(competencyNode);
    setTreeData(newTreeData);

}

let decreaseAvailableHours = (disciplineId, competencyId, newCountHours)=>{
  
    setAvailableHours(availableHours-1)
    let newTreeData =JSON.parse(JSON.stringify(treeData));
    let competencyNode = findNodeInObject(newTreeData, 'id', competencyId );
    competencyNode.count_hours['total_hours'] +=1; 
    competencyNode.count_hours[disciplineId] = newCountHours;
    setTreeData(newTreeData);
}

// Собираем ID активного узла и всех потомков ////////////////////////
  // const highlightedNodeIds = useMemo(()=>{
  //   let ids = new Set();
  //   if (!activeNodeId) return ids;

  //   const findNode = (node, targetId) => {
  //     if (node.id === targetId) return node;
  //     if (node.children) {
  //       for (const child of node.children) {
  //         const found = findNode(child, targetId);
  //         if (found) return found;
  //       }
  //     }
  //     return null;
  //   };
    
  //   const collectIds = (node) => {
  //     ids.add(node.id);
  //     if (node.children) node.children.forEach(collectIds);
  //   };

  //   const activeNode = findNode(filteredTree, activeNodeId);
  //   if (activeNode) collectIds(activeNode);
  //   return ids;

  // }, [activeNodeId, filteredTree])

///////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////
  const CustomNode = (nodeData) => {
    console.log('dataCustomNode ') 
    // Определяем, наведен ли курсор на текущий узел
    let isHovered = false;
      // const isHovered = hoveredNodeId === nodeDatum.id;
      const isLeaf = !nodeData.nodeDatum.children || nodeData.nodeDatum.children.length === 0;
      return (
        <>
         <g>
          <circle
            r={15}
            // onClick={()=>handleNodeClick(nodeData.nodeDatum)}
            onMouseEnter={(e)=>handleNodeMouseOver(nodeData.nodeDatum, e)}
            // onMouseEnter={(e)=>handleNodeMouseOver(nodeData.nodeDatum, e)}
            onMouseOut={handleNodeMouseOut}
            fill={isHovered ? 'red' : 'blue'}
           
          />
          <text fill="#000" stroke="none" x={20} dy={isLeaf?"0.3em":"-1.3em"} >
            {nodeData.nodeDatum.code||nodeData.nodeDatum.name}
          </text>
          
        </g>
        
        
        </>
       
      );
    };
///////////////////////////////////////////////////////////////////////////////////// 
    let addDraftKms=async (nameDraft, countHours, countHoursAvailable)=>{
      let csrftoken = getCookie('csrftoken')
      console.log('Добавляем черновик!!!')
      // let fetchUrl = document.querySelector('.kmps-react_d3_tree #root').dataset.add_draft_kmps_url;
      console.log('countHours')
      console.log(countHours)
      console.log('countHoursAvailable')
      console.log(countHoursAvailable)
      let fetchUrl = document.querySelector('#root').dataset.add_draft_kmps_url;
      let response =await fetch(fetchUrl, {
        method:'POST',
        headers: {
          'X-CSRFToken':csrftoken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({"nameDraft": nameDraft, 
                              "countHours":countHours, 
                              "countHoursAvailable":countHoursAvailable,
                              "parent_id": idActiveKmps,
                              "data": treeData})
      })
      console.log('=============================')
      
      let result= await response.json();
      result.add_status?setSuccessAddedDraftKmps(true):setSuccessAddedDraftKmps(false);
      {result.add_status && getListDraftKmps(treeData)}
    }
    



    function addChildNode(dataNodeChild){
      console.log('-------------------------------', dataNodeChild)
      let arrayPathToValue = getPathToValue(treeData, dataNodeChild.nodePk);
      arrayPathToValue[arrayPathToValue.length - 1] = "children";
      console.log(arrayPathToValue);

      if (!crypto.randomUUID) {
        crypto.randomUUID = function() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        };
      }

      let newTreeData = setValueByPath(treeData, arrayPathToValue, {
                    "id":crypto.randomUUID(),
                    "parentnode_id":dataNodeChild.nodePk,
                    "type":dataNodeChild.typeChildNode,
                    "code":dataNodeChild.codeChildNode,
                    "name":dataNodeChild.nameChildNode,
                    "value": 0,
                    "count_hours": dataNodeChild.typeChildNode=="Competency"?{"total_hours":0}:0,
                    "children": []
      })
      setVisibleNodeInfo(false);
      setTreeData(newTreeData);
      
    } 

    function delNode(node_pk){
      let arrayPathToValue = getPathToValue(treeData, node_pk);
      arrayPathToValue.pop();
      // console.log('path to node_pk:  ', arrayPathToValue);
      setVisibleNodeInfo(false);
      let countAddedAvailableHours = findNodeInObject(treeData, 'id', node_pk).count_hours;
      console.log('кол-во освободившихся часов', countAddedAvailableHours);
      updateCountHoursForAllParentNode(treeData, arrayPathToValue, countAddedAvailableHours);
      let newTreeData = removeNodeByPath(arrayPathToValue, treeData);
      setAvailableHours(availableHours + countAddedAvailableHours);
      setTreeData(newTreeData);



    }

    async function changeKmps(id_kmps){
      console.log('выбрали kmps', id_kmps);
      let fetchUrl = document.querySelector('#root').dataset.change_kmps_url;
      let responce = await fetch(`${fetchUrl}?kmps_pk=${id_kmps}`, {
        method: 'GET',
        credentials: 'include',
        }) 
    
      let result = await responce.json();
       
      if (result.status){
        setIsTable(false);
        setCountHours(result.data.count_hours);
        setAvailableHours(result.data.count_hours_available);
        setTreeData(JSON.parse(result.data.data));
      } else {
        setIsTable(false);
        getTreeData();
        setAvailableHours(0);
      }
    }

    async function addDisciplineNamesForCompetency(competency_id, selectedDisciplineNames){
      console.log('добавление дисциплине наме в компоненте самого высокого уровня ', competency_id, selectedDisciplineNames);
      let competency_node = findNodeInObject(treeData, 'id', competency_id);
      console.log('Компетенция изменяемая: ', competency_node);
      console.log(Array.isArray(selectedDisciplineNames));
      if (typeof(competency_node['count_hours']) !== 'object' ||  competency_node['count_hours'] === null){
         competency_node['count_hours'] = {};
       }
        
      selectedDisciplineNames.forEach(item=>{
        competency_node['count_hours'][item] = 0;
      
      }) 
      let newTreeData = JSON.parse(JSON.stringify(treeData));    
      setTreeData(newTreeData);
    }

//////////////////////////////////////////////////////////////////////////////////////////////
  return (
    

    <div className='tree__wrapper' style={{width: '100%', height: '100vh' }} ref={treeWrapper}>
      <div className={`kmps-info__wrapper`}>
        <KmpsInfo availableHours={availableHours}
                  isTable={isTable} 
                  countHours = {countHours}
                  listDraftKmps={listDraftKmps}
                  addDraftKms={(nameDraft, count_hours, count_hours_available, idActiveKmps)=>addDraftKms(nameDraft, count_hours, count_hours_available, idActiveKmps)}
                  successAddedDraftKmps={successAddedDraftKmps}
                  changeKmps={(id_kmps)=>changeKmps(id_kmps)}
                  toggleTableKmps={()=>setIsTable(!isTable)}
                  />
                  
      </div>
      
      <div className='tree'>
        
        
        
            <div className={`node-info__wrapper ${visibleNodeInfo ? 'node-info__wrapper_visible': ''}`} 
                  ref={nodeinfoWrapper}
                  onMouseLeave={handleNodeInfoMouseOut}
              >
          <NodeInfo hoveredNode={hoveredNode}  
                    closeNodeInfo={handleNodeInfoMouseOut} 
                    // availableHours={availableHours} 
                    addChildNode={(dataNodeChild)=>addChildNode(dataNodeChild)}
                    delNode={(node_pk)=>delNode(node_pk)}
                    doIncreaseAvailableHours = {(disciplineId, competencyId, newCountHours)=>increaseAvailableHours(disciplineId, competencyId, newCountHours)}
                    doDecreaseAvailableHours = {(disciplineId, competencyId, newCountHours)=>decreaseAvailableHours(disciplineId, competencyId, newCountHours)}
                    treeData={treeData}
                    addDisciplineNamesForCompetency={(competency_id, selectedDisciplineNames)=>addDisciplineNamesForCompetency(competency_id, selectedDisciplineNames)}                  
                    />
            </div>
      {isTable?(
        <KmpsTable 
            treeData={treeData.children}
            activeKmpsData={activeKmpsData}

            >
          
        </KmpsTable>


        ):(
        <Tree 
            data={filteredTree} 
            
            // initialDepth={3}
            nodeSize={{ x: 600, y: 60 }} // <- Расстояние между узлами (x - горизонтально, y - вертикально)     
            renderCustomNodeElement={(dataCustomNode)=>CustomNode(dataCustomNode)}
            onLinkMouseOver={handleLinkMouseOver}
            translate={translate} // Передаем рассчитанное смещение
            scaleExtent={{ max: 1, min:0.04 }}
            zoom={0.04} // Оптимальный масштаб
            />
      ) }    
      
</div>          
   
    </div>
  );
}
// ////////////////////////////////////////////////////////////////////////////////////////////////////////

