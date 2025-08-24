import { useState, useEffect, useRef } from 'react';
import './hours_counter.css';
import {getPathToValue} from '../functions.js'

function HoursCounter({discipline, doIncreaseAvailableHours, doDecreaseAvailableHours, competencyNode}){
    // let [countHours, setCountHours] = useState(discipline.hours_count);
    let [countHours, setCountHours] = useState(competencyNode.count_hours[discipline['pk']])
    let [availableHours, setAvailableHours] = useState();
    
    useEffect(()=>{
        
        const updateAvailableHours = () => {
            const availabelHoursLocalStorage = JSON.parse(localStorage.getItem('kmps_availabel_hours')) || 0;
            setAvailableHours(availabelHoursLocalStorage);
            };
        updateAvailableHours();
        window.addEventListener('storage', updateAvailableHours);
        return () => {
            window.removeEventListener('storage', updateAvailableHours);
        };

    }, [])

    // useEffect(()=>{
    //     // let pathToCompetencyNode = getPathToValue(treeData, competencyNode.id);
    //     // pathToCompetencyNode.pop();
    //     // изменяем кол-во часов в treeData(это ссылачная переменная которая инициализируется в корневом компоненте app.js)
    //     // setCountHoursByPathForDisciplineInCompetency(treeData, pathToCompetencyNode, countHours)
    //     console.log('competencyNode');
    //     console.log(competencyNode);
    //     competencyNode.count_hours[discipline.pk] = countHours;
    //      console.log(competencyNode);
    // }, [countHours])
    
    function increaseHours(disciplineId, competencyId, newCountHours){
        setCountHours(countHours+1);
        doDecreaseAvailableHours(disciplineId, competencyId, newCountHours);
    }

    function decreaseHours(disciplineId, competencyId, newCountHours){
        setCountHours(countHours-1);
        doIncreaseAvailableHours(disciplineId, competencyId, newCountHours);
    }

    

    return <>
    <div className='hours-counter'>
        <div className='hours-counter__tr hours-counter__tr-title'>
            <div className='hours-counter__td '>Действующее</div>
            <div className='hours-counter__td'>Измененное</div>
        </div>
        <div className='hours-counter__tr'>
            <div className='hours-counter__td'>{discipline.hours_count?discipline.hours_count:0}</div>
            <div className='hours-counter__td'>
                <div className='btn decrease-hours' onClick={()=>decreaseHours(discipline.pk, competencyNode.id, (countHours-1))}>-</div>
                <div className='discipline-info__count-hours'>{countHours}</div>
                <div className='btn increase-hours' onClick={()=>increaseHours(discipline.pk, competencyNode.id, (countHours+1))}>+</div>
                
            </div>
        </div>
    </div>
    <div>{availableHours}</div>

    
    </>
} 

export default HoursCounter;