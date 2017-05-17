

$(document).ready(function(){


    $order=$('#location');
    $countryName=$('#country_name');
    $population2013=$('#population');

    jQuery.support.cors = true;
   


    $.ajax(
    {
        type: "GET",
        url: 'http://localhost:3000/name',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            
        $.each(data,function(i,item){

                $order.append('<tr><td>'+item.countryName+'</td><td>'+item.population2013+'</td><td><button type="button" id="'+item.countryName+'" class="delete_class btn btn-info" value="delete">delete</button></td></tr>');
                 $('svg').remove();
                 drawd3();
        });

    },
    error:function(){
      alert('unable to fetch data');s
    }


});

    $('#btn_add').on('click',function(){

        let obj= {
            countryName : $countryName.val(),
            population2013 : $population2013.val()
        }



    $.ajax(
    {
        type: "POST",
        url: 'http://localhost:3000/name',
        data:obj,
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        //cache: false,*/
        success: function (data) {

               $order.append('<tr ><td>'+data.countryName+'</td><td>'+data.population2013+'</td><td><button type="button" id="'+data.countryName+'" class="delete_class btn btn-info" value="delete">delete</button></td></tr>');
               $('svg').remove();
                drawd3();

    },
    error:function(){
      alert('unable to add data');s
    }


});



     });

    $order.delegate('.delete_class','click',function(){
        var $tr=$(this).closest('tr');
       
      

       $.ajax({
        type: "DELETE",
        url: 'http://localhost:3000/name/' + $(this).attr('id'),

     
        success: function () {
            $tr.remove();
            $('svg').remove();
                drawd3();
            },
            error:function(){
      alert('unable to delete data');s
    }
});

    });

});


/*--------------------------------------------------------------------------------------------*/
function drawd3(){

var margin = {top: 20, right: 20, bottom: 140, left: 80},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    var c10 = d3.scale.category10();
    var c20 = d3.scale.category20();
var c20b = d3.scale.category20b();
var c20c = d3.scale.category20c();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(19);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(16);

var populationTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Population :</strong> <span style='color:red'>" + d.population2013 + " &times;10<sup>6</sup></span>";
  });




/*.............................................................................
                  Graph : Population in 2013 Vs Country
..............................................................................*/
var svg1 = d3.select("#graphWrap1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border","1px solid #aaa")
    .style("box-shadow","inset 0 0 2px #aaa")
    .style("border-top-left-radius","3px")
    .style("border-top-right-radius","3px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg1.call(populationTip);

d3.json("http://localhost:3004/countries", function( countriesAndContinents ) {

  var noOfCountries = countriesAndContinents.length;
  // Function to check whether an entry is a country
  function isCountry( countryName ) {
    for (var i = 0; i < noOfCountries; i++) {
      var temp_var=countriesAndContinents[i].country.toUpperCase();
      if( countryName.toUpperCase() == countriesAndContinents[i].country)
        return true;
    }
    return false;
  }


  // To read the graph 1 JSON
  d3.json("http://localhost:3000/name",function( data ) {

    // Filtering the parsed data to get the plotting data
    var plottingData = data.filter(function( countryDetails ) {
      if( isCountry(countryDetails.countryName.toUpperCase() ) ) {
        return countryDetails;
      }
    })
    var len = plottingData.length;

    // Using Bubble Sort to sort the data in Descending order
    for (var i = 0; i < len-1; i++) {
      for (var j = 0; j < len-i-1; j++) {
        if( parseFloat( plottingData[j].population2013 ) < parseFloat( plottingData[j+1].population2013 ) ) {
            var temp = plottingData[j];
            plottingData[j] = plottingData[j+1];
            plottingData[j+1] = temp;
        }
      }
    }

    x.domain( plottingData.map( function(d) { return d.countryName; } ) );
    y.domain( [0, parseFloat(plottingData[0].population2013) + 40] ); // After sorting the data in descending order

    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(xAxis)
      .append("text")
        .attr("x", 420)
        .attr("y", 100)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .style("fill",c20)
        .text("country");

    d3.selectAll(".x .tick text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -200)
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .style("fill",c20)
        .text( "population-2013" );

    svg1.selectAll(".bar")
          .data( plottingData )
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.countryName); })
        .attr("width", 40)
        .attr("y", function(d) { return y(parseFloat(d.population2013)); })
        .attr("height", function(d) { return height - y(parseFloat(d.population2013)); })
        .attr("fill",c20b)
        .on('mouseover', populationTip.show)
        .on('mouseout', populationTip.hide);
  });
});

};






