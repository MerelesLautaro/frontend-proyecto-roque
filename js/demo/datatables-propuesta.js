$(document).ready(async function () {
    await traerPropuestas();
    $('#dataTable').DataTable();
  
    $('#dataTable').on('click', 'button.delete-btn', function () {
      const propuestaId = $(this).data('propuesta-id');
      eliminarPropuesta(propuestaId);
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
      event.preventDefault();
      const propuestaId = $(this).data('propuesta-id');
      findPropuesta(propuestaId);
    });
  });
  
  async function traerPropuestas() {
    try {
      const request = await fetch('http://localhost:8080/propuesta', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener las propuestas');
      }
  
      const propuestas = await request.json();
  
      const tableBody = document.querySelector('#dataTable tbody');

      tableBody.innerHTML = '';

      propuestas.forEach(propuesta => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${propuesta.id}</td>
          <td class="propuesta-nombre">${propuesta.nombre_propuesta}</td>
          <td style="display: flex; width: 230px">
            <form name="delete"><!-- Llama al Servelets encargado de eliminar -->
              <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-propuesta-id="${propuesta.id}" style="background-color: red; margin-right: 5px">
                <i class="fas fa-solid fa-trash"></i> Eliminar
              </button>
              <input type="hidden" name="id">
            </form>
            <form name="edit"><!-- Llama al Servelets encargado de editar -->
              <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-propuesta-id="${propuesta.id}" style="margin-left: 5px">
                <i class="fas fa-pencil-alt"></i> Editar
              </button>
              <input type="hidden" name="id">
            </form>
          </td>
        `;
        tableBody.appendChild(newRow);
      });
  
    } catch (error) {
      console.error(error);
    }
  }
  
  async function eliminarPropuesta(propuestaId) {
    try {
      const response = await fetch(`http://localhost:8080/propuesta/eliminar/${propuestaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      await traerPropuestas();
    } catch (error) {
      console.error(error);
    }
  }
  
  async function crearPropuesta() {
    try {
      let datos = {};
      datos.nombre_propuesta = document.getElementById('txtNombrePropuesta').value;
  
      const request = await fetch('http://localhost:8080/propuesta/crear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      await traerPropuestas();
  
      const propuesta = await request.json();
  
    } catch (error) {
      console.error(error);
    }
  }
  
  async function findPropuesta(propuestaId) {
    try {
      const request = await fetch(`http://localhost:8080/propuesta/${propuestaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener la propuesta');
      }
  
      const propuestaSeleccionado = await request.json();
      document.getElementById('txtIdPropuesta').value = propuestaId;
      document.getElementById('txtNombrePropuesta').value = propuestaSeleccionado.nombre_propuesta;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function editarPropuesta() {
    try {
      let datosPropuesta = {};
      datosPropuesta.id = document.getElementById('txtIdPropuesta').value;
      datosPropuesta.nombre_propuesta = document.getElementById('txtNombrePropuesta').value;
  
      const response = await fetch(`http://localhost:8080/propuesta/editar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPropuesta)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar el rol');
      }
  
      await traerPropuestas(); 
    } catch (error) {
      console.error(error);
    }
  }
  
  