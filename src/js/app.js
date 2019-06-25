import $$ from 'dom7';
import Framework7 from './framework7-custom.js';

// Import F7 Styles
import '../css/framework7-custom.less';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';

var URL_WS = 'https://graphicsandcode.com/proyectos/zombieapi/';

/* FUNCTIONS */

function refreshFinanciera(mes,a){
  app.request.setup({
    headers: {
      "apikey" : localStorage.getItem('apikey')
    },
    beforeSend: function () {
      app.preloader.show();
        //do something before every request sent
    },
    complete: function(){
      app.preloader.hide();
    },
    timeout : 5000
  });
  app.request.get(URL_WS+'movimientos/'+localStorage.getItem('userid')+'/'+mes+'/'+a, function (data) {
        var output = '';
        var total = 0;
        var output_gf='';
        var output_gv='';
        var output_if='';
        var output_iv='';
        data.forEach(function(v,i){
          switch(v.tipo) {
              case '1':
              output_gf+='<tr><td class="label-cell">'+v.etiqueta+'</td><td class="gf">GF</td><td class="numeric-cell">-'+v.cantidad+'</td><td class="w20"><a href="#" class="eliminar_movimiento_financiero" data-id-movimiento="'+v.id+'"><i class="fa fa-times-circle" aria-hidden="true"></i></a></td></tr>'
          total = total - Number.parseFloat(v.cantidad);
              break;
              case '2':
              output_gv+='<tr><td class="label-cell">'+v.etiqueta+'</td><td class="gv">GV</td><td class="numeric-cell">-'+v.cantidad+'</td><td class="w20"><a href="#" class="eliminar_movimiento_financiero" data-id-movimiento="'+v.id+'"><i class="fa fa-times-circle" aria-hidden="true"></i></a></td></tr>'
          total = total - Number.parseFloat(v.cantidad);
              break;
              case '3':
              output_if+='<tr><td class="label-cell">'+v.etiqueta+'</td><td class="if">IF</td><td class="numeric-cell">'+v.cantidad+'</td><td class="w20"><a href="#" class="eliminar_movimiento_financiero" data-id-movimiento="'+v.id+'"><i class="fa fa-times-circle" aria-hidden="true"></i></a></td></tr>'
          total = total + Number.parseFloat(v.cantidad);
              break;
              case '4':
          total = total + Number.parseFloat(v.cantidad);
              output_iv+='<tr><td class="label-cell">'+v.etiqueta+'</td><td class="iv">IV</td><td class="numeric-cell">'+v.cantidad+'</td><td class="w20"><a href="#" class="eliminar_movimiento_financiero" data-id-movimiento="'+v.id+'"><i class="fa fa-times-circle" aria-hidden="true"></i></a></td></tr>'
              break;
            }
        });       
        output += output_gf;
        output += output_gv;
        output += output_if;
        output += output_iv;
        $$('#tabla_gastos').html(output);
        $$('#total').html((total.toLocaleString()))
  },
  'json');
}


/* FIN FUNCTIONS */


var app = new Framework7({
  root: '#app', // App root element
  id: 'com.graphicsandcode.soyzombie', // App bundle ID
  name: 'Soy Zombie', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {    

  },
  // App root methods
  methods: {
  },
  // App routes
  routes: routes,
  // Input settings
  input: {
  	scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
  	scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
  	overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
  	iosOverlaysWebView: true,
  	androidOverlaysWebView: false,
  },
  on: {
  	init: function () {
  		var f7 = this;
  		if (f7.device.cordova) {
        cordovaApp.init(f7);
        /*if(localStorage.getItem('auth')=='true'){
          alert(localStorage.getItem('auth'));

          this.views.main.router.navigate('/inicio/', {reloadCurrent: false});
        }
        */
      }
},
},
});






$$(document).on('page:init', '.page[data-name="dashboard"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  $$('.toolbar-bottom ').show();

});


$$(document).on('page:init', '.page[data-name="metas"]', function (e) {
  app.request.setup({
    headers: {
      "apikey" : localStorage.getItem('apikey')
    },
    beforeSend: function () {
      app.preloader.show();
        //do something before every request sent
    },
    complete: function(){
      app.preloader.hide();
    },
    timeout : 5000
  });
  app.request.get(URL_WS+'metas/'+localStorage.getItem('userid'), function (data) {
    var output = '';
    data.forEach(function(v,i){    
      output +='<li><a href="/meta/'+v.id+'" class="item-link item-content"><div class="item-media"><i class="material-icons">done</i></div><div class="item-inner"><div class="item-title">'+v.etiqueta+'</div></div></a></li>'
    });
    $$('#lista_metas').html(output);
  },
  'json');
});

$$(document).on('page:init', '.page[data-name="agregarmetas"]', function (e) {
  $$('#btn_agregar_tarea').on('click', function (e) {
    e.preventDefault();
    var tarea = $$('#tarea_etiqueta').val();
    if(tarea == ''){
      app.dialog.alert("Escriba el valor de la tarea", "Error");
    }else{
      var output = $$('#tabla_metas').html();
      output += '<tr><td>'+tarea+'</td><td><a href="#" class="eliminar_tarea"><i class="material-icons">clear</i></a></td></tr>';
      //output = '<tr><td>a</td><td>b</td></tr>';

      $$('#tabla_metas').html(output);
      $$('#tarea_etiqueta').val('');
    }
  });
  $$('#btn_guardar_meta').on('click', function (e) {
    e.preventDefault();
    var etiqueta = $$('#meta_etiqueta').val();
    var tipo = $$('#meta_tipo').val();
    var tareas = '';
    var id_usuario = localStorage.getItem('userid');
    var metas = $$('#tabla_metas tr td:first-child');
    metas.forEach(function(v,i){
      var tarea = $$(this).html();
      tareas += tarea+"|";
    });
    if(etiqueta=='' || tipo=='' || tareas ==''){
      app.dialog.alert("Escriba etiqueta, tipo y tareas", "Error");
    }else{
      var jsonData = '{"etiqueta":"'+etiqueta+'","tipo":"'+tipo+'","tareas":"'+tareas+'","id_usuario":"'+id_usuario+'"}';
      jsonData = JSON.parse(jsonData);
      app.request.setup({
        headers: {
          "apikey" : localStorage.getItem('apikey')
        },
        beforeSend: function () {
          app.preloader.show();
            //do something before every request sent
        },
        complete: function(){
          app.preloader.hide();
        },
        timeout : 5000
      });
    app.request.postJSON(URL_WS+'meta', jsonData , function (data) {
      app.dialog.alert("Meta guardada correctamente", "Éxito");
      app.views.main.router.navigate('/metas/', {reloadCurrent: false});
    });
    }
  });

  $$(document).on('click', '.eliminar_tarea', function () {
    e.preventDefault();
    var eliminar = $$(this).parent().parent();
    eliminar.remove();
  }); 


});




$$(document).on('page:init', '.page[data-name="meta"]', function (e) {
  var id_meta = app.view.main.router.currentRoute.params.id_meta;
  app.request.setup({
    headers: {
      "apikey" : localStorage.getItem('apikey')
    },
    beforeSend: function () {
      app.preloader.show();
        //do something before every request sent
    },
    complete: function(){
      app.preloader.hide();
    },
    timeout : 5000
  });
  app.request.get(URL_WS+'meta/'+id_meta, function (data) {
    var output = '';
    $$('#titulo_meta').html(data.etiqueta);
    var tareas = ( data.tareas );
    tareas.forEach(function(v,i){    
      if(v!=""){
        output +='<li><a href="#" class="item-link item-content"><div class="item-media"><i class="material-icons">done</i></div><div class="item-inner"><div class="item-title">'+v+'</div></div></a></li>'
      }
    });
    $$('#lista_tareas').html(output);
  },
  'json');


  $$(document).on('click', '#btn_completar_meta', function (e) {
    e.preventDefault();
    app.request.setup({
      headers: {
        "apikey" : localStorage.getItem('apikey')
      },
      beforeSend: function () {
        app.preloader.show();
      },
      complete: function(){
        app.preloader.hide();
      },
      timeout : 5000
    });
    app.request.get(URL_WS+'completar-meta/'+id_meta, function (data) {
      app.views.main.router.navigate('/metas/', {reloadCurrent: false});
    },
    'json');
  });


});
 

  /* 
$(document).on("click","#btn_agregar_tarea",function(e) {
  e.preventDefault();
  var tarea = $('#tarea_etiqueta').val();
  if(tarea == ''){
    app.dialog.alert("Escriba el valor de la tarea", "Error");
  }else{
    output = '<tr><td>'+tarea+'</td><td><a href="#" class="eliminar_tarea"><i class="fa fa-times-circle" aria-hidden="true"></i></a></td></tr>';
    $('#tabla_metas').append(output);
    $('#tarea_etiqueta').val('');
  }
});
  */ 

$$(document).on('page:init', '.page[data-name="saludfinanciera"]', function (e) {
  var d = new Date();
  var m = d.getMonth();
  m=m+1;
  var mes = ("0"+m);
  var a = d.getFullYear();
  $$('#mes_financiera').val(mes)
  $$('#anio_financiera').val(a)
  refreshFinanciera(mes,a);  	






  $$('#btn_guardar_gasto_variable').on('click', function () {
    var tipo = localStorage.getItem('tipo_movimiento');
    var mes = $$('#mes_financiera').val();
    var anio = $$('#anio_financiera').val();
    var etiqueta = $$('#etiqueta_gv').val();
    var cantidad = $$('#cantidad_gv').val();
    var id_usuario =localStorage.getItem('userid');
    var jsonData = '{"tipo":"'+tipo+'","mes":"'+mes+'","anio":"'+anio+'","etiqueta":"'+etiqueta+'","cantidad":"'+cantidad+'","id_usuario":"'+id_usuario+'"}';
    jsonData = JSON.parse(jsonData);
    app.request.setup({
        headers: {
          "apikey" : localStorage.getItem('apikey')
        },
        beforeSend: function () {
          app.preloader.show();
            //do something before every request sent
        },
        complete: function(){
          app.preloader.hide();
        },
        timeout : 5000
    });
    app.request.postJSON(URL_WS+'movimiento', jsonData , function (data) {
      var mes = $$('#mes_financiera').val();
      var a = $$('#anio_financiera').val();
      refreshFinanciera(mes,a); 
    });
  });

  $$('#btn_guardar_gasto_fijo').on('click', function () {
    var tipo = localStorage.getItem('tipo_movimiento');
    var mes = $$('#mes_financiera').val();
    var anio = $$('#anio_financiera').val();
    var etiqueta = $$('#etiqueta_gf').val();
    var cantidad = $$('#cantidad_gf').val();
    var id_usuario =localStorage.getItem('userid');
    var jsonData = '{"tipo":"'+tipo+'","mes":"'+mes+'","anio":"'+anio+'","etiqueta":"'+etiqueta+'","cantidad":"'+cantidad+'","id_usuario":"'+id_usuario+'"}';
    jsonData = JSON.parse(jsonData);
    app.request.setup({
        headers: {
          "apikey" : localStorage.getItem('apikey')
        },
        beforeSend: function () {
          app.preloader.show();
            //do something before every request sent
        },
        complete: function(){
          app.preloader.hide();
        },
        timeout : 5000
    });
    app.request.postJSON(URL_WS+'movimiento', jsonData , function (data) {
      var mes = $$('#mes_financiera').val();
      var a = $$('#anio_financiera').val();
      refreshFinanciera(mes,a); 
    });
  });

  $$('#btn_guardar_ingreso_variable').on('click', function () {
    var tipo = localStorage.getItem('tipo_movimiento');
    var mes = $$('#mes_financiera').val();
    var anio = $$('#anio_financiera').val();
    var etiqueta = $$('#etiqueta_iv').val();
    var cantidad = $$('#cantidad_iv').val();
    var id_usuario =localStorage.getItem('userid');
    var jsonData = '{"tipo":"'+tipo+'","mes":"'+mes+'","anio":"'+anio+'","etiqueta":"'+etiqueta+'","cantidad":"'+cantidad+'","id_usuario":"'+id_usuario+'"}';
    jsonData = JSON.parse(jsonData);
    app.request.setup({
        headers: {
          "apikey" : localStorage.getItem('apikey')
        },
        beforeSend: function () {
          app.preloader.show();
            //do something before every request sent
        },
        complete: function(){
          app.preloader.hide();
        },
        timeout : 5000
    });
    app.request.postJSON(URL_WS+'movimiento', jsonData , function (data) {
      var mes = $$('#mes_financiera').val();
      var a = $$('#anio_financiera').val();
      refreshFinanciera(mes,a); 
    });
  });

  $$('#btn_guardar_ingreso_fijo').on('click', function () {
    var tipo = localStorage.getItem('tipo_movimiento');
    var mes = $$('#mes_financiera').val();
    var anio = $$('#anio_financiera').val();
    var etiqueta = $$('#etiqueta_if').val();
    var cantidad = $$('#cantidad_if').val();
    var id_usuario =localStorage.getItem('userid');
    var jsonData = '{"tipo":"'+tipo+'","mes":"'+mes+'","anio":"'+anio+'","etiqueta":"'+etiqueta+'","cantidad":"'+cantidad+'","id_usuario":"'+id_usuario+'"}';
    jsonData = JSON.parse(jsonData);
    app.request.setup({
        headers: {
          "apikey" : localStorage.getItem('apikey')
        },
        beforeSend: function () {
          app.preloader.show();
            //do something before every request sent
        },
        complete: function(){
          app.preloader.hide();
        },
        timeout : 5000
    });
    app.request.postJSON(URL_WS+'movimiento', jsonData , function (data) {
      var mes = $$('#mes_financiera').val();
      var a = $$('#anio_financiera').val();
      refreshFinanciera(mes,a); 
    });
  });

  $$('#anio_financiera').on('change', function () {
    var mes = $$('#mes_financiera').val();
    var a = $$('#anio_financiera').val();
    refreshFinanciera(mes,a); 
  });

  $$('#mes_financiera').on('change', function () {
    var mes = $$('#mes_financiera').val();
    var a = $$('#anio_financiera').val();
    refreshFinanciera(mes,a); 
  });
  $$(document).on("click","#btn_nuevo_gf",function(e) {
    localStorage.setItem('tipo_movimiento',1);
  });
  $$(document).on("click","#btn_nuevo_gv",function(e) {
    localStorage.setItem('tipo_movimiento',2);
  });
  $$(document).on("click","#btn_nuevo_if",function(e) {
    localStorage.setItem('tipo_movimiento',3);
  });
  $$(document).on("click","#btn_nuevo_iv",function(e) {
    localStorage.setItem('tipo_movimiento',4);
  });
});
$$(document).on('page:init', '.page[data-name="recordatorios"]', function (e) {
  var calendar = app.calendar.create({
      inputEl: '#calendar-input'
  });
  var pickerDescribe = app.picker.create({
      inputEl: '#demo-picker-describe',
        rotateEffect: true,
        cols: [
          {
            textAlign: 'left',
            values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23').split(' ')
          },
          {
            values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
          },
        ],
        on: {
        close: function () {

        }
      }
    });
  $$(document).on("click","#btn_guardar_recordatorio",function(e) {
    e.preventDefault();
    var calendarName = 'ZombieApp';
    var title = $$('#input_nombre_recordatorio').val();
    var notes = $$('#input_descripcion_recordatorio').val();
    var startDate = $$('#calendar-input').val();
    var array = startDate.split("-");
    var anio = array[0];
    var mes = array[1]-1;
    var dia = array[2];

    var hora_s = $('#demo-picker-describe').val();
    var array = hora_s.split(" ");

    var hora = array[0];
    var minuto = array[1];
    var segundo = 0;

    var startDate = new Date(anio,mes,dia,hora,minuto,segundo); 
    var endDate = new Date(anio,mes,dia,23,59,59); 
    var eventLocation = "";

    var success = function(message) { 
      app.dialog.alert("El evento fue creado correctamente", "Éxito");
    };
    var error = function(message) { 
      app.dialog.alert(message, "Error");
    };
  
    var createCalOptions = window.plugins.calendar.getCreateCalendarOptions();
    createCalOptions.calendarName = calendarName;
    window.plugins.calendar.createEventInteractivelyWithOptions(title,eventLocation,notes,startDate,endDate,createCalOptions,success,error);
  });

  $$(document).on("click","#btn_abrir_calendario",function(e) {
    e.preventDefault();
    window.plugins.calendar.openCalendar();
  });
});
$$(document).on('page:init', '.page[data-name="configuracion"]', function (e) {

    if(localStorage.getItem('avatar')==URL_WS+'null'){

    }else{
      $$('#avatar').attr('src',localStorage.getItem('avatar'));
    }
    if(localStorage.getItem('recordatoriomanana')){
      $$('#togglemananas input').prop('checked', true);
      $$('#hora_manana').css('visibility','visible');
    }else{
      $$('#togglemananas input').prop('checked', false);
      $$('#hora_manana').css('visibility','hidden');
    }


    if(localStorage.getItem('recordatoriotardes')){
      $$('#toggletardes input').prop('checked', true);
      $$('#hora_tarde').css('visibility','visible');
    }else{
      $$('#toggletardes input').prop('checked', false);
      $$('#hora_tarde').css('visibility','hidden');
    }

    if(localStorage.getItem('horarecordatoriomanana')){
      $$('#demo-picker-describe').val(localStorage.getItem('horarecordatoriomanana')) ;
    }

    if(localStorage.getItem('horarecordatoriotarde')){
      $$('#demo-picker-describe2').val(localStorage.getItem('horarecordatoriotarde')) ;
    }

    $$('#correo').html(localStorage.getItem('correo')); 

    $$('#rotar').on('click', function (e) {
      e.preventDefault();
      var c = document.getElementById("myCanvas");
      var ctx = c.getContext("2d");
      ctx.rotate(1 * Math.PI / 90);
    });
    
    $$('#input_avatar').on('change', function (e) {
      var preview = document.getElementById('vista_previa');
      var file    = document.querySelector('input[type=file]').files[0];
      var reader  = new FileReader();

      reader.onloadend = function () {
        $$('#vista_previa').show();
        preview.src = reader.result;
        $$('#guardarAvatar').show();
        $$('#valor_imagen').val(reader.result);
      }
      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
      }
    });


    $$('#guardarAvatar').on('click', function (e) {
      var id_usuario = localStorage.getItem('userid');
      var valor_imagen = $$('#valor_imagen').val();
      var jsonData = '{"id_usuario":"'+id_usuario+'","avatar":"'+valor_imagen+'"}';
      jsonData = JSON.parse(jsonData);
      app.request.setup({
          headers: {
            "apikey" : localStorage.getItem('apikey')
          },
          beforeSend: function () {
            app.preloader.show();
          },
          complete: function(){
            app.preloader.hide();
          },
          timeout : 5000
      });
      app.request.postJSON(URL_WS+'cambiaravatar', jsonData , function (data) {
        $$('#valor_imagen').hide();
        $$('#vista_previa').hide();
        $$('#avatar').attr('src',data.url);
        $$('#guardarAvatar').hide();
        $$('#parrafoinput').hide();
        localStorage.setItem('avatar', data.url);
      });
    });



    var toggle = app.toggle.create({
      el: '#togglemananas',
      on: {
        change: function () {
          if(this.checked==true){
            $$('#hora_manana').css('visibility','visible');
            localStorage.setItem('recordatoriomanana', 'true');
            localStorage.removeItem('horarecordatoriomanana');
          }else{
            localStorage.removeItem('recordatoriomanana');
            $$('#hora_manana').css('visibility','hidden');
            cordova.plugins.notification.local.cancel(1, function() {
              app.dialog.alert('Recordatorio apagado');
            });
          }
        }
      }
    })
    var toggle = app.toggle.create({
      el: '#toggletardes',
      on: {
        change: function () {
          if(this.checked==true){
            $$('#hora_tarde').css('visibility','visible');
            localStorage.setItem('recordatoriotardes', 'true');
          }else{
            localStorage.removeItem('recordatoriotardes');
            localStorage.removeItem('horarecordatoriotarde');
            $$('#hora_tarde').css('visibility','hidden');
            cordova.plugins.notification.local.cancel(2, function() {
              app.dialog.alert('Recordatorio apagado');
            });
          }
        }
      }
    })


    var pickerDescribe = app.picker.create({
      inputEl: '#demo-picker-describe',
        rotateEffect: true,
        cols: [
          {
            textAlign: 'left',
            values: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ')
          },
          {
            values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
          },
        ],
        on: {
        close: function () {
          localStorage.setItem('horarecordatoriomanana',$$('#demo-picker-describe').val());
          var horario = $$('#demo-picker-describe').val().split(' ');
          var hora = parseInt(horario[0]);
          var minuto = parseInt(horario[1]);
          var year = new Date().getFullYear();
          var month = new Date().getMonth();
          var day = new Date().getDate();
          var time1 = time1 = new Date(year, month, day, 0, 0, 0, 0);
          var notificationTime = {
            id: 1,
            title: "Recordatorio",
            text: "Recuerda cumplir con tus tareas diarias",
            at: time1,
            trigger: {
                every: {
                    hour: hora,
                    minute: minuto
                }

            }
          }
          cordova.plugins.notification.local.schedule(notificationTime);
        }
      }
    });
    var pickerDescribe2 = app.picker.create({
      inputEl: '#demo-picker-describe2',
        rotateEffect: true,
        cols: [
          {
            textAlign: 'left',
            values: ('13 14 15 16 17 18 19 20 21 22 23').split(' ')
          },
          {
            values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
          },
        ],
        on:{
          close: function(){
            localStorage.setItem('horarecordatoriotarde',$$('#demo-picker-describe2').val());
            var horario = $$('#demo-picker-describe2').val().split(' ');
            var hora = parseInt(horario[0]);
            var minuto = parseInt(horario[1]);
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var day = new Date().getDate();

            var time1 = time1 = new Date(year, month, day, 0, 0, 0, 0);
            var notificationTime = {
              id: 1,
              title: "Recordatorio",
              text: "¿Lograste cumplir con tus tareas diarias?",
              at: time1,
              trigger: {
                  every: {
                      hour: hora,
                      minute: minuto
                  }
                /*every: 'minute'*/
              }
            }

            cordova.plugins.notification.local.schedule(notificationTime);
            cordova.plugins.notification.local.on('click', function (notification, eopts) { 
              app.views.main.router.navigate('/tareasdiarias/', {reloadCurrent: false});
            });
          }
        }
    });

});

$$(document).on('click', '#logout', function (e) {
	localStorage.clear();
	window.location.reload();
});

/* 
var correo = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  app.request.setup({
    headers: {
      "correo" : correo,
      "password" : password
    },
    beforeSend: function () {
      app.preloader.show();
        //do something before every request sent
    },
    complete: function(){
      app.preloader.hide();
    },
    timeout : 5000
  });
  app.request.postJSON(
    URL_WS+'login',
    function (data) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('apikey', data[0].apikey);
      localStorage.setItem('userid', data[0].user_id);
      localStorage.setItem('avatar', data[0].avatar);
      localStorage.setItem('correo', data[0].correo);
      app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    },function(data){
      app.preloader.hide();
      app.dialog.alert('Error: Datos incorrectos');
    }
*/



$$(document).on('page:init', '.page[data-name="tareasdiarias"]', function (e) {
  app.request.setup({
    headers: {
      "apikey" : localStorage.getItem('apikey')
    },
    beforeSend: function () {
      app.preloader.show();
    },
    complete: function(){
      app.preloader.hide();
    },
    timeout : 15000
  });
  app.request.get(URL_WS+'avance_usuario/'+localStorage.getItem('userid'), function (data) {
    var metas = data.array_no_revisadas;
    var output = '';
    metas.forEach(function(v,i){
      output += '<div class="card"><div class="card-header">'+v.tarea+'</div><div class="card-content"><p class="tac">'+v.ambito+'</p><p class="tac">¿Lograste hacer esta tarea el día de hoy?</p><div class="w50"><a href="#" class="lograda" data-info="'+v.tarea+'|'+localStorage.getItem('userid')+'"><i class="material-icons">check</i></a></div><div class="w50"><a href="#" class="no_lograda" data-info="'+v.tarea+'|'+localStorage.getItem('userid')+'"><i class="material-icons">close</i></a></div></div><div class="card-footer">'+v.meta+'</div></div>';
    });
    $$('#content_tareas').html(output);
    $$('.no_lograda').on('click', function (e) {
      e.preventDefault();

    }); 
    $$('.lograda').on('click', function (e) {
      e.preventDefault();
      var jsonData = '{"info":"'+$$(this).attr('data-info')+'"}';
      jsonData = JSON.parse(jsonData);
      app.request.setup({
          headers: {
            "apikey" : localStorage.getItem('apikey')
          },
          beforeSend: function () {
            app.preloader.show();
          },
          complete: function(){
            app.preloader.hide();
          },
          timeout : 5000
      });
      app.request.postJSON(URL_WS+'lograrmeta', jsonData , function (data) {
        console.log(data);
      });
    }); 
  },
  'json');
});


$$('#my-login-screen .login-button').on('click', function () {
  var correo = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();
  app.request.setup({
    headers: {
      "correo" : correo,
      "password" : password
    },
    beforeSend: function () {
      app.preloader.show();
        //do something before every request sent
    },
    complete: function(){
      app.preloader.hide();
    },
    timeout : 5000
  });  
  app.request.postJSON(
    URL_WS+'login',
    function (data) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('apikey', data[0].apikey);
      localStorage.setItem('userid', data[0].user_id);
      localStorage.setItem('avatar', URL_WS+data[0].avatar);
      localStorage.setItem('correo', data[0].correo);
      app.loginScreen.close('#my-login-screen');
      app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    },function(data){
      app.preloader.hide();
      app.dialog.alert('Error: Datos incorrectos');
    });

});