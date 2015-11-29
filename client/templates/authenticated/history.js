Template.history.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var panelID = FlowRouter.getParam('panelID');
    self.subscribe('singlePanel', panelID);
  });
});

// Template.vnc.onDestroyed(function() {
// });

Template.history.helpers({
  panel: function() {
    var panelID = FlowRouter.getParam('panelID');
    var panel = Pannelli.findOne({_id: panelID}) || {};
    return panel;
  },
});
