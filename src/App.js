import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import axios from "axios";


class App extends React.Component {
  state = {
    data: [],
    modalActualizar: false,
    modalInsertar: false,
    form: {
      id: "",
      nombre: "",
      direccion: "",
      nit: "",
      telefono: "",
    },
  };

  componentDidMount() {
    axios.get("https://9d6o9bh6jc.execute-api.us-east-1.amazonaws.com/empresas")
    .then(response => {
      const data = response?.data?.Items;
      this.setState({...this.state, data});
    })
  }

  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
  };

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  editar = async (dato) => {
    try {
      axios.put(`https://9d6o9bh6jc.execute-api.us-east-1.amazonaws.com/empresas`, dato);
      var arreglo = this.state.data;
      const cambio = arreglo.map((registro) => { 
        return dato.id === registro.id ? dato : registro
      });
      this.setState({ data: cambio, modalActualizar: false });
    } catch (error) {  
      window.confirm("Algo salió mal "+error); 
    }
  };

  eliminar = (dato) => {
    console.log(dato.id)
    var opcion = window.confirm("Estás Seguro que deseas eliminar la empresa? "+dato.id);
    if (opcion === true) {
      try{
        axios.delete(`https://9d6o9bh6jc.execute-api.us-east-1.amazonaws.com/empresas/`+dato.id);
        var arreglo = this.state.data;
        const data = arreglo.filter((registro) => { return registro.id !== dato.id; });
        this.setState({ data, modalActualizar: false });
      }catch(error){
        window.confirm("Algo salió mal "+error); 
      }
      
    }
  };

  insertar= async ()=>{
    var valorNuevo= {...this.state.form};
    valorNuevo.id=(this.state.data.length+1).toString();
    var lista= this.state.data;
    lista.push(valorNuevo);
    this.setState({ modalInsertar: false, data: lista });
    try {
      await axios.put(`https://9d6o9bh6jc.execute-api.us-east-1.amazonaws.com/empresas`, valorNuevo)
    } catch (error) {
      console.log(error);
    }
  }

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  render() {
    
    return (
      <>
        <Container>
        <br />
          <Button color="success" onClick={()=>this.mostrarModalInsertar()}>Crear</Button>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de la empresa</th>
                <th>Dirección</th>
                <th>Nit</th>
                <th>Telefono</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.direccion}</td>
                  <td>{dato.nit}</td>
                  <td>{dato.telefono}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >
                      Editar
                    </Button>{" "}
                    <Button color="danger" onClick={()=> this.eliminar(dato)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
           <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
               Id:
              </label>
            
              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.form.id}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Nombre de la empresa: 
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.nombre}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Dirección: 
              </label>
              <input
                className="form-control"
                name="direccion"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.direccion}
              />
            </FormGroup>

            <FormGroup>
              <label>
                NIT: 
              </label>
              <input
                className="form-control"
                name="nit"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.nit}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Telefono: 
              </label>
              <input
                className="form-control"
                name="telefono"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.telefono}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.editar(this.state.form)}
            >
              Editar
            </Button>
            <Button
              color="danger"
              onClick={() => this.cerrarModalActualizar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
           <div><h3>Insertar empresa</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Id: 
              </label>
              
              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.data.length+1}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Nombre de la empresa: 
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Dirección: 
              </label>
              <input
                className="form-control"
                name="direccion"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                NIT: 
              </label>
              <input
                className="form-control"
                name="nit"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Telefono: 
              </label>
              <input
                className="form-control"
                name="telefono"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.insertar()}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default App;
