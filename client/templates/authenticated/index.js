// Template.index.onCreated( () => {
//   Template.instance().subscribe( 'template' );
// });
Template.index.onCreated( () => {
  Template.instance().subscribe( 'pannelli' );
});

Template.index.helpers( {
  listaPannelli: function() {
    return Pannelli.find({}, {
      sort: { 'name_sort': 1 }
    });
  }
});
