Template.history.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var panelID = FlowRouter.getParam('panelID');
    self.subscribe('singlePanel', panelID);
  });
});

Template.history.rendered = function(){
  d3.csv("/dati/20151126.csv", function (e, data) {
    if (e) {
      bert.alert("Error: ",e);
      return;
    }
    var parseDate = d3.time.format("%Y/%m/%d %H:%M:%S").parse;
    data.forEach(function(it) {
      it.date=parseDate(it["Date"] + " " + it["Time"]);
      if (it["Livello pozzo 1"]) {
      it.l1= +it["Livello pozzo 1"];
    } else {
      it.l1 = 0;
    }
    if (it["Livello pozzo 2"]) {
      it.l2= +it["Livello pozzo 2"] ;
    } else {
      it.l2=0;
    }
    });
    var ndx = crossfilter(data);

    var dateDim = ndx.dimension(function(d) {return d.date;});
    // var hits = dateDim.group().reduceSum(function(d) {return d.total;});
    var l1Dim = dateDim.group().reduce(
      // Add
      function(p,v) {
        p.count++;
        p.sum += v.l1;
        p.avg = d3.round((p.sum/p.count), 2);
        return p;
      },
      // Remove
      function (p,v) {
        p.count--;
        p.sum -= v.l1;
        p.avg = d3.round((p.sum/p.count), 2);
        return p;
      },
      // Init
      function (p,v) {
        return {count: 0, sum: 0, avg: 0};
      }
    );
    var l2Dim = dateDim.group().reduce(
      // Add
      function(p,v) {
        p.count++;
        p.sum += v.l2;
        p.avg = d3.round((p.sum/p.count), 2);
        return p;
      },
      // Remove
      function (p,v) {
        p.count--;
        p.sum -= v.l2;
        p.avg = d3.round((p.sum/p.count), 2);
        return p;
      },
      // Init
      function (p,v) {
        return {count: 0, sum: 0, avg: 0};
      }
    );
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    var hitslineChart  = dc.compositeChart("#lineChart");

    hitslineChart
    .width(800).height(300)
    .brushOn(false)
    // .elasticY(true)
    .margins({top: 0, right: 5, bottom: 20, left: 40})
    // .yAxis().ticks(4)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .dimension(dateDim)
    .legend(dc.legend().x(60).y(10).itemHeight(13).gap(5))
    // .legend(dc.legend())
    .valueAccessor(function(p) {
      return p.value.avg;
    })
    .x(d3.time.scale().domain([minDate,maxDate]))
    .y(d3.scale.linear().domain([50,150]))
    .compose([
      dc.lineChart(hitslineChart).group(l1Dim, "pozzo 1").valueAccessor(function(p) {
        return p.value.avg;
      }),
      dc.lineChart(hitslineChart).group(l2Dim, "pozzo 2").valueAccessor(function(p) {
        return p.value.avg;
      }).colors("red")
    ]);

    dc.renderAll();
  });

}

// Template.vnc.onDestroyed(function() {
// });

Template.history.helpers({
  panel: function() {
    var panelID = FlowRouter.getParam('panelID');
    var panel = Pannelli.findOne({_id: panelID}) || {};
    return panel;
  },
});
