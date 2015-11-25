Template.vnc.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var panelID = FlowRouter.getParam('panelID');
    self.subscribe('singlePanel', panelID);
  });
});

// Template.vnc.onDestroyed(function() {
// });

Template.vnc.helpers({
  panel: function() {
    var panelID = FlowRouter.getParam('panelID');
    var panel = Pannelli.findOne({_id: panelID}) || {};
    return panel;
  },
  path: function() {
    return "/ws/" + FlowRouter.getParam('panelID');
  },
  // password: function() {
  //   return Session.get('password');
  // }
});
