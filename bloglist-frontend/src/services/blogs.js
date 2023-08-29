import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null

export const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(config)

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => {
    console.log(response.data) // Log the response data
    return response.data
  })
}

export const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${ baseUrl }/${id}`,config)
  console.log(response.data)
}



