import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jipsa-server-production.up.railway.app',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function checkNickname(nickname) {
  return api.get(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`)
}

export function signup(email, password, nickname) {
  return api.post('/api/auth/signup', { email, password, nickname })
}

export function login(email, password) {
  return api.post('/api/auth/login', { email, password })
}

export function getMe() {
  return api.get('/api/member/me')
}

export function updateGuideStep(type, step) {
  return api.put('/api/member/guide-step', { type, step })
}

export function updateAssetProfileDB(assetProfile) {
  return api.put('/api/member/asset', { assetProfile: JSON.stringify(assetProfile) })
}

export function updateAge(age) {
  return api.put('/api/member/age', { age })
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
