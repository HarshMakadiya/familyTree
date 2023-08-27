import React, { useEffect, useState } from 'react'
import Tree from 'react-d3-tree';
import AddFamily from '../Modal/AddFamily';
import EditPerson from '../Modal/EditPerson';

const FamilyApp = () => {

  const [personsList,setPersonList] = useState({});
  const [rootNode,setRootNode] = useState(-1);
  
  useEffect(()=>{
    fetch("http://localhost:5001/api/person/",{method:"get"}).then(response=>response.json()).then(response=>{
      setPersonList(response.tree);
      const len = Object.keys(response.tree).length;
      if(len==0) 
        setRootNode(-1);
      else
        setRootNode(response.rootNode); 
    }); 
  },[]);

  useEffect(()=>{
    const len = Object.keys(personsList).length;
    if(len===0) setRootNode(-1);
  },[personsList]);

  function genStruct(index){
    const struct = 
    {
      "name" : personsList[index]?.full_name,
      "id" : personsList[index]?.person_id,
      "attributes" : {"gender" : personsList[index]?.gender, "birthdate" : personsList[index]?.birthdate},
      "minMax": [...Array(2).fill("")],
      "children" : []
    }
    return struct;
  }
  function dfs(node){
    if(Object.keys(personsList).length===0) return {};
    const configData = genStruct(node);
    if(parseInt(node)==-1) return {};
    if(!personsList[node]) return {};
    if(personsList[node].children.length===0){
      const todaysDate = new Date();
      const formatted = todaysDate.toLocaleDateString("en-UK").split("/").reverse().join("-");
      configData.minMax[1] = formatted;      
      return configData;
    }
    let getMinChildBirthDate = configData.attributes.birthdate;
    let toBeDeleted = [];
    let i=0;
    for(let child of personsList[node]?.children){
      if(!personsList[child]){
        toBeDeleted.push(i);
        continue;
      }
      if(personsList[child]?.birthdate < getMinChildBirthDate){
        getMinChildBirthDate = personsList[child]?.birthdate;
      }
      configData.children.push(dfs(child));
      configData.children[configData.children.length - 1].minMax[0] = configData.attributes.birthdate;
      i++;
    }
    i = 0;
    for(let Ids in toBeDeleted){
      personsList[node].children.splice(Ids - i,1);
      i++;
    }
    configData.minMax[1] = getMinChildBirthDate;
    return configData;
  }
  const [data, setData] = useState(0);

  const updateChild = (nodeId, updatedProperties) => {
    const updatedData = { ...data };
    const nodeToUpdate = updatedData.nodes.find(node => node.id === nodeId);
    if (nodeToUpdate) {
      Object.assign(nodeToUpdate, updatedProperties);
      setData(updatedData);
    }
  };

  const deleteChild = (nodeId) => {
    const updatedData = { ...data };
    updatedData.nodes = updatedData.nodes.filter(node => node.id !== nodeId);
    setData(updatedData);
  };

  const addChild = (parentNode, childNode) => {
    const updatedData = { ...data };
    childNode.parents = [parentNode.id];
    updatedData.nodes.push(childNode);
    setData(updatedData);
  };

  const [person,setPerson] = useState({});
  const [show,setShow] = useState(false);


  const nodeClick = (e)=>{
    if(Object.keys(personsList).length===0) return;
    setShow(true);
    setPerson(e.data);
  }

  return (
    <>
      <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tree onNodeClick={nodeClick} translate={{  x: window.innerWidth / 2, y: 100 }} draggable={false} orientation='vertical' data={dfs(rootNode)} />
      </div>
      <EditPerson person={person} personsList = {personsList} setPersonList={setPersonList} show={show} setShow={setShow} />
      <AddFamily setPersonList={setPersonList} personsList={personsList} rootNode={rootNode} setRootNode={setRootNode}/>
    </>
  );
}

export default FamilyApp