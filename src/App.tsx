import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './page/Home/Home'
import Login from './page/Login/Login'
import Register from './page/Register/Register'

interface User {
  id: number
  name: string
}

interface Message {
  message: string
  sender?: User
}

interface Room {
  id: number
  name: string
  newMessage: string
  messages: Message[]
}

const App: React.FC = () => {
  // const qs = new URLSearchParams(window.location.search)
  // const ws = new WebSocket(
  //   'ws://localhost:8080/chat?username=' + qs.get('name'),
  // )

  // const clients = new Map()

  // ws.onopen = function (res) {
  //   console.log('WebSocket connection established', res)

  //   // Send a message
  //   // const message = {
  //   //   sender: qs.get('name'),
  //   //   recipient: 'gembul', // Replace with the recipient's name (e.g., 'gembul')
  //   //   content: 'Hello, Gembul!', // Replace with the desired message content
  //   // }
  //   // ws.send(JSON.stringify(message))
  // }

  // ws.onmessage = function (event) {
  //   const message = event.data

  //   console.log('Received messagessss:', message)
  // }

  // ws.onerror = function (event) {
  //   console.log('WebSocket error:', event)
  // }

  // ws.onclose = function () {
  //   console.log('WebSocket connection closed')
  // }

  // const sendMessage = () => {
  //   const message = {
  //     sender: qs.get('name'),
  //     recipient: 'gembul', // Replace with the recipient's name (e.g., 'gembul')
  //     content: 'Hello, Gembul!', // Replace with the desired message content
  //   }
  //   ws.send(JSON.stringify(message))
  // }

  // const [user, setUser] = useState<User>({ id: 0, name: '' })
  // const [ws, setWs] = useState<WebSocket | null>(null)
  // const [users, setUsers] = useState<User[]>([])
  // const [roomInput, setRoomInput] = useState('')
  // const [rooms, setRooms] = useState<Room[]>([])

  // const connect = () => {
  //   // Connect logic
  // }

  // const joinPrivateRoom = (user: User) => {
  //   // Join private room logic
  // }

  // const joinRoom = () => {
  //   // Join room logic
  // }

  // const leaveRoom = (room: Room) => {
  //   // Leave room logic
  // }

  // const sendMessage = (room: Room) => {
  //   // Send message logic
  // }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App
