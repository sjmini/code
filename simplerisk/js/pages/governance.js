jQuery(document).ready(function($){

    var controlObject = {


        init : function(){
            this.bindEvents();
        },

        bindEvents : function(){

          var self = this;

          $(document).on('click', '.framework-block--delete', function(event) {
            event.preventDefault();
            //$(this).parents('.framework-block').fadeOut('400').delay('500').remove();
            var framework_id = $(this).attr('data-id');
            var modal = $('#framework--delete');
            $('input', modal).val(framework_id);
            $(modal).modal('show');
          });

          $(document).on('click', '.control-block--delete', function(event) {
            event.preventDefault();
            var control_id = $(this).attr('data-id');
            var modal = $('#control--delete');
            $('input', modal).val(control_id);
            $(modal).modal('show');
          });

          $(document).on('click', '.control-block--edit', function(event) {
            event.preventDefault();
            var control_id  = $(this).attr('data-id');
            $.ajax({
                url: BASE_URL + '/api/governance/control?control_id=' + control_id,
                type: 'GET',
                dataType: 'json',
                success : function (res){
                    var data = res.data;
                    var control = data.control;
                    
                    var modal = $('#control--update');
                    $('.control_id', modal).val(control_id);
                    $('[name=short_name]', modal).val(control.short_name);
                    $('[name=long_name]', modal).val(control.long_name);
                    $('[name=description]', modal).val(control.description);
                    $('[name=supplemental_guidance]', modal).val(control.supplemental_guidance);
                    
                    $("#frameworks").multiselect('deselectAll', false);
                    $.each(control.framework_ids.split(","), function(i,e){
                        $("#frameworks option[value='" + e + "']").prop("selected", true);
                    });
                    $("#frameworks").multiselect('refresh');
                    
                    $('[name=control_class]', modal).val(Number(control.control_class) ? control.control_class : "");
                    $('[name=control_phase]', modal).val(Number(control.control_phase) ? control.control_phase : "");
                    $('[name=control_owner]', modal).val(Number(control.control_owner) ? control.control_owner : "");
                    $('[name=control_number]', modal).val(control.control_number);
                    $('[name=control_priority]', modal).val(Number(control.control_priority) ? control.control_priority : "");
                    $('[name=family]', modal).val(Number(control.family) ? control.family : "");

                    $(modal).modal('show');
                }
            });
          });
        }
    };


    controlObject.init();
  
    // Initiate Datatable of controls
    var pageLength = 10;
    var controlDatatable = $("#active-controls").DataTable({
        scrollX: true,
        bFilter: false,
        bLengthChange: false,
        processing: true,
        serverSide: true,
        bSort: true,
        pagingType: "full_numbers",
        dom : "flrtip",
        pageLength: pageLength,
        dom : "flrti<'#view-all.view-all'>p",
        ajax: {
            url: '/api/datatable/framework-controls',
            data: function(d){
                d.control_class = $("#filter_by_control_class").val();
                d.control_phase = $("#filter_by_control_phase").val();
                d.control_family = $("#filter_by_control_family").val();
                d.control_owner = $("#filter_by_control_owner").val();
                d.control_framework = $("#filter_by_control_framework").val();
                d.control_priority = $("#filter_by_control_priority").val();
                d.control_text = $("#filter_by_control_text").val();
            },
            complete: function(response){
                $("#controls_count").html("("+ response.responseJSON.recordsTotal +")");
            }
        }
    });

    // Add paginate options
    controlDatatable.on('draw', function(e, settings){
        $('.paginate_button.first').html('<i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i>');
        $('.paginate_button.previous').html('<i class="fa fa-chevron-left"></i>');

        $('.paginate_button.last').html('<i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i>');
        $('.paginate_button.next').html('<i class="fa fa-chevron-right"></i>');
    })
    
    // Add all text to View All button on bottom
    $('.view-all').html("All");

    // View All
    $(".view-all").click(function(){
        var oSettings =  controlDatatable.settings();
        oSettings[0]._iDisplayLength = -1;
        controlDatatable.draw()
        $(this).addClass("current");
    })
    
    // Page event
    $("body").on("click", "span > .paginate_button", function(){
        var index = $(this).attr('aria-controls').replace("DataTables_Table_", "");

        var oSettings =  controlDatatable.settings();
        if(oSettings[0]._iDisplayLength == -1){
            $(this).parents(".dataTables_wrapper").find('.view-all').removeClass('current');
            oSettings[0]._iDisplayLength = pageLength;
            controlDatatable.draw()
        }
        
    })

});


function getProjects(){
  return {

    "active" :  [

      { "id" : "1", "name" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, autem!" },
      { "id" : "2", "name" : "Lorem ipsum dolor sit amet."},
      { "id" : "3", "name" : "Lorem ipsum dolor sit amet, consectetur adipisicing." },
      { "id" : "4", "name" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id quia illum inventore, aliquid. Ducimus, blanditiis alias, vel cumque recusandae dicta!"}

    ],
    "inactive" : [],
    "on-hold": [{ "id" : "5", "name" : "Lorem ipsum dolor sit amet, consectetur." }],
    "cancled":[]

  };
}

// Redraw Framework Controls table
function redrawFrameworkControl() {
    $("#active-controls").DataTable().draw();
}    


$(document).ready(function(){
    $('.container-fluid').delegate('.tab-show', 'click', function(){
        $('#show-alert').html('');
        $('.form-tab').removeClass('selected');
        $(this).addClass('selected');
        $('.tab-data').hide();
        $($(this).data('content')).show();
        $(".framework-table").treegrid('resize');
        document.location.hash = $(this).data('content').replace("-content", "");
    });
    
    // Control Class dropdown event
    $('#filter_by_control_class').change(function(){
        redrawFrameworkControl();
    });
    
    // Control Class dropdown event
    $('#filter_by_control_phase').change(function(){
        redrawFrameworkControl();
    });
    
    // Control Family dropdown event
    $('#filter_by_control_family').change(function(){
        redrawFrameworkControl();
    });
    
    // Control Owner dropdown event
    $('#filter_by_control_owner').change(function(){
        redrawFrameworkControl();
    });
    
    // Control Framework dropdown event
    $('#filter_by_control_framework').change(function(){
        redrawFrameworkControl();
    });
    
    // Control Priority dropdown event
    $('#filter_by_control_priority').change(function(){
        redrawFrameworkControl();
    });
        
    // timer identifier
    var typingTimer;                
    // time in ms (5 seconds)
    var doneTypingInterval = 1000;  

    // Search filter event
    $('#filter_by_control_text').keyup(function(){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(redrawFrameworkControl, doneTypingInterval);
    });

    
});
