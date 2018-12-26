$(document).ready(function(){

    //declare varibles to store planet and vehicles details
    var planetDetails,vehicleDetails;

    //declare array of for target planet with vehicles
    var targetPlanets=new Array(4);

    //input to find falcone
    var findFalcone=new Object;

    //index to find planet
    $seekPlanet=0;

    //set find queen disabled
    $('#find-queen').prop('disabled', true);

//get vehicle details
    $.get("https://findfalcone.herokuapp.com/vehicles", function(data, status){

    //check the status is success if not alert failure to get data
    if(status.localeCompare("success")==0)
    {
      //assign the response to vehicleDetails object
      vehicleDetails=data;


      //log the successfull assignments of vehciles, logs are best friend to debug
      console.log("vehicle details are received"+JSON.stringify(vehicleDetails));
    }
    else
    {
          console.log("API vehicle failure");
          return false;

    }
  });
//end of get vehicle call


    //get planet details
    $.get("https://findfalcone.herokuapp.com/planets", function(data, status){

    //check the status is success if not alert failure to get data of vehicle
    if(status.localeCompare("success")==0)
    {
      //assign the response to planetDetails object
      planetDetails=data;

      //log the successfull assignments of planets, logs are best friend to debug
      console.log("planet details are assigned"+JSON.stringify(planetDetails));


      //set loop for planetDetails to set checkbox planet
      $i=0;
      $('input[name=planet]').each(function () {

          //set value
          console.log("Setting check box value "+planetDetails[$i].name);
          $(this).prop('value',planetDetails[$i].name);


          //insert distance
          console.log("Planet:"+planetDetails[$i].name+" Distance:"+planetDetails[$i].distance);
          $(this).after("Planet:"+planetDetails[$i].name+" Distance:"+planetDetails[$i].distance);

          //increment $i
          $i++;
      });

      //on check box select
      $('input[name=planet]').on('change', function() {


        if($('.single-checkbox:checked').length > 4)
        {
          this.checked = false;

          //enable findqueen button
            $('#find-queen').prop('disabled', false);

        }
        else
        {

          $('#find-queen').prop('disabled', true);
          //assign targetplanets if checked
          if($(this).is(":checked"))
          {
            console.log("checked event triggered with condition of <4"+$('.single-checkbox:checked').length);
            //clear modal body
            $('.modal-body').empty();


            //open modal
            $( "#modal-button" ).trigger( "click" );

            //get planet Distance

            for($i=0;$i<planetDetails.length;$i++)
            {

              console.log(planetDetails[$i].name+"="+$(this).val());
              if((planetDetails[$i].name).localeCompare($(this).val())==0)
              {
                $seekPlanet=$i;
                break;
              }
            }




            for($j=0;$j<vehicleDetails.length;$j++)
            {
              console.log("i="+planetDetails[$i].distance);








              if((planetDetails[$i].distance<=vehicleDetails[$j].max_distance)&&vehicleDetails[$j].total_no>0)
              {

                //list the vehicles
                $('.modal-body').append("&nbsp<input type='radio' class='input-hidden' name='vehicle' id='"+vehicleDetails[$j].name+"' value='"+vehicleDetails[$j].name+"'><label for='"+vehicleDetails[$j].name+"'><img class='img-responsive' src='"+vehicleDetails[$j].name+".png' style='max-width:100px;'>Total count"+vehicleDetails[$j].total_no+"</label>&nbsp");



              }
            }

            //on select vehicle
            $('input[type="radio"]').click(function(){
                if ($(this).is(':checked'))
                {

                  //check to activate findqueen when 4 selected
                  if($('.single-checkbox:checked').length = 4)
                  {


                    //enable findqueen button
                      $('#find-queen').prop('disabled', false);

                  }


                  //store to targetPlanets
                  targetPlanets[planetDetails[$seekPlanet].name]=$(this).val();

                  //decrease the count of available vehicle

                  for($k=0;$k<vehicleDetails.length;$k++)
                  {
                    if((vehicleDetails[$k].name).localeCompare($(this).val())==0)
                    {
                      vehicleDetails[$k].total_no--;
                      console.log("decremented the vehicle");
                        break;
                    }


                  }

                    // make modal out a little slow so that user should know what he has clicked
                  setTimeout(function() {
                    $("#modal-close" ).trigger( "click" );
                  }, 900);




                  //print associative array of targetPlanets as logs
                  for (var key in targetPlanets) {
                    console.log(key+":"+targetPlanets[key]);
                  }

                }
              });



          }
          else
          {

            //reset the vehicle numbers
            for($k=0;$k<vehicleDetails.length;$k++)
            {
              if((vehicleDetails[$k].name).localeCompare(targetPlanets[$(this).val()])==0)
              {
                vehicleDetails[$k].total_no++;
                console.log("incremented the vehicle");
                  break;
              }


            }

            //remove targetplanets if unchecked
            //delete array with key=planet
            delete targetPlanets[$(this).val()];

            //print associative array of targetPlanets
            for (var key in targetPlanets) {
              console.log(key+":"+targetPlanets[key]);
            }
          }

        }

    });



    }
    else
    {
        alert("failed to load planets, unfortunately I have to exit");
        return false;
    }


  });

$("#find-queen").click(function(){

//get targetPlanets names to findfalcono
findFalcone.planet_names=Object.keys(targetPlanets);


//get vehicles names to findfalcono
findFalcone.vehicle_names=Object.values(targetPlanets);



$.ajax ({
  url:"https://findfalcone.herokuapp.com/token",
  type:"POST",
  contentType:"application/json; charset=utf-8",
  dataType:"json",
  headers: {Accept:"application/json"},
  success: function(data){
    //check the status is success if not alert failure to get data
    if((data.token).length>0)
    {

        var distance;
          findFalcone.token=data.token;
          //on success call findFalcone


          console.log("Here is your request"+JSON.stringify(findFalcone));

          $.ajax ({
            url:"https://findfalcone.herokuapp.com/find",
            type:"POST",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            data:JSON.stringify(findFalcone),
            headers: {Accept:"application/json","Content-Type":"application/json"},
            success: function(data){





          //check the status is success if not alert failure to get data
          if(((data.status).localeCompare("success")==0))
          {
            var date = new Date();
            date.setTime(date.getTime() + (5 * 1000));
            $.cookie('planet_name',data.planet_name,{ expires: date });
            console.log("Cookie"+$.cookie('planet_name'));
            //compute time
            for($m=0;$m<planetDetails.length;$m++)
            {
              if((planetDetails[$m].name).localeCompare(data.planet_name)==0)
              {
                  $distance=planetDetails[$m].distance;
              }
            }


            for($l=0;$l<vehicleDetails.length;$l++)
            {
              if((vehicleDetails[$l].name).localeCompare(targetPlanets[data.planet_name])==0)
              {
                  console.log("time taken"+$distance/vehicleDetails[$l].speed);
                  $.cookie('time_taken',$distance/vehicleDetails[$l].speed,{ expires: date });
                  //redirect
                  console.log("Cookie"+$.cookie('time_taken'));
                  window.location.href = "output.html";
                  break;
              }
            }


          }
          else
          {
              if(((data.status).localeCompare("false")==0))
              {
                //redirect
                  $.cookie('time_taken',0,{ expires: date });
                window.location.href = "output.html";
              }
              else {
                console.log("API find falcone  failure"+data.status);
                return false;
              }




          }
        }
        });


    }
    else
    {
          console.log("API token  failure");
          return false;


    }

  }


});

});


});
