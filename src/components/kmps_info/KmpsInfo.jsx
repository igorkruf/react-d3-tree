import { useEffect, useMemo, useState, useRef } from 'react';
import './KmpsInfo.css';
import Modal from '../modal/modal.jsx'

function KmpsInfo({availableHours, 
                   listDraftKmps, 
                   addDraftKms,
                   delDraftKmps,
                   saveDraftKmps, 
                   countHours, 
                   successAddedDraftKmps,
                   successDelDraftKmps,
                   successSaveDraftKmps, 
                   changeKmps,
                   toggleTableKmps,
                   isTable}) {
    let [innerSuccessAddedDraftKmps, setInnerSuccessAddedDraftKmps ] = useState(false)
    let [InnerSuccessDelDraftKmps, setInnerSuccessDelDraftKmps ] = useState(false)
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [isSubModalOpen, setIsSubModalOpen] = useState(false);
    let [nameDraft, setNameDraft] = useState('');
    let [enabledAddDraftBtn, setEnabledAddDraftBtn] = useState(false);
    let [doAddDraftKmps, setDoAddDraftKmps] = useState(false);
    let [isDraftKmps, setIsDraftKmps] = useState(false);
    let [isConfirmDeleteDraftKmpsModalOpen, setIsConfirmDeleteDraftKmpsModalOpen] = useState(false);

    let refNameDraft = useRef();
    let refSelectKmps = useRef();
    let refCountHours = useRef();
    let refCountHoursAvailable = useRef();
    let isFirstRender = useRef(true);
    let messageBlock = useRef()

    
    
    
    useEffect(()=>{
        console.log('listDraftKmps')
        console.log(listDraftKmps)
        console.log(refSelectKmps.current?.value)
        // Читаем из localStorage значение ключа id_active_kmps (кнопки сохранить изменения )
        let idActiveKmps = JSON.parse(localStorage.getItem('id_active_kmps'));
        refSelectKmps.current.value===idActiveKmps? setIsDraftKmps(false):setIsDraftKmps(true);
    })

    useEffect(()=>{
             setInnerSuccessAddedDraftKmps(successAddedDraftKmps);
    }, [successAddedDraftKmps])

    useEffect(()=>{
             setInnerSuccessDelDraftKmps(successDelDraftKmps);
    }, [successDelDraftKmps])

    useEffect(()=>{
        geClasstStatusBtn()
        
    },[successSaveDraftKmps])
    
    useEffect(()=>{
       isFirstRender.current= !isModalOpen;
       
       

    }, [isModalOpen])

    function changeNameDraft(name){
        setNameDraft(name);
        setDoAddDraftKmps(false);
        setEnabledAddDraftBtn(name.length > 3);
      
    } 
    
    function innerAddDraftKmps(nameDraft, countHours, refCountHoursAvailable, idActiveKmps){
        setDoAddDraftKmps(true);
        addDraftKms(nameDraft, countHours, refCountHoursAvailable, idActiveKmps);   
    }
    
    function closeModal(){
        setDoAddDraftKmps(false);
        setIsModalOpen(false);
        setNameDraft(''); // Сбрасываем имя при закрытии
        setEnabledAddDraftBtn(false); // Также сбрасываем состояние кнопки

    }

    function innerChangeKmps(e){
        changeKmps(e.target.value)
    }

    function innerDelDraftKmps(draft_kmps_pk){
        console.log('Удаляем черновик')
        setIsConfirmDeleteDraftKmpsModalOpen(false);
        delDraftKmps(draft_kmps_pk)

    }

    function innerSaveDraftKmps(draft_kmps_pk){
        console.log('сохраняем изменения в черновике')
        saveDraftKmps(draft_kmps_pk)
    }

    function geClasstStatusBtn(){
        console.log('получаем класс')
         if (!(successSaveDraftKmps == null)){
            return successSaveDraftKmps?'btn__status_success':'btn__status_error'
            }
        return ''
        }
       

    return <>
        <div>
            <select 
                className='list-draft-kmps__select' 
                ref={refSelectKmps}
                onChange={innerChangeKmps}
            >
                
                {listDraftKmps.map((item)=>
                    <option key={item.pk} value={item.pk}>{item.name}</option>
                )}

            </select>
        <p>КМС инфо</p> 
        <div>Общее колличество часов: {countHours}</div>
        <div>Доступно часов: {availableHours}</div>
        </div>
        <div className="kmps-info__section-of-btn_incolumn">
            {isDraftKmps && (
                <>
                <button className='section-of-btn__item' onClick={toggleTableKmps}>{isTable?'Граф':'Таблица'}</button>
                <button className='section-of-btn__item' onClick={()=>setIsConfirmDeleteDraftKmpsModalOpen(true)}>Удалить черновик</button>
                <button className={`section-of-btn__item ${geClasstStatusBtn()}`} onClick={()=>innerSaveDraftKmps(refSelectKmps.current.value)}>Сохранить изменения в черновике</button>
                </>
                )
            }
            
            <button className='section-of-btn__item' onClick={()=>setIsModalOpen(true)}>Добавить черновик</button>
        </div>
    <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        level={0}
        
        
        >

        <header>Добавление черновика КМС</header>
        <div>
            <input type="text" onChange={(e)=>changeNameDraft(e.target.value)} value={nameDraft} ref={refNameDraft} placeholder='Введи название черновика' />
            <input type="hidden"  ref= {refCountHours} value={countHours}/>
            <input type='hidden' ref={refCountHoursAvailable} value={availableHours}/>
            <button className={ `btn ${!enabledAddDraftBtn?'btn_disabled': ''}`} 
                                onClick={()=>innerAddDraftKmps(
                                                        refNameDraft.current.value,
                                                        refCountHours.current.value,
                                                        refCountHoursAvailable.current.value,
                                                        
                                                        )} 
                                disabled={!enabledAddDraftBtn}>Добавить</button>
        </div>

         {!isFirstRender.current && doAddDraftKmps && ( 
            <div ref={messageBlock}>
                 {innerSuccessAddedDraftKmps?"черновик успешно добавлен":"Ошибка при добавлении черновика"}
            </div>
           
           )}   
             
        
                                                                    
        {/* <button onClick={()=>setIsSubModalOpen(true)}>
            открыть субмодальное окно
        </button> */}
    </Modal>

    <Modal isOpen={isConfirmDeleteDraftKmpsModalOpen} 
           onClose={() =>setIsConfirmDeleteDraftKmpsModalOpen(false)}
           level={0}>
                <div className='modal-content__title'>Удаляете черновик "{listDraftKmps.find(draft => draft.pk == refSelectKmps.current?.value)?.name}"? </div>
                <div className="kmps-info__section-of-btn kmps-info__section-of-btn_inline">
                    <button className='section-of-btn__item btn__status_error' onClick={()=>innerDelDraftKmps(refSelectKmps.current.value)}>Да</button>
                    <button className='section-of-btn__item' onClick={()=>setIsConfirmDeleteDraftKmpsModalOpen(false)}>Отмена</button>
                </div>         
                         
                
    </Modal>       

    <Modal
                isOpen={isSubModalOpen} 
                onClose={() =>setIsSubModalOpen(false)}
                level={1}
                >
                <h2>Заголовок sub модалки</h2>
                <p>Содержимое sub модального окна</p>    
    </Modal>
    </>
    }

export default KmpsInfo;