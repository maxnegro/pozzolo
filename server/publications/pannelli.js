Meteor.publish( 'pannelli', function() {
  return Pannelli.find( { enabled: true }, { fields: { 'nome': 1, 'name_sort': 1  } } );
});
Meteor.publish("singlePanel", function(panelID) {
  check(panelID, String);
  // Make a delay manually to show the loading state
  Meteor._sleepForMs(2000);

  return Pannelli.find({_id:panelID, enabled: true }, { fields: { 'nome': 1, 'password': 1}});
});
