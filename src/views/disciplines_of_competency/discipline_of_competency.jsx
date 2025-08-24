import React, { useState, useEffect } from 'react';
import HoursCounter from '../../components/hours_counter/hours_counter';
import './discipline_of_competency.css';
import Modal from '../../components/modal/modal.jsx'
import {isUUID, findNodeInObject} from '../../components/functions.js'

function DisciplineOfCompetency({ treeData,
                                //   listDisciplineNames,
                                   
                                  competencyNode, 
                                  competency_pk, 
                                  doIncreaseAvailableHours, 
                                  doDecreaseAvailableHours,
                                  addDisciplineNamesForCompetency }){
    let [listDsciplines, setListDisciplines] = useState([]);
    // let [availableHours, setAvailableHours] = useState(JSON.parse(localStorage.getItem('kmps_availabel_hours')));
    let [availableHours, setAvailableHours] = useState();
    let [listDisciplineNames, setListDisciplineNames] = useState(JSON.parse(localStorage.getItem('kmps_list_disciplines_names')));
    let [listCustomDisciplines, setListCustomDisciplines] = useState([]);
    let [isOpenModalAddDiscipline, setIsOpenModalAddDiscipline] = useState(false);
    let [isOpenModalCreateDiscipline, setIsOpenModalCreateDiscipline] = useState(false);
    const [allDisciplines, setAllDisciplines] = useState([]);
    let [selectedDisciplineNames, setSelectedDisciplinesNames] = useState([])
    let [changeDisciplineAdded, setChangeDisciplineAdded] = useState(false)

    useEffect(()=>{
        // Слушатель изменения localStorage
        function handlerChangeListDsciplineNames(){
                let listDisciplineNamesLocalStorage = JSON.parse(localStorage.getItem('kmps_list_disciplines_names'));
                listDisciplineNames==listDisciplineNamesLocalStorage  ||  setListDisciplineNames(listDisciplineNamesLocalStorage)
            }
        window.addEventListener('storage', handlerChangeListDsciplineNames)
            
        // async function getDisciplinesOfCompetency(){
        //     let fetchUrl = document.querySelector('#root').dataset.list_disciplines_of_competency;
        //     let responce = await fetch(`${fetchUrl}?competency_pk=${competencyNode.id}`, {
        //         method:"GET",
        //         credentials: 'include',
        //     });
        //     let result = await responce.json();
        //     console.log('Ответ от дениса')
        //     console.log(result)

        //     let customListKeysOfNode = Object.keys(competencyNode.count_hours);
        //     console.log('массив ключей кастомной компетенции: ', customListKeysOfNode );
        //     let listCustomDisciplineId = customListKeysOfNode.filter(key =>(parseInt(key) && !isUUID(key)));
        //     console.log(listCustomDisciplineId);
        //     console.log(listDisciplineNames);
        //     let filteredListDisciplineNames = listDisciplineNames.filter(item=>listCustomDisciplineId.includes(item.pk))
        //     console.log('список названий дисциплин: ',filteredListDisciplineNames)
        //     let itogListDisciplines =[...result.data, ...filteredListDisciplineNames]
            
        //     // setListDisciplines(result.data);
        //     setListDisciplines(itogListDisciplines);
        // };
        
        // getDisciplinesOfCompetency();

        return () =>{
            window.removeEventListener('storage', handlerChangeListDsciplineNames);
        } 


    },[]);

    useEffect(()=>{
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                   
        async function getDisciplinesOfCompetency(){
            let competNode = findNodeInObject(treeData, 'id', competency_pk)
            let fetchUrl = document.querySelector('#root').dataset.list_disciplines_of_competency;
            let responce = await fetch(`${fetchUrl}?competency_pk=${competNode.id}`, {
                method:"GET",
                credentials: 'include',
            });
            let result = await responce.json();
            console.log('Ответ от дениса')
            console.log(result)
           
            // let customListKeysOfNode = Object.keys(competencyNode.count_hours);
            let customListKeysOfNode = Object.keys(competNode.count_hours);
            console.log('массив ключей кастомной компетенции: ', customListKeysOfNode );
            let listCustomDisciplineId = customListKeysOfNode.filter(key =>(parseInt(key) && !isUUID(key)));
            console.log(listCustomDisciplineId);
            console.log(listDisciplineNames);
            let filteredListDisciplineNames = listDisciplineNames.filter(item=>listCustomDisciplineId.includes(item.pk))
            console.log('список названий дисциплин: ',filteredListDisciplineNames)
            let itogListDisciplines =[...result.data, ...filteredListDisciplineNames]
            
            // setListDisciplines(result.data);
            setListDisciplines(itogListDisciplines);
        };
        
        getDisciplinesOfCompetency();

         


    }, [treeData])





     useEffect(()=>{
        let availabelHoursLocalStorage = localStorage.getItem('kmps_availabel_hours');
        // setAvailableHours(availabelHoursLocalStorage);
        availableHours==availabelHoursLocalStorage  ||  setAvailableHours(availabelHoursLocalStorage)
    })
    
    const handleChangeSelectedDisciplineName = (event) => {
        const { value, checked } = event.target;
        
        if (checked) {
        setSelectedDisciplinesNames([...selectedDisciplineNames, value]);
        } else {
        setSelectedDisciplinesNames(selectedDisciplineNames.filter(item => item !== value));
        }
    };


     let renderListDisciplineNames = listDisciplineNames.map((disciplineName)=>{
            return (
                <div key={disciplineName.pk}>
                    <label>
                        <input
                        type="checkbox"
                        value={disciplineName.pk}
                        checked={selectedDisciplineNames.includes(disciplineName.pk)}
                        onChange={handleChangeSelectedDisciplineName}
                        />
                        {disciplineName.name}
                    </label>
                </div>
            )
                
                
        });

    async function openModalAddDiscipline(){
        
       
        setIsOpenModalAddDiscipline(true);
        
            
    }
    
    async function createDiscipline(){
        console.log('создание(добавление в базу)')
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


    }

    function innerAddDisciplineNamesForCompetency(competency_id){
        console.log('добавляем дисципл наме: ', competency_id );
        
       
        addDisciplineNamesForCompetency(competency_id, selectedDisciplineNames);
        setChangeDisciplineAdded(!changeDisciplineAdded);
        setIsOpenModalAddDiscipline(false);
       
    }

    let listUsedDisciplines = listDsciplines.map((item)=>{
        let competNode = findNodeInObject(treeData, 'id', competency_pk)
        return <React.Fragment key={item.pk}>
        
        <div className='discipline-info'>
            <div className="discipline-info__name">{item.name}</div>
            <div className='discipline-info__count-hours-wrapper'>
                <HoursCounter discipline={item} 
                              doIncreaseAvailableHours={(disciplineId, competencyId, newCountHours)=>doIncreaseAvailableHours(disciplineId, competencyId, newCountHours)} 
                              doDecreaseAvailableHours={(disciplineId, competencyId, newCountHours)=>doDecreaseAvailableHours(disciplineId, competencyId, newCountHours)}
                              competencyNode = {competNode}
                              treeData={treeData}> 
                </HoursCounter>
                
            </div>
        </div>
        
        </React.Fragment>
        
    })

    return <>
    
    <div className='list-discipline-info__wrapper'>
        
        {listUsedDisciplines}
        
        <button className='list-discipline-info__btn-add-discipline' onClick={()=>openModalAddDiscipline(competency_pk)}>Закреплённые дисциплины</button>
    </div>
    
    <Modal 
            isOpen={isOpenModalAddDiscipline} 
            onClose={() =>setIsOpenModalAddDiscipline(false)} 
            level={0}
                       
            >
    
            <header>Список дисциплин</header>
               
              {renderListDisciplineNames}   
            
                                                                        
            {/* <button onClick={()=>setIsOpenModalCreateDiscipline(true)}>Создать новую дисциплину</button>  */}
            <button className='list-discipline-info__btn-add-discipline' onClick={()=>innerAddDisciplineNamesForCompetency(competency_pk)}>Закрепить выбранные</button>
    </Modal>
    
    <Modal
                isOpen={isOpenModalCreateDiscipline} 
                onClose={() =>setIsOpenModalCreateDiscipline(false)}
                level={1}
                >
                    <h2>Добавление новой дисциплины</h2>
                {/* <input type='text' placeholder='Код дисциплины'/> */}
                <input type='text' placeholder='Наименование дисциплины'/>
                <button onClick={createDiscipline}>Добавить дисциплину</button>        
    </Modal>
    
    </>
}

export default DisciplineOfCompetency;