const {Relationship} = require("../models/index.js");

const getAllRelationship = async (req, res) => {
    try {
      const relationship = await Relationship.findAll();
      res.status(201).json(relationship);
    } catch (error) {
      console.error('Error fetching person:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllRelationship
}