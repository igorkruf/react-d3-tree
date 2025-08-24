import React,{useEffect, useState}  from 'react';
import './KmpsTable.css';
import {isUUID } from '../functions';
import KmpsTableDiscipline from '../kmps_table_discipline/KmpsTableDiscipline.jsx'







function KmpsTable({treeData, activeKmpsData}){
  console.log('##################  kmps_table treeData #################################  ');
  console.log(treeData);
  let [listDisciplineNames, setListDisciplineNames] = useState(JSON.parse(localStorage.getItem('kmps_list_disciplines_names')));
  let [kmpsCountHours, setKmpsCountHours] = useState(Number(localStorage.getItem('kmps_count_hours')))
  let [listDisciplines, setListDisciplines] = useState(JSON.parse(localStorage.getItem('kmps_list_disciplines')))
  let [isCompetencyTable, setIsCompetencyTable] = useState(true);
  
  useEffect(()=>{
    // Слушатель изменения localStorage
        function handlerChangeListDsciplineNames(){
                let listDisciplineNamesLocalStorage = JSON.parse(localStorage.getItem('kmps_list_disciplines_names'));
                listDisciplineNames==listDisciplineNamesLocalStorage  ||  setListDisciplineNames(listDisciplineNamesLocalStorage)
            }
        
        window.addEventListener('storage', handlerChangeListDsciplineNames)

        return () =>{
            window.removeEventListener('storage', handlerChangeListDsciplineNames);
        } 
    },[])

    // function findObjectById(obj, targetId) {
    //   // Проверка на null/undefined и что это объект
    //   if (!obj || typeof obj !== 'object') return undefined;

    //   // Если у текущего объекта есть нужный id - возвращаем его
    //   if (obj.id === targetId) return obj;

    //   // Перебираем все свойства объекта
    //   for (const key in obj) {
    //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
    //       const value = obj[key];

    //       // Если значение - массив
    //       if (Array.isArray(value)) {
    //         for (const item of value) {
    //           if (item && typeof item === 'object') {
    //             const found = findObjectById(item, targetId);
    //             if (found) return found;
    //           }
    //         }
    //       }
    //       // Если значение - объект (но не массив)
    //       else if (value && typeof value === 'object') {
    //         const found = findObjectById(value, targetId);
    //         if (found) return found;
    //       }
    //     }
    //   }

    //   return undefined; // Если ничего не нашли
    // }



// Выводим информацию по дисциплинам



function getDisciplinesInfo(competency_count_hours, active_competence_count_hours){
 
  let listAllDisc = [...listDisciplineNames, ...listDisciplines]

  let listDisciplineInfo = [];

  let finalListKeyCountHours =[];
  let listKeysDisciplines =[];
  let listKeysCountHours = Object.keys(competency_count_hours);
  listKeysCountHours.forEach(key=>{
    if (parseInt(key) || isUUID(key)){
    listKeysDisciplines.push(key)
  }
  })
  const sortedListKeysDisciplines = listKeysDisciplines.sort((a, b) => b.length - a.length);
  sortedListKeysDisciplines.forEach(key=>{
    finalListKeyCountHours.push(key)
  //   finalListKeyCountHours.push([key, competency_count_hours[key]])
   })
    
  finalListKeyCountHours.forEach(keyCountHours=>{
    let itemDisciplineInfo = {}
    let disciplineName=listAllDisc.find(disc => disc.pk==keyCountHours);
    itemDisciplineInfo['name']=disciplineName.name;
    let activeCountHours = active_competence_count_hours[keyCountHours]?active_competence_count_hours[keyCountHours]:0;
    itemDisciplineInfo['activeCountHours']=activeCountHours; 
    let customCountHours = competency_count_hours[keyCountHours]?competency_count_hours[keyCountHours]:0;
    itemDisciplineInfo['customCountHours']= customCountHours
    listDisciplineInfo.push(itemDisciplineInfo)
  })
  console.log('listDisciplineInfo')
  console.log(listDisciplineInfo)
  let renderedListDisciplineInfo = listDisciplineInfo.map(disc=>{
    return (
    <div key={disc.pk} className='kmps-discipline-info'>
      <div className='kmps-discipline-info__name'>{disc.name}</div>
      <div className='kmps-discipline-info__sub-title'><span>было</span><span>стало</span></div>
      <div className='kmps-discipline-info__sub-info'><span>{disc.activeCountHours}</span><span>{disc.customCountHours}</span></div>
    </div>
  ) 
     
    
  })

  return <>
    <div className='kmps-disciplines-info__wrapper'>
       {renderedListDisciplineInfo}
    </div>
   
     
  </>
}

// function getValue(kmpsData, node_id){
//   console.log('kmpsData')
//   console.log(kmpsData)
//   let node = findObjectById(kmpsData, node_id)
  
//   return node.value;
// }

// function getCountHours(kmpsData, node_id){
//   let node = findObjectById(activeKmpsData, node_id );
//   let countHours = node['count_hours'] && typeof node['count_hours'] === 'object'
//                  ? node.count_hours.total_hours
//                  : node.count_hours || '-';
//   return countHours; 
  
// }

    const renderRows = (items, active_items, level = 0) => {
      console.log('active_items внутри');
      console.log(active_items)
        return items?.map((item, index) => {
          let secondItem = active_items?.[index];
          if (!secondItem){
            secondItem={
              id:1,
              value:0,
              count_hours:0,
            }
          }
          return (item['type'] != "Indicator") && ( 
           <React.Fragment key={item.id || item.code}>
          <tr className='row' key={item.id || item.code}>
          <td style={{ paddingLeft: `${level * 20}px` }}>
            <strong>{(item['type'] != "Module")?item.code:`ЗД-${item.code}`}</strong>
          </td>
          <td style={{ paddingLeft: `${level * 20}px` }}>
            {item.name}
          </td>
          <td>
           {((secondItem.count_hours && typeof secondItem.count_hours === 'object'
              ? secondItem.count_hours.total_hours
              : secondItem.count_hours || 0)/kmpsCountHours).toFixed(4)}
          </td>
         
          <td>
            {secondItem.count_hours && typeof secondItem.count_hours === 'object'
              ? secondItem.count_hours.total_hours
              : secondItem.count_hours || 0}</td>
          
          <td>
             {((item.count_hours && typeof item.count_hours === 'object'
              ? item.count_hours.total_hours
              : item.count_hours || 0)/kmpsCountHours).toFixed(4)}
          </td>
          
          <td>
            {item.count_hours && typeof item.count_hours === 'object'
              ? item.count_hours.total_hours
              : item.count_hours || 0}
          </td>
          <td >{(item['type'] === "Competency")?getDisciplinesInfo(item.count_hours, secondItem.count_hours):' - '}</td>
        </tr>
        {item.children && item.children.length > 0 && renderRows(item.children, secondItem?.children, level + 1)
        }
    </React.Fragment>)
        })
      };
        
  return (<>
    <div className='kmps-table__menu'>
      <div className={`kmps-table__menu-item ${isCompetencyTable?'kmps-table__menu-item_active':'' }` }  onClick={()=>setIsCompetencyTable(true)}>По компетенциям</div>
      <div className={`kmps-table__menu-item ${!isCompetencyTable?'kmps-table__menu-item_active':'' }`} onClick={()=>setIsCompetencyTable(false)}>По дисциплинам</div>
    </div>
    {isCompetencyTable? (
     <table className="competency-table">
      <thead>
        <tr>
          <th>Код</th>
          <th>Наименование</th>
          <th>Вес (было)</th>
          <th>Часы (было)</th>
          <th>Вес (стало)</th>
          <th>Часы (стало)</th>
          <th>Дисциплины</th>
        </tr>
      </thead>
      <tbody>
        {renderRows(treeData, activeKmpsData.children)}
      </tbody>
    </table> ):(<>
      <KmpsTableDiscipline 
        treeData={treeData}
        activeKmpsData={activeKmpsData}
      ></KmpsTableDiscipline>
      </>)}
    
    
  </>  
  );  

}

export default KmpsTable;