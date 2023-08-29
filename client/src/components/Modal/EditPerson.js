import React from 'react'
import { Col, Container, Form, Row,Modal,Button, Spinner } from 'react-bootstrap';
import { useState,useEffect } from 'react';

export default function EditPerson({person, personsList,setPersonList,show,setShow}) {
  const [editPerson,setEditPerson] = useState({});
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    setEditPerson({
      person_id: person.id,
      full_name : person.name,
      birthdate : person.attributes?.birthdate,
      gender : person.attributes?.gender});
  },[show])

  const handleClose = ()=>{
    setShow(0);
  }
  const handleChanges = (e)=>{
    const dummy = {...personsList};
    dummy[person.id].full_name = editPerson.full_name;
    dummy[person.id].birthdate = editPerson.birthdate;
    dummy[person.id].gender = editPerson.gender;
    setLoading(true);
    fetch("http://localhost:5001/api/person/",{
      method:'PUT',
      body:JSON.stringify(editPerson),
      headers:{
        'Content-Type':'application/json'
      }
    }).then(res=>res.json()).then(data=>{
      console.log(dummy);
      if(!data.success) return;
      setPersonList(dummy)
      setShow(0);
      setLoading(false);
    });
  }
  const handleDelete = (e)=>{
    let queue = [];
    queue.push(person.id);
    const toDelete = [];
    // BFS approach to delete all the children of the person
    const dummy = {...personsList};
    while(queue.length){
      let x = queue.shift();
      toDelete.push(x);
      delete dummy[x];
      for(let p of personsList[x].children){
          queue.push(p);
      }
    }
    fetch('http://localhost:5001/api/person/',{
    method:'DELETE',
    body:JSON.stringify(toDelete),
    headers:{
      'Content-Type':'application/json'
    }
  }).then(res=>res.json()).then(data=>{
    if(!data.success) return;
    setPersonList(dummy);
  });
    setShow(0);
  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Container>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={person.name}
                      placeholder="Enter Name"
                      onChange={(e)=>{setEditPerson((prevData)=>({...prevData, full_name:e.target.value}))}}
                      name="name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>BirthDate</Form.Label>
                    <Form.Control
                      type="date"
                      value={editPerson.birthdate}
                      min = {(person?.minMax ? person?.minMax[0]: person?.minMax)}
                      max = {(person?.minMax ? person?.minMax[1]: person?.minMax)}
                      onChange={(e)=>{setEditPerson((prevData)=>({...prevData, birthdate:e.target.value}))}}
                      name="date"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select onChange={(e)=>{setEditPerson((prevData)=>({...prevData, gender:e.target.value}))}} aria-label="Default select example">
                        <option value="male" selected={editPerson.gender=="male"}>Male</option>
                        <option value="female" selected={editPerson.gender=="female"}>Female</option>
                        <option value="other" selected={editPerson.gender=="other"}>Other</option>
                      </Form.Select>
                  </Form.Group>
                </Col>
             </Row>
            </Container>
         </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger"  onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button disabled={loading} variant="primary" onClick={handleChanges}>
            { loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> : "Submit" } 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}