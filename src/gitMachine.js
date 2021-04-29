import { Machine, assign } from 'xstate'


const dataOfCatalogo = async(ctx, event) => {

  const { data, model } = event
  
  const token = localStorage.getItem("traduceloToken")

  const responseData = await Promise.resolve(

      fetch(`https://quiet-castle-61424.herokuapp.com/api/v1/catalog/product/${model}`, {
        method: "PATCH",
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inglesDesc: data })

      })
      .then(res => res.json())
      .then(res => {
        return res.message.ok
      })
  )

  return responseData


}

const loginData = async(ctx, event) => {

  const { email, password } = event.data 
  
  const responseData = await Promise.resolve(
        
      fetch('https://quiet-castle-61424.herokuapp.com/api/v1/user/login', {
        method: "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      })
      .then(res => res.json())
      .then(res => {
          const { login } = res
            localStorage.setItem('traduceloToken', login.token)
            
          return login.token
      })

    ).then(res => console.log(res))

    return responseData

}

const getData = async(ctx, event) => {
  
  const response = await Promise.resolve(
    fetch(`https://quiet-castle-61424.herokuapp.com/api/v1/catalog/product/${event.data}`, {
      method: "GET",
      headers:{
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(res => res.message)
    
  ).then(res => {
    let inglesDesc  
    
    res.map(item => {
      if(typeof item.inglesDesc === 'undefined'){
          inglesDesc = "no hay descripción disponible"

        }else if(typeof item.inglesDesc !== 'undefined'){
          inglesDesc = item.inglesDesc
        }
        
    })
    
    return inglesDesc
    
  })

  return response

}

const gitMachine = Machine({
  id: "tiendaVirtual",
  initial: "iddle",
  context: {
    data: {},
    modelData: {}
  },
  states: {
    iddle: {},
    UpdateData: {
      invoke: {
        src: dataOfCatalogo,
        onDone: {
          target: "Updatesuccess",
          actions: assign({
            data: (ctx, event) => event.data
          })
        },
        onError: {
          target: "error",
          actions: assign({
              error: (ctx, event) => event.data
          })
        }
      }
    },
    login: {
      invoke: {
        src: loginData,
        onDone: {
          target: 'success',
          actions: assign({
            login: (ctx, event) => event.data
          })
        },
        onError: {
          target: "error",
          actions: assign({
            error: (ctx, event) => event.data
          })
        }

      }
    },
    getInglesDesc: {
      invoke: {
        src: getData,
        onDone: {
          target: "success",
          actions: assign({
            modelData: (ctx, event) => event.data
          })
        },
        onError: {
          target: "error"
        }
      }
    },
    success: {},
    error: {},
    Updatesuccess: {}

  },
  on: {
    UPDATE_DATA: 'UpdateData',
    LOGIN: 'login',
    GET_DATA: 'getInglesDesc'
  }
  
})

export default gitMachine