import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function signup(email, password, nickname) {
  return api.post('/api/auth/signup', { email, password, nickname })
}

export function login(email, password) {
  return api.post('/api/auth/login', { email, password })
}

export function getCheckedItems() {
  return api.get('/api/checklist')
}

export function toggleChecklistItem(itemId) {
  return api.post(`/api/checklist/${itemId}/toggle`)
}
