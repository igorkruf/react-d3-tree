import { useEffect, useMemo, useState, useRef } from 'react';
import './NodeInfo.css';
import useLocalStorage from '../../hooks/useLocalStorage';
import { getTypeChildNode, getTypeNode, getTypeTypeChildNode, getPathToValue, updateCountHoursForAllParentNode } from '../functions';
import Modal from '../modal/modal.jsx';
import DisciplineOfCompetency from '../../views/disciplines_of_competency/discipline_of_competency.jsx';



function NodeInfo({hoveredNode, 
                   closeNodeInfo, 
                   addChildNode, 
                   delNode,
                   doIncreaseAvailableHours,
                   doDecreaseAvailableHours,
                   treeData,
                   addDisciplineNamesForCompetency 
                 }){

    console.log('hoveredNode')
    console.log(hoveredNode)
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);
    let [nameChildNode, setNameChildNode] = useState('');
    let [codeChildNode, setCodeChildNode] = useState('');
    let [countHoursDetailIsOpen, setCountHoursDetailIsOpen] = useState(false);
    let [countHours, setCountHours] = useState(0);
    let [listDisciplineNames, setListDisciplineNames] = useState([JSON.parse(localStorage.getItem('kmps_list_disciplines_names'))]);
    
    let refNameChildNode = useRef();
    let refCodeChildNode = useRef();
    let refNodePk = useRef(); 
    let refTypeChildNode = useRef();
    let refNodeInfo = useRef();
    let refCountHoursDetail = useRef();
                
    
    let [availableHours, setAvailableHours] = useState(localStorage.getItem('kmps_availabel_hours'));
    
    useEffect(()=>{
        let availabelHoursLocalStorage = localStorage.getItem('kmps_availabel_hours');
        // setAvailableHours(availabelHoursLocalStorage);
        availableHours==availabelHoursLocalStorage  ||  setAvailableHours(availabelHoursLocalStorage)
    })
   

    
    useEffect(()=>{
        if (hoveredNode && refNodeInfo.current && refCountHoursDetail.current) {
            let rect = refNodeInfo.current.getBoundingClientRect();
            refCountHoursDetail.current.style.height = `${rect.height}px`;
            refCountHoursDetail.current.style.overflowY = 'auto'
            
        }
        
    })  
    useEffect(()=>{
       if (hoveredNode) { 
       setCountHours((hoveredNode.type=="Competency")?hoveredNode.count_hours.total_hours:hoveredNode.count_hours);
       }
    //    async function getListDisciplineNames(){
    //    let fetchUrl = document.querySelector('#root').dataset.list_disciplines_all;
    //    let response = await fetch(`${fetchUrl}`, {
    //         method: 'GET',
    //         credentials: 'include',
    //         });
    //    let result = await response.json();
    //    console.log('дисциплины: ', result.data);
       
        
        
    //     setListDisciplineNames(result.data); 
    //    }
    //    getListDisciplineNames();
    }, [hoveredNode])
   

   
                  

    if (hoveredNode) {
    
         

    let {id, code, name, value, count_hours, type} = hoveredNode;
    
     
    
    function openModalAddChildNode(){
        setIsModalOpen(true);
    }    

    function openModalConfirmation(){
        setIsModalConfirmationOpen(true);
    }

    function addChildNode1(dataNodeChild){
        setCodeChildNode('');
        setNameChildNode('');
        setIsModalOpen(false);

        addChildNode(dataNodeChild)
    }

    function deleteNode(node_pk){
        delNode(node_pk);
        setIsModalConfirmationOpen(false);

    }

    function openCountHoursDetail(){
        
        setCountHoursDetailIsOpen(!countHoursDetailIsOpen)
     
    }

    function doInnerIncreaseAvailableHours(disciplineId, competencyId, newCountHours){
        setCountHours(countHours-1);
        let competencyNodePath = getPathToValue(treeData, competencyId);
        competencyNodePath.pop();
        updateCountHoursForAllParentNode(treeData, competencyNodePath, 1);
        doIncreaseAvailableHours(disciplineId, competencyId, newCountHours);
    }

    function doInnerDecreaseAvailableHours(disciplineId, competencyId, newCountHours){
        setCountHours(countHours+1);
        let competencyNodePath = getPathToValue(treeData, competencyId);
        competencyNodePath.pop();
        updateCountHoursForAllParentNode(treeData, competencyNodePath, -1);
        doDecreaseAvailableHours(disciplineId, competencyId, newCountHours);
    }

   
    
return <>

 <div onClick={closeNodeInfo}>Закрыть</div>   

 <div className='node-info' onMouseLeave={()=>setCountHoursDetailIsOpen(false)} ref={refNodeInfo}>
    <div className='node-info__tr'>
        <div className='node-info__td node-info__td-first'>{code}:</div><div className='node-info__td '>{name}</div>
    </div>
     
    <div className='node-info__tr'>
        {/* <div className='node-info__td node-info__td-first'>Весовой коэф:</div><div className='node-info__td'>{value}</div> */}
        <div className='node-info__td node-info__td-first'>Весовой коэф:</div><div className='node-info__td'>{(countHours/6000).toFixed(4)}</div>
    </div>
    
    <div className='node-info__tr'>
        <div className='node-info__td node-info__td-first'>Кол-во часов:</div><div className='node-info__td'>{countHours}</div>
    </div>
    {(type=="Competency") &&(
        <div className='node-info__tr'>
        <div className='node-info__td node-info__td-first'>Дисциплины:</div>
        <div className='node-info__td count-hours'>
            <span className='count-hours__btn-open-detail' onClick={openCountHoursDetail}>{`${countHoursDetailIsOpen?'Скрыть':'Показать'}`}</span> 
            
        </div>
    </div>
    )}
<div className="node-info__section-of-btn_incolumn">
            {(type!="Indicator") && (
              <button className='section-of-btn__item' onClick={()=>openModalAddChildNode()}>Добавить {getTypeChildNode(type)} </button>  
            )} 
            <button className='section-of-btn__item' onClick={()=>openModalConfirmation()}>Удалить  {getTypeNode(type)} </button>
        </div>

    
{countHoursDetailIsOpen && 
            (<div className={`count-hours__detail 
                         ${countHoursDetailIsOpen?'count-hours__detail_visible':''}`
                        }
                onMouseLeave={()=>setCountHoursDetailIsOpen(false)}
                                        
                        ref={refCountHoursDetail} >
                <DisciplineOfCompetency 
                    // listDisciplineNames={listDisciplineNames}
                    treeData={treeData} 
                    competencyNode = {hoveredNode} 
                    competency_pk={id} 
                    doIncreaseAvailableHours={(disciplineId, competencyId, newCountHours)=>doInnerIncreaseAvailableHours(disciplineId, competencyId, newCountHours)} 
                    doDecreaseAvailableHours={(disciplineId, competencyId, newCountHours)=>doInnerDecreaseAvailableHours(disciplineId, competencyId, newCountHours)}
                    addDisciplineNamesForCompetency={(competency_id, selectedDisciplineNames)=>addDisciplineNamesForCompetency(competency_id, selectedDisciplineNames)} >   
                </DisciplineOfCompetency>
            </div>)}    
   
    
    <div>{availableHours}</div>
{/* <div>Доступно часов: {availableHours}</div> */}
</div>
{/* ////////////////////////////////////////////////////////////////////////// */}



{/* ///////////////////////////////////////////////////////////////////////// */}




    <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        level={0}
        >
        <header>Добавление дочернего узла({getTypeChildNode(type)})</header>
        <div className='form flex_incolumn'>
            <input  type="hidden" 
               value={type} ref={refTypeChildNode}/>
            <input type="text" 
               className='form-field'
               value={codeChildNode} 
               placeholder='Код' 
               onChange={()=>setCodeChildNode(refCodeChildNode.current.value) } ref={refCodeChildNode}/>
            <input type="text"
               className='form-field' 
               value={nameChildNode} 
               placeholder='Название' 
               onChange={()=>setNameChildNode(refNameChildNode.current.value)} 
               ref = {refNameChildNode}/>
            {/* pk родительского узла */}
            <input type='hidden' value={id} ref={refNodePk}/>
            
            <button onClick={()=>addChildNode1(
                // id
                 {
                    nameChildNode:refNameChildNode.current.value,
                    codeChildNode:refCodeChildNode.current.value,
                    nodePk:refNodePk.current.value,
                    typeChildNode:refTypeChildNode.current.value?getTypeTypeChildNode(refTypeChildNode.current.value):"ActivityType"
                }
            )}>Добавить {getTypeChildNode(type)}</button>
            {/* <button onClick={()=>addChildNode(id)}>Добавить {getTypeChildNode(type)}</button> */}
        </div>
        
        {/* <button onClick={()=>setIsSubModalOpen(true)}>
            открыть субмодальное окно
        </button> */}
    </Modal>
   
    <Modal 
        isOpen={isModalConfirmationOpen} 
        onClose={() => setIsModalConfirmationOpen(false)}
        level={1000}
          
        >
        <header>Уверены?</header>
        
        <div className='section-of-btn_inline'>
            <button className='section-of-btn__item' onClick={()=>deleteNode(id)}>Да</button>
            <button className='section-of-btn__item' onClick={()=>setIsModalConfirmationOpen(false)}>Нет</button>
        </div>
        

        {/* <button onClick={()=>setIsSubModalOpen(true)}>
            открыть субмодальное окно
        </button> */}
    </Modal>        
   
   

    

</>
    }
}
export default NodeInfo;