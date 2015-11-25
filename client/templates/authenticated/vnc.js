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
  vncstate: function() {
    return NoVnc.state.get().msg;
  },
  vnclabel: function() {
    if (NoVnc.state.get().state == "normal") {
      return "label-success";
    } else {
      return "label-default";
    }
  }
  // password: function() {
  //   return Session.get('password');
  // }
});
