const Person = require('./personModel');
const Relationship = require('./relationshipModel');

Person.hasMany(Relationship, { foreignKey: 'person_id' });

Person.hasMany(Relationship, { foreignKey: 'relative_id' });


module.exports = {
  Person,
  Relationship,
};
