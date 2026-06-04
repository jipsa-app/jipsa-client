import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jipsa-server-production.up.railway.app',
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

export function updateNickname(nickname) {
  return api.put('/api/auth/nickname', { nickname })
}

export function updatePassword(currentPassword, newPassword) {
  return api.put('/api/auth/password', { currentPassword, newPassword })
}

export function withdraw() {
  return api.delete('/api/auth/withdraw')
}

export function getCheckedItems() {
  return api.get('/api/checklist')
}

export function toggleChecklistItem(itemId) {
  return api.post(`/api/checklist/${itemId}/toggle`)
}
