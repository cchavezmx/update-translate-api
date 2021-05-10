import './App.css';

// import Login from './Login'
import { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react'
import gitMachine from './gitMachine'

// hook de form 
import  { useForm } from 'react-hook-form'



const TraslateHook = ({ productData }) => {

  const { title, inglesTitle, desc, inglesDesc, model  } = productData
  const [ state, send ] = useMachine(gitMachine)
    
  const descriptionContent = (string) => {
    if(typeof string === "undefined" || string.length === 0){
      return "No hay descripción disponible"
    }else {
      return string
    }
  }

  const values = {
    inglesDesc: descriptionContent(inglesDesc),
    inglesTitle: descriptionContent(inglesTitle),
    title: descriptionContent(title),
    desc: descriptionContent(desc),

  }

  const { register, handleSubmit } = useForm({
    defaultValues: values
  })

  const handledSendData = (data) => {

    const payload = {
      ...data
    }

    console.log(payload, model)
    send("UPDATE_DATA", { data: payload, model: model  })

  }

  
  return (
    <div className="textArea">
      <form onSubmit={handleSubmit(handledSendData)}>
      <div className="container--translate">
        <h3>Modelo: { model }</h3>
        <div>{ state.matches("Updatesuccess") && <span className="data-save">Contenido guardado.</span>}</div>
        <div>
            <span className="ingles"><img className="bandera" src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg" alt="bandera de mexico" /></span>
            <div className="container--modulo">
              <label htmlFor="InglésTitle">Título Inglés</label>
              <input id="InglésTitle" name="InglésTitle" {...register("inglesTitle")} ></input>
              <label htmlFor="InglésDesc">Descripción Inglés</label>
              <textarea id="InglésDesc" name="InglésDesc" {...register("inglesDesc")} />
            </div>
        </div>

        <div>
            <span className="apaniol"><img className="bandera" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" alt="bandera de mexico" /></span>
            <div className="container--modulo">
              <label htmlFor="title">Título Español</label>
              <input id="title" name="title"  {...register("title")}></input>
              <label htmlFor="desc" >Descripción Español</label>
              <textarea id="desc" name="desc" {...register("desc")} />
            </div>
        </div>
          
          <button>Guardar</button>
      </div>
      </form>
    </div>
    )

}

function App() {

  const [ loading, setLoading ] = useState(false)
  const [ payload, setPayload ] = useState([])
  
  const getData = () => {
    
      fetch('https://quiet-castle-61424.herokuapp.com/api/v1/catalog/products')
      .then(res => res.json())  
      .then(res => {
        const { message } = res

        const productos = message.map(item => item)
        
        setPayload(productos)
        setLoading(true)

    })

  }
  

  useEffect(() => {
    getData()
  },[])


  return (
    <div className="App">
      <header className="App-header">
          <h1>Tradúcelo! GIT</h1>
        <div className="container--data">
          { loading && (
            payload.map( model => <TraslateHook productData={model} /> )
          )}
        </div>
        
      </header>
    </div>
  );
}

export default App;
