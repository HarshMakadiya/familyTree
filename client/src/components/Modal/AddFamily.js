import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";


const AddFamily = ({personsList, setPersonList,rootNode,setRootNode}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [parent, setParent] = useState({});
  const [loading,setLoading] = useState(false);
  const [person,setPerson] = useState({
    full_name:'',
    gender:'male',
    birthdate:'',
    parents:-1,
    rootNode: rootNode
  });
  const handleChange = (e)=>{
    e.target.setAttribute('disabled',true);
    setLoading(true);
    person.rootNode = rootNode;
    fetch('http://localhost:5001/api/person/',{
      method:'POST',
      body:JSON.stringify(person),
      headers:{
        'Content-Type':'application/json'
      }
    }).then(res=>res.json()).then(data=>{
      let tmpObj = {};
      console.log(data,"data");
      tmpObj[data.person.person_id] = data.person;
      data.person["children"] = [];
      if(person.parents===-1){
        if(rootNode!=-1) data.person.children.push(rootNode);
        setPersonList((plist) => ({ ...plist,[data.person.person_id]: data.person }));
        setRootNode(data.person.person_id);
      }else
        setPersonList((plist) => ({ ...plist,[person.parents] : {...plist[person.parents],children : [...plist[person.parents].children,data.person.person_id]}, [data.person.person_id]: data.person }));
      setLoading(false);
      e.target.setAttribute('disabled',false);
      setShow(false);

    });
  }
  return (
    <>
      <Button variant="primary" style={{position:'fixed',zIndex:2,right:'32px',bottom:'32px'}} onClick={handleShow}>
        Add Family
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Family</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Container>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      onChange={(e)=>{setPerson({...person, full_name:e.target.value})}}
                      name="name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select onChange={(e)=>{setPerson({...person, gender:e.target.value})}} aria-label="Default select example">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                  </Form.Group>
                </Col>
             </Row>
            <Row>
              <Col>
              <Form.Group className="mb-3">
                    <Form.Label>Parent</Form.Label>
                    <Form.Select onChange={(e)=>{setPerson({...person, parents:parseInt(e.target.value), birthdate: personsList[e.target.value].birthdate}); setParent(personsList[e.target.value])}} aria-label="Default select example">
                        <option value="-1">None</option>
                        {Object.values(personsList).map((person,index)=>{
                          return <option key={person.person_id} value = {person.person_id}>{person.full_name}</option>
                        })}
                      </Form.Select>
                  </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Birthdate</Form.Label>
                  <Form.Control
                      onChange={(e)=>{setPerson({...person, birthdate:e.target.value})}}                    
                      type="date"
                      value={person?.birthdate || parent?.birthdate}
                      min={parent?.birthdate}
                  >

                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>
         </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button disabled={loading} variant="primary" onClick={handleChange}>
            { loading ? <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner> : "Submit" } 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddFamily