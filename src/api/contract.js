import axios from 'axios'

const api = axios.create({ baseURL: 'https://jipsa-server-production.up.railway.app' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getContracts() {
  return api.get('/api/contracts')
}

export function createContract(data) {
  return api.post('/api/contracts', data)
}

export function updateContract(id, data) {
  return api.put(`/api/contracts/${id}`, data)
}

export function deleteContract(id) {
  return api.delete(`/api/contracts/${id}`)
}
