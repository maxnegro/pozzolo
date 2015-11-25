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
    var msg = NoVnc.state.get().msg;
    if (msg) {
      return msg;
    } else {
      return NoVnc.state.get().state;
    }
  },
  vnclabel: function() {
    switch (NoVnc.state.get().state) {
      case "normal":        return "label-success";
      case "disconnected":  return "label-warning";
      default:              return "label-info";
    }
  }
  // password: function() {
  //   return Session.get('password');
  // }
});
