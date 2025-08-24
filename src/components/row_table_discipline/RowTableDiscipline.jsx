import {useEffect, useState}  from 'react';
import './RowTableDiscipline.css';
import {isUUID, findNodesInObject, getListCompetencyByDisciplineName} from '../functions';

function RowTableDiscipline({disciplineName, listCompetency}){

let renderedListCompetency = listCompetency.map(competency=>{

    return (
       <div className='competency__wrapper'>
            <div className='competency__name'>
                {competency.name}        
            </div>
            <div className='competency__sub-title'>
                <span>было</span>
                <span>стало</span>
            </div>
            <div className='competency__hours-info'>
                <span>{competency.active_hours}</span>
                <span>{competency.custom_hours}</span>
            </div>

       </div>
    )

    }
)

 return (
    <tr>
        <td className='row-table-discipline__name'>{disciplineName}</td>
        <td>
            <div className='list-competency__wrapper'>
                {renderedListCompetency}
            </div>
        </td>
    </tr>
 )

    
 
}

export default RowTableDiscipline;