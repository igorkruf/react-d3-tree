import React,{useEffect, useState}  from 'react';
import './KmpsTableDiscipline.css';
import {isUUID, findNodesInObject, getListCompetencyByDisciplineName} from '../functions';
import RowTableDiscipline from '../row_table_discipline/RowTableDiscipline';

function KmpsTableDiscipline({treeData, activeKmpsData}){
    
    let [listDisciplineNames, setListDisciplineNames] = useState(JSON.parse(localStorage.getItem('kmps_list_disciplines_names')));
    let [listDisciplines, setListDisciplines] = useState(JSON.parse(localStorage.getItem('kmps_list_disciplines')));
    // let [listCompetencyNodes, setListCompetencyNodes] = useState([]);
    let [customData, setCustomData] = useState({});
    let [renderedData, setRenderedData] = useState();

    useEffect(()=>{
        console.log('#########################  listDisciplineNames   ###########################');
        console.log(treeData)


        let activeListCompNodes =  findNodesInObject(activeKmpsData, 'type', "Competency");
       
        // console.log('список компетенций: activeKmpsData');
        // console.log(activeKmpsData);
        let data = {}
        let listCompNodes=[];
        treeData.forEach(item=>{
           let listCompetencyNodesForItem = findNodesInObject(item, 'type', "Competency");
           listCompNodes.push(...listCompetencyNodesForItem);
        })
       
        console.log('listCompetencyNodesForItem ++++++ ');
        console.log(listCompNodes)

        listDisciplineNames.forEach(disciplineName =>{
            let listCompetencyByDisciplineName = getListCompetencyByDisciplineName(listCompNodes, disciplineName, listDisciplines, activeListCompNodes);
            console.log('listCompetencyByDisciplineName: ', listCompetencyByDisciplineName)
            if (listCompetencyByDisciplineName.length>0){
                 data[disciplineName.name] = listCompetencyByDisciplineName;
            }
        })
        console.log('data');
        console.log(data);
        setCustomData(data);
        

        // let listActiveCompNodes = findNodesInObject(activeKmpsData, 'type', "Competency");
        // console.log('listActiveCompNodes');
        // console.log(listActiveCompNodes);




    },[treeData])

    useEffect(()=>{
        console.log('##########################################################################################')
        console.log('Перерендеринг!!!! customData')
        console.log('##########################################################################################')
        let renderedData = Object.entries(customData).map(([discipline, value],index) => {
            return (
                 <RowTableDiscipline key={index} disciplineName={discipline} listCompetency={value}>

                 </RowTableDiscipline>

            )
           
            
           
            
        
            })
        setRenderedData(renderedData);    
    },[customData] )
    
    
    return <>
    
    <table  className="discipline-table">
        <thead>
        <tr>
          <th>Дисциплины</th>
          <th>Компетенции</th>
         
        </tr>
      </thead>
      <tbody>
        {renderedData}
      </tbody>  
    </table>
    </>
}

export default KmpsTableDiscipline;
