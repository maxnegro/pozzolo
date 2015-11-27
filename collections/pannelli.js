Pannelli = new Meteor.Collection( 'pannelli' );

Pannelli.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Pannelli.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

Schemas = {};
Schemas.Pannelli = new SimpleSchema({
  "nome": {
    type: String,
    label: "Impianto"
  },
  "host": {
    type: String,
    label: "Indirizzo IP pannello"
  },
  "port": {
    type: String,
    label: "Porta VNC pannello",
    defaultValue: "5900"
  },
  "password": {
    type: String,
    optional: true,
    label: "Password VNC pannello"
  },
  "enabled": {
    type: Boolean,
    label: "Abilitato",
    defaultValue: true
  }
});

Pannelli.attachSchema( Schemas.Pannelli );
