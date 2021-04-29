import './App.css';

import Login from './Login'
import { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react'
import gitMachine from './gitMachine'


const TraslateHook = ({ model }) => {

  const [ inglesDesc, setInglesDesc ] = useState(undefined)
  const [ state, send ] = useMachine(gitMachine)

  const { modelData } = state.context

  useEffect(() => {
    send("GET_DATA", { data: model })
  },[model, send])

  const handledSendData = () => {
    send("UPDATE_DATA", { data: inglesDesc, model: model  })
  }
  
  return (
    <div className="textArea">
      <textarea onChange={(e) => setInglesDesc(e.target.value) } value={inglesDesc} defaultValue={state.matches('success') ? modelData.toString() : null } />
      { state.matches("Updatesuccess") ? null : <button onClick={handledSendData}>Enviar</button> }
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
          <Login />
          <div className="contendor bg-title">
              <span>modelo</span>
              <span>Descripción</span>
              <span>Agrega Traducción</span>  
            </div>
                    { 
            loading && (
              Object.values(payload).map(( item ) => {
                  return (
                  <div className="contendor">
                    <span>{item.model}</span>
                    <span>{item.desc}</span>
                    <span>{<TraslateHook model={item.model} />}</span>  
                  </div>
                  )
              })
            )
          }
        
      </header>
    </div>
  );
}

export default App;
