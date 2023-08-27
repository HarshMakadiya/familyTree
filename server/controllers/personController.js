const { Op } = require('sequelize');
const {Person, Relationship} = require('../models/index');


async function getAllPerson(req, res){
  try {
    const person = await Person.findAll();
    const relationship = await Relationship.findAll();
    const formattedPerson = person.map((person) => person.get({ plain: true }));
    const mainObj = Object();
    const rootParent = new Set([]);
    for(let Person of formattedPerson){
      mainObj[Person.person_id] = {...Person,"children" : []};
      rootParent.add(Person.person_id);
    }
    for(let Item of relationship){
      mainObj[Item.person_id].children.push(Item.relative_id);
      rootParent.delete(Item.relative_id);
    }
    const rootNode = rootParent.values().next().value;
    res.status(200).json({'rootNode' : rootNode,'tree':mainObj});
  } catch (error) {
    console.error('Error fetching person:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addPerson = async (req, res) => {
  try{
    const {full_name, gender, birthdate, parents, rootNode} = req.body;

    const person = await Person.create({full_name, gender, birthdate});
    if(parseInt(parents)==-1){
      if(rootNode === -1){
        res.status(200).json({person});
      }else{
        const relationship = await Relationship.create({person_id: person.person_id, relative_id: rootNode});
        res.status(200).json({person,relationship});
      }
      return;
    }
      
    const relationship = await Relationship.create({person_id: parents, relative_id: person.person_id})
    
    res.status(200).json({person, relationship});
  }catch(e){
    console.error('Error adding person:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePerson = async (req, res) => {
  try{
    const toDelete = req.body;
    await Relationship.destroy({where: {
      [Op.or]: [
        { person_id: { [Op.in]: toDelete } },
        { relative_id: { [Op.in]: toDelete } }
      ]
    }});
    await Person.destroy({where: {
      person_id: { [Op.in]: toDelete }
    }});
    res.status(201).json({success: true});
  }catch(e){
    console.error('Error deleting person :', e);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const editPerson = async (req, res) => {
  try {
    const {person_id,full_name, gender, birthdate} = req.body;
    console.log(person_id,full_name, gender, birthdate);
    await Person.update({
      full_name: full_name,
      gender:gender,
      birthdate:birthdate
    },{
      where:{
        person_id:person_id
      }
    })
    res.status(201).json({success: true});
  } catch (error) {
    console.error('Error Editing person :', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllPerson,
  addPerson,
  deletePerson,
  editPerson
};
