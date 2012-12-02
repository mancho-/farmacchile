$(document).ready(function () {
	listarRegiones();
});

function listarRegiones() {
	var query = "SELECT DISTINCT  ?region " +
		"WHERE { " +
		"?s a <http://praga.ceisufro.cl/schemas/DB/Farmaciaturno>. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/region>  ?region. " +
		"}";
	drawRegiones(query);
}

function drawRegiones(q) {
	$("#content").empty();
	$("#load").show();
	$.ajax({
		dataType: 'jsonp',
		data: {
			query: q,
			format: 'application/sparql-results+json'
		},
		url: 'http://praga.ceisufro.cl/sparql',
		success: function (data) {
			var cbo = '';
			cbo += '<select id="cboRegion" name="cboRegion" style="width: 200px;" onchange="listarComunas()"><option value="-1">Seleccione. . .</option>';
			
			$(data.results.bindings).each(function (i, item) {
				cbo += '<option value="' + item.region.value + '">' + item.region.value + '</option>';
			});
			
			cbo += '</select>';
			
			$("#divRegion").html(cbo);
			$("#load").hide();
		}
	});
}

function listarComunas() {
	if ($("#cboRegion").val() == -1)
		return;
	
	var query = "SELECT DISTINCT  ?comuna " +
		"WHERE { " +
		"?s a <http://praga.ceisufro.cl/schemas/DB/Farmaciaturno>. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/comuna>  ?comuna. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/region>  ?region. " +
		"FILTER (?region =  '" + $("#cboRegion").val() + "') " +
		"} ";
	drawComunas(query);
}

function drawComunas(q) {
	$("#content").empty();
	$("#load").show();
	$.ajax({
		dataType: 'jsonp',
		data: {
			query: q,
			format: 'application/sparql-results+json'
		},
		url: 'http://praga.ceisufro.cl/sparql',
		success: function (data) {
			var cbo = '';
			cbo += '<select id="cboComuna" name="cboComuna" style="width: 200px;" onchange="listarFarmacias()"><option value="-1">Seleccione. . .</option>';
			
			$(data.results.bindings).each(function (i, item) {
				cbo += '<option value="' + item.comuna.value + '">' + ucwords(item.comuna.value) + '</option>';
			});
			
			cbo += '</select>';
			
			$("#divComuna").html(cbo);
			$("#load").hide();
		}
	});
}

function listarFarmacias() {
	if ($("#cboComuna").val() == -1)
		return;
	
	var query = "SELECT DISTINCT  * " +
		"WHERE {  " +
		"?s a <http://praga.ceisufro.cl/schemas/DB/Farmaciaturno>.  " +
		"?s <http://praga.ceisufro.cl/schemas/DB/id>  ?id. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/region>  ?region. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/comuna>  ?comuna.  " +
		"?s <http://praga.ceisufro.cl/schemas/DB/nombre_farmacia>  ?nombre_farmacia. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/direccion>  ?direccion. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/dia>  ?dia. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/mes>  ?mes. " +
		"?s <http://praga.ceisufro.cl/schemas/DB/horario_atencion>  ?horarioatencion. " +
		"FILTER (?comuna= '" + $("#cboComuna").val() + "') " +

		"}";
	
	drawFarmacias(query);
}

function drawFarmacias(q) {
	$("#content").empty();
	$("#load").show();

	$.ajax({
		dataType: 'jsonp',
		data: {
			query: q,
			format: 'application/sparql-results+json'
		},
		url: 'http://praga.ceisufro.cl/sparql',
		success: function (data) {
			// Estructura de la tabla
			var resultados = '<table>';
			resultados += '<tr>';
			resultados += '<th>Nombre</th>';
			resultados += '<th>D&iacute;a</th>';
			resultados += '<th>Mes</th>';
			resultados += '<th>Horario Atenci&oacute;n</th>';
			resultados += '<th>Direcci&oacute;n</th>';
			resultados += '</tr>';
			
			$(data.results.bindings).each(function (i, item) {
				// Filas de la tabla
				resultados += '<tr>';
				resultados += '<td>' + item.nombre_farmacia.value + '</td>';
				resultados += '<td>' + item.dia.value + '</td>';
				resultados += '<td>' + item.mes.value + '</td>';
				resultados += '<td>' + item.horarioatencion.value + '</td>';
				resultados += '<td>' + item.direccion.value + '</td>';
				resultados += '</tr>';
			});
			
			resultados += '</table>';
			
			$("#divResultados").html(resultados);
			$("#load").hide();
		}
	});
}

function ucwords(str) {
	str = (str + '').toLowerCase();
	
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
		return $1.toUpperCase();
	});
}