const authenticatedRedirect = () => {
  if ( !Meteor.loggingIn() && !Meteor.userId() ) {
    FlowRouter.go( 'login' );
  }
};

const authenticatedRoutes = FlowRouter.group({
  name: 'authenticated',
  triggersEnter: [ authenticatedRedirect ]
});

authenticatedRoutes.route( '/', {
  name: 'index',
  action() {
    BlazeLayout.render( 'default', { yield: 'index' } );
  }
});

authenticatedRoutes.route( '/vnc/:panelID', {
  name: 'vnc',
  triggersEnter: [vncEnter],
  action: function(params) {
    // var currentPanel = Pannelli.findOne({_id:params.panelID});
    // if (currentPanel) {
      BlazeLayout.render( 'default', {
        yield: 'vnc',
        host: window.location.hostname,
        port: 3010
      });
    // } else {
    //   BlazeLayout.render( 'default', { yield: 'notFound' });
    // }
  },
  // triggersExit: [vncExit]
});


function vncEnter(context) {
  var wsPath = Meteor.call('setupWsProxy', context.params.panelID, function(error, result) {
    if (error) {
      Bert.alert("Errore nell'impostare la comunicazione col server " + error, 'danger', 'fixed-top');
    }
  });
}

// function vncExit(context) {
  // Meteor.call('closeWsProxy', context.params.panelID);
  // Session.delete("password");
// }

authenticatedRoutes.route( '/history/:panelID', {
  name: 'history',
  action: function(params) {
    // var currentPanel = Pannelli.findOne({_id:params.panelID});
    // if (currentPanel) {
      BlazeLayout.render( 'default', {
        yield: 'history'
      });
    // } else {
    //   BlazeLayout.render( 'default', { yield: 'notFound' });
    // }
  }
});
