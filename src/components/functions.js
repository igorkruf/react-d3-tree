export function getCookie(name) {
    const regex = new RegExp(`(?:(?:^|;\\s*)${name}=([^;]*))`);
    const match = document.cookie.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
  }

export function getParrentModalBasis(){
  let nodeListModalBasis =document.querySelectorAll('.modal-overlay');
  let elemBody =document.querySelector('body');
  let parentModalBasis = nodeListModalBasis[nodeListModalBasis.length - 1] ? nodeListModalBasis[nodeListModalBasis.length - 1] : elemBody;
  return parentModalBasis
}

export function getFormData(obj){
    const formData = new FormData();
    Object.keys(obj).forEach(key => formData.append(key, obj[key]));
    return formData;
}


export function checkFilesExtension(file){
    return /\.(jpe?g|png|bmp|tif|svg|mp4|mkv|wav|mp3|glb|docx?|xlsx?|pptx?|pdf|rtf|odt|odp|biblio|srb)$/.test(file.name);
}

export function getTypeChildNode(typeNode='Programm'){
  let typeChildNode;
  switch (typeNode){
    case 'Programm':
      typeChildNode='вид деятельности';
    break; 
    
    case 'ActivityType':
      typeChildNode='задачу деятельности';
    break; 
    
    case 'Module':
      typeChildNode='компетенцию';
    break;
    
    case 'Competency':
      typeChildNode='индикатор';
    break;   

    case 'Indicator':
      typeChildNode='занятие';
    break;  

  }
  return typeChildNode;
}

export function getTypeNode(typeNode='Programm'){
  let nameTypeNode;
  switch (typeNode){
    case 'Programm':
      nameTypeNode='программа';
    break; 
    
    case 'ActivityType':
      nameTypeNode='вид деятельности';
    break; 
    
    case 'Module':
      nameTypeNode='задача деятельности';
    break;
    
    case 'Competency':
      nameTypeNode='компетенция';
    break;   

    case 'Indicator':
      nameTypeNode='индикатор';
    break;
    
    

  }
  return nameTypeNode;
}

export function getTypeTypeChildNode(typeNode){
  let typeChildNode;
  switch (typeNode){
    case 'Programm':
      typeChildNode='ActivityType';
    break; 
    
    case 'ActivityType':
      typeChildNode='Module';
    break; 
    
    case 'Module':
      typeChildNode='Competency';
    break;
    
    case 'Competency':
      typeChildNode='Indicator';
    break;   

    case 'Indicator':
      typeChildNode='Lesson';
    break;  

  }
  return typeChildNode;
}
// export function getKeyPath(obj, targetKey, currentPath = '') {
//     if (obj && typeof obj === 'object') {
//         if (obj.hasOwnProperty(targetKey)) {
//             return currentPath ? `${currentPath}.${targetKey}` : targetKey;
//         }
        
//         for (const key in obj) {
//             if (obj.hasOwnProperty(key)) {
//                 const path = findKeyPath(
//                     obj[key], 
//                     targetKey, 
//                     currentPath ? `${currentPath}.${key}` : key
//                 );
//                 if (path) return path;
//             }
//         }
//     } else if (Array.isArray(obj)) {
//         for (let i = 0; i < obj.length; i++) {
//             const path = findKeyPath(
//                 obj[i], 
//                 targetKey, 
//                 `${currentPath}[${i}]`
//             );
//             if (path) return path;
//         }
//     }
    
//     return null;
// }
export function getPathToValue(obj, targetValue, currentPath = []) {
  if (typeof obj === 'object' && obj !== null) {
    // Обрабатываем массивы и объекты
    const entries = Array.isArray(obj) ? obj.entries() : Object.entries(obj);
    
    for (const [key, value] of entries) {
      const newPath = [...currentPath, key];
      
      // Сравниваем значение
      if (value === targetValue) {
        return newPath;
      }
      
      // Рекурсивный поиск
      const result = getPathToValue(value, targetValue, newPath);
      if (result) {
        return result;
      }
    }
  }
  
  return null;
}

export function setValueByPath(obj, path, newValue) {
  let current = obj;
  
  // Проходим по всем элементам пути, кроме последнего
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key]) {
      current[key] = {}; // Создаём промежуточные объекты при необходимости
    }
    current = current[key];
  }
  
  // Устанавливаем новое значение для последнего ключа в пути
  const lastKey = path[path.length - 1];
  current[lastKey] = [...current[lastKey], newValue];
  
  return obj;
}

// export function setCountHoursByPathForDisciplineInCompetency(obj, path, newValue) {
//   console.log('path');
//   console.log(path);
//   let current = obj;
//   console.log(current);
//   // Проходим по всем элементам пути, кроме последнего
//   for (let i = 0; i < path.length - 1; i++) {
//      const key = path[i];
//      if (!current[key]) {
//          current[key] = {}; // Создаём промежуточные объекты при необходимости
//     }
//     current = current[key];
//   }
//   console.log('current');
//   console.log(current);
//   // // Устанавливаем новое значение для последнего ключа в пути
//   // const lastKey = path[path.length - 1];
//   // console.log('lastKey');
//   // console.log(lastKey);
//   current[lastKey] = [...current[lastKey]];
//   // console.log('current[lastKey]');
//   // console.log(current[lastKey]);
  
//   // // return obj;
//   return null;
// }

export function removeNodeByPath(path, treeData){
    const newTreeData = JSON.parse(JSON.stringify(treeData));
   // Функция для рекурсивного поиска и удаления узла
    const findAndRemoveNode = (nodes, remainingPath) => {
      if (remainingPath.length === 0) return nodes;
      
      let current = nodes;
      // Проходим по всем элементам пути, кроме последнего
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!current[key]) {
          current[key] = {}; // Создаём промежуточные объекты при необходимости
        }
        current = current[key];
      }

      const lastKey = path[path.length - 1];
      current.splice(lastKey, 1);
      
      return nodes;
     
    };

    // let newTreeData = findAndRemoveNode(treeData, path)
    let finalNewTreeData = findAndRemoveNode(newTreeData, path)
    return finalNewTreeData;
}
// export function removeNodeByPath(path, treeData) {
//   // Создаем глубокую копию данных
//   const newTreeData = JSON.parse(JSON.stringify(treeData));
  
//   // Функция для рекурсивного поиска и удаления узла
//   const findAndRemoveNode = (nodes, remainingPath) => {
//     if (remainingPath.length === 0) return;
    
//     const currentIndex = remainingPath[0];
    
//     // Проверяем, существует ли текущий узел
//     if (!nodes[currentIndex]) {
//       console.warn(`Узел по пути ${path} не найден`);
//       return;
//     }
    
//     if (remainingPath.length === 1) {
//       // Удаляем узел
//       nodes.splice(currentIndex, 1);
//       return;
//     }
    
//     // Рекурсивно идём по пути
//     if (nodes[currentIndex].children) {
//       findAndRemoveNode(nodes[currentIndex].children, remainingPath.slice(1));
//     }
//   };
  
//   // Обрабатываем разные форматы treeData
//   if (Array.isArray(newTreeData)) {
//     findAndRemoveNode(newTreeData, path);
//   } else if (newTreeData && typeof newTreeData === 'object') {
//     // Если treeData - одиночный объект
//     if (path.length === 0) {
//       // Очищаем данные
//       Object.keys(newTreeData).forEach(key => delete newTreeData[key]);
//       return {};
//     }
//     findAndRemoveNode([newTreeData], path);
//   } else {
//     console.error('Некорректный формат treeData');
//     return treeData;
//   }
  
//   return newTreeData;
// }
function getParentByPath(treeData, path) {
  if (path.length <= 1) return null; // Корневой узел не имеет родителя

  let parent = treeData;
  // console.log('treeData',treeData);
  // console.log('path', path);
  // Идем по пути до предпоследнего элемента
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!parent[key]) {
      parent[key] = {}; // Создаём промежуточные объекты при необходимости
    }
    parent = parent[key];
  }
  return parent;
}

// В обработчике:
const handleNodeClick = (nodeData, { path }) => {
  const parent = getParentByPath(treeData, path);
  console.log('Parent node:', parent);
};



// Вычисляем узел по значению ключа
export function findNodeInObject(tree, key, value) {
  // Проверяем текущий узел
  if (tree[key] === value) {
    return tree;
  }
  
  // Если есть дочерние элементы (children)
  if (tree.children) {
   for (const child of tree.children) {
        const found = findNodeInObject(child, key, value);
        if (found) return found;
      }
    }

     return null;
  }
  
 
// Вычисляем !!!список!!! узлов по значению ключа
export function findNodesInObject(tree, key, value, result = []) {
  // Проверяем текущий узел
  if (tree[key] === value) {
    result.push(tree); // Добавляем узел в результат
  }

  // Рекурсивно проверяем дочерние узлы
  if (tree.children) {
    for (const child of tree.children) {
      findNodesInObject(child, key, value, result); // Продолжаем поиск в детях
    }
  }

  return result; // Возвращаем массив всех найденных узлов
}
// // Использование
// const result = findNodeInObject(treeData, 'id', '123');

export function updateCountHoursForAllParentNode(treeData, _path, countAddedAvailableHours){
  console.log('path', _path);
  let newPath =[..._path];
  function updateCountHoursForParentNode(tree, path, countHours){
    let parentNode = getParentByPath(tree, path);
    parentNode.count_hours = parentNode.count_hours - countHours;
    path.pop();
    if (path.length > 1){
      updateCountHoursForParentNode(tree, path, countHours);
    }
  }
  updateCountHoursForParentNode(treeData, newPath, countAddedAvailableHours);
}

export function isUUID(str) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}

 export async function getDisciplinesOfCompetency(competencyNode){
            let fetchUrl = document.querySelector('#root').dataset.list_disciplines_of_competency;
            let responce = await fetch(`${fetchUrl}?competency_pk=${competencyNode.id}`, {
                method:"GET",
                credentials: 'include',
            });
            let result = await responce.json();
            console.log('Ответ от дениса')
            console.log(result)

            let customListKeysOfNode = Object.keys(competencyNode.count_hours);
            console.log('массив ключей кастомной компетенции: ', customListKeysOfNode );
            let listCustomDisciplineId = customListKeysOfNode.filter(key =>(parseInt(key) && !isUUID(key)));
            console.log(listCustomDisciplineId);
            console.log(listDisciplineNames);
            let filteredListDisciplineNames = listDisciplineNames.filter(item=>listCustomDisciplineId.includes(item.pk))
            console.log('список названий дисциплин: ',filteredListDisciplineNames)
            let itogListDisciplines =[...result.data, ...filteredListDisciplineNames]
            
            return itogListDisciplines;
        };

export async function getListDisciplineNames(){
       let fetchUrl = document.querySelector('#root').dataset.list_disciplines_all;
       let response = await fetch(`${fetchUrl}`, {
            method: 'GET',
            credentials: 'include',
            });
       let result = await response.json();
       console.log('дисциплины: ', result.data);
       
        return result.data;
        
         
       }

export function getListCompetencyByDisciplineName(listAllCompetency, disciplineName, listDisciplines, activeListCompNodes){
  
  console.log('-----------------listDisciplines-------------------');
  console.log(listDisciplines);
  console.log('-----------------disciplineName-------------------');
  console.log(disciplineName); 

  let filteredDisciplines = listDisciplines.filter(discipline => discipline.discipline_name_pk == disciplineName['pk']);  
  console.log('filteredDisciplines');
  console.log(filteredDisciplines);
  let filteredDisciplinesId = [];
  filteredDisciplines.forEach(discipline=>{filteredDisciplinesId.push(discipline.pk)})  

  let filteredActiveCompNodesByDisciplineName =activeListCompNodes.filter(competency =>{
            // console.log('список компетенций по названиям дисциплин');
            // console.log(Object.keys(competency['count_hours']));
            const competencyKeys = Object.keys(competency['count_hours']);
            return competencyKeys.includes(disciplineName['pk']) || competencyKeys.some(key =>filteredDisciplinesId.includes(key)) ; 
        })


  let filteredCompetencyByDisciplineName = listAllCompetency.filter(competency =>{
    console.log('список компетенций по названиям дисциплин competencyKeys');
    console.log(Object.keys(competency['count_hours']));
    const competencyKeys = Object.keys(competency['count_hours']);
    return competencyKeys.includes(disciplineName['pk']) || competencyKeys.some(key =>filteredDisciplinesId.includes(key)) ; 
  })
  console.log('filteredCompetencyByDisciplineName');
  console.log(filteredCompetencyByDisciplineName);
  let finalListCompetencyByDiscipline=[]
  for (let competency of filteredCompetencyByDisciplineName){
    
    let competencyFinal={}
    competencyFinal.code = competency.code;
    competencyFinal.id = competency.id;
    competencyFinal.name = competency.name;
    competencyFinal.active_hours =  getActiveTotalHoursCompetency(filteredActiveCompNodesByDisciplineName, competency.id, filteredDisciplinesId, disciplineName)
    competencyFinal.custom_hours = getTotalHoursInCompetencyByDisciplineName(competency.count_hours, filteredDisciplinesId, disciplineName);
    competencyFinal.active
    finalListCompetencyByDiscipline.push(competencyFinal)
  }
  
  return finalListCompetencyByDiscipline;
  
}

function getTotalHoursInCompetencyByDisciplineName(countHoursObj, filteredDisciplinesId, disciplineName){

 
  let totalHoursByCompetensy = 0;
  for ( let key in countHoursObj){
     if ( (filteredDisciplinesId.includes(key)) || key==disciplineName.pk){
      totalHoursByCompetensy =totalHoursByCompetensy + countHoursObj[key]
    }
  }
  
  return totalHoursByCompetensy;
}

function getActiveTotalHoursCompetency(filteredCompNodesByDisciplineName, competency_id, filteredDisciplinesId, disciplineName){
  let activeCompetency = filteredCompNodesByDisciplineName.find(compNode => compNode.id == competency_id);
  
  let total_hours = Boolean(activeCompetency) ? getTotalHoursInCompetencyByDisciplineName(activeCompetency.count_hours, filteredDisciplinesId, disciplineName) : 0;
  return total_hours;
  

}