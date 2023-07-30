import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../../App.css'
import BaseService from '../../config/BaseService'

const Home: React.FC = () => {
  const [uuid, setUuid] = useState('')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [socket, setSocket] = useState(null as WebSocket | null)
  const [dataMessage, setDataMessage] = useState([{}] as {
    id: string
    uuid: string
    room_id: string
    sender: string
    recipient: string
    text: string
    status: string
  }[])
  const [dataNewMessage, setDataNewMessage] = useState([{}] as {
    id: string
    uuid: string
    room_id: string
    sender: string
    recipient: string
    text: string
    status: string
  }[])
  const [newMessage, setNewMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const messageListRef: any = useRef()

  const [chat, setChat] = useState({
    sender: '',
    recipient: '',
    isGroup: false,
  } as {
    sender: string
    recipient: string
    isGroup: boolean
  })

  const [users, setUsers] = useState(
    [] as { name: string; status: string; uuid: string; email: string }[],
  )
  const [joinModal, setJoinModal] = useState(false)
  const [joinRoom, setJoinRoom] = useState(
    {} as { uuid: string; name: string; type: string },
  )
  const [createRoom, setCreateRoom] = useState({ name: '', type: 'public' })
  const [rooms, setRooms] = useState(
    [] as { uuid: string; name: string; type: string }[],
  )

  useEffect(() => {
    checkUserLogin()
    getDataRoom()
    checkMessageInLocal()
  }, [dataMessage])

  const checkUserLogin = () => {
    setUuid(localStorage.getItem('uuid') || '')
    setName(localStorage.getItem('name') || '')
    setToken(localStorage.getItem('token') || '')

    if (localStorage.getItem('token') === null) {
      window.location.replace('/login')
    } else {
      connectWebsocket()
    }
  }

  var ws: WebSocket | null = null
  const connectWebsocket = () => {
    ws = new WebSocket(
      'ws://localhost:3000/message?chat=' + localStorage.getItem('uuid'),
    )

    ws.onopen = function (res) {
      //console.log('Websocket connection established', res)
      setSocket(ws)
    }

    ws.onerror = function (event) {
      //console.log('WebSocket error:', event)
    }

    ws.onclose = function () {
      console.log('WebSocket connection closed')
    }

    ws.onmessage = function (event) {
      const message = event.data
      const data: any = JSON.parse(message)

      if (data?.action === 'user-online') {
        setUsers(data?.users)
      } else if (data?.action === 'send-message') {
        const msg = {
          id: data?.id,
          uuid: data?.uuid,
          room_id: '',
          sender: data?.sender,
          recipient: data?.recipient,
          text: data?.message,
          status: data?.status,
        }
        //console.log('data', dataMessage)
        handleNewMessage(msg)
      } else if (data?.action === 'send-group-message') {
        console.log('data', data)
      }
    }
  }

  const checkMessageInLocal = () => {
    var local = localStorage.getItem('chat') || ''
    if (local !== '') {
      var dataLocal = JSON.parse(local)

      setDataNewMessage(dataLocal)
    } else {
      setDataNewMessage([])
    }
  }

  const handleNewMessage = useCallback(
    (message: any) => {
      setDataMessage([...dataMessage, message])

      if (chat.sender !== message.recipient) {
        var local = localStorage.getItem('chat') || ''

        if (local === '') {
          var data = JSON.stringify([message])
          localStorage.setItem('chat', data)
          //setDataNewMessage([message])
        } else {
          var dataLocal = JSON.parse(local)
          var newData = [...dataLocal, message]
          var data = JSON.stringify(newData)
          localStorage.setItem('chat', data)
          //setDataNewMessage(newData)
        }
      }

      // var data = JSON.stringify([...dataLocal, message])
      //
      setTimeout(() => {
        scrollMessageListToBottom()
      }, 1000)
      //console.log('data 1', dataMessage)
    },
    [dataMessage],
  )

  const handleMessageChange = (event: any) => {
    setNewMessage(event.target.value)
  }

  const scrollMessageListToBottom = () => {
    if (messageListRef.current) {
      //console.log('data')
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
    // else {
    //   console.log('loh')
    // }
  }

  const sendMessage = () => {
    if (newMessage !== '') {
      var message: any = {}
      var data: any = {}
      if (chat.isGroup) {
        message = {
          action: 'send-group-message',
          //sender: sender,
          room_id: chat.recipient,
          sender: chat.sender,
          recipient: '', // Replace with the recipient's name (e.g., 'gembul')
          message: newMessage, // Replace with the desired message content
        }
        data = {
          id: '',
          uuid: '',
          room_id: message?.recipient,
          sender: message.sender,
          recipient: '',
          text: newMessage,
          status: 'not_sent',
        }
      } else {
        message = {
          action: 'send-message',
          //sender: sender,
          sender: chat.sender,
          recipient: chat.recipient, // Replace with the recipient's name (e.g., 'gembul')
          message: newMessage, // Replace with the desired message content
        }
        data = {
          id: '',
          uuid: '',
          room_id: '',
          sender: message.sender,
          recipient: message.recipient,
          text: newMessage,
          status: 'not_sent',
        }
      }

      socket?.send(JSON.stringify(message))
      setNewMessage('')

      setDataMessage([...dataMessage, data])
      setTimeout(() => {
        scrollMessageListToBottom()
      }, 1000)
    }
  }

  const setData = (recipient: string) => {
    var sender = localStorage.getItem('uuid') || ''
    setDataMessage([])
    setChat({ sender: sender, recipient: recipient, isGroup: false })
    getDataChat(sender, recipient)
    const newData = dataNewMessage.filter((item) => item.sender == sender)
    setDataNewMessage(newData)
    localStorage.setItem('chat', JSON.stringify(newData))
  }

  const getDataChat = async (sender: string, recipient: string) => {
    const token = localStorage.getItem('token') || ''
    const res = BaseService(
      `v1/chat?sender=${sender}&recipient=${recipient}`,
      token,
    ).get() as Promise<{
      data: {
        id: string
        uuid: string
        room_id: string
        sender: string
        recipient: string
        text: string
        status: string
      }[]
    }>

    const data = await res
      .then((value) => {
        //console.log('data', value)
        return value.data
      })
      .catch((error) => {
        //console.log('data', error)
        return error
      })
    setDataMessage(data)
    setTimeout(() => {
      scrollMessageListToBottom()
    }, 1000)
  }

  const RenderMessageNotification = (
    dataMessage: {
      id: string
      uuid: string
      room_id: string
      sender: string
      recipient: string
      text: string
      status: string
    }[],
    uuid: string,
  ) => {
    const data = dataMessage.filter(
      (item) =>
        item.sender === uuid &&
        item.status === 'sent' &&
        item.recipient !== chat.sender,
    )
    if (data.length > 0) {
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500 ml-5">
          <span className="text-white font-bold text-sm">{data.length}</span>
        </div>
      )
    } else {
      return null
    }
  }

  const getDataRoom = async () => {
    const token = localStorage.getItem('token') || ''
    const res = BaseService(`v1/rooms`, token).get() as Promise<{
      data: { uuid: string; name: string; type: string }[]
    }>

    const data = await res
      .then((value) => {
        //console.log('data', value)
        return value.data
      })
      .catch((error) => {
        //console.log('data', error)
        return error
      })

    setRooms(data)
  }

  const handleRoomChange = (event: any) => {
    setCreateRoom({ name: event.target.value, type: createRoom.type })
  }

  const submitRoom = async () => {
    const token = localStorage.getItem('token') ?? ''

    const res = BaseService('/v1/rooms/create', token)
      .json(createRoom)
      .headers({ Authorization: 'Bearer ' + token })
      .post() as Promise<{
      data: {
        uuid: string
        name: string
        type: string
      }
    }>

    const data = await res
      .then((value) => {
        return value.data
      })
      .catch((error) => {
        return error
      })

    if (data) {
      setRooms([...rooms, data])
    }
    setShowModal(false)
  }

  const checkRoom = async (room: {
    uuid: string
    name: string
    type: string
  }) => {
    setDataMessage([])
    const token = localStorage.getItem('token') ?? ''
    const uuid = localStorage.getItem('uuid') ?? ''
    const dataPost = {
      user_id: uuid,
      room_id: room.uuid,
    }
    const res = BaseService('/v1/rooms/check', token)
      .json(dataPost)
      .headers({ Authorization: 'Bearer ' + token })
      .post() as Promise<{
      data: {
        joined: boolean
      }
    }>

    const data = await res
      .then((value) => {
        return value.data
      })
      .catch((error) => {
        return error
      })
    setJoinRoom(room)
    setChat({ recipient: room.uuid, isGroup: true } as {
      recipient: string
      sender: string
      isGroup: boolean
    })
    if (data.joined) {
    } else {
      setJoinModal(true)
    }
  }

  const userJoinRoom = async () => {
    const token = localStorage.getItem('token') ?? ''
    const uuid = localStorage.getItem('uuid') ?? ''
    const dataPost = {
      user_id: uuid,
      room_id: joinRoom.uuid,
    }
    const res = BaseService('/v1/rooms/join', token)
      .json(dataPost)
      .headers({ Authorization: 'Bearer ' + token })
      .post() as Promise<{
      data: {
        joined: boolean
      }
    }>

    const data = await res
      .then((value) => {
        return value.data
      })
      .catch((error) => {
        return error
      })

    if (data) {
      setJoinModal(false)
    }
  }

  return token ? (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div
              className="ml-2 font-bold text-2xl"
              onClick={() => setShowModal(true)}
            >
              QuickChat
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">Online Users</span>
            </div>
            <div className="flex flex-col mt-4">
              {users.map((item, index) => {
                return item.uuid !== uuid ? (
                  <button
                    onClick={() => setData(item.uuid)}
                    key={index}
                    className="flex flex-row items-center bg-gray-100 hover:bg-gray-100 rounded-xl p-2 my-2"
                  >
                    <div className="relative">
                      {/* <img
                        src="https://images.unsplash.com/photo-1624669240815-815a23372f37?"
                        alt="baby with headphones"
                        className="w-10 h-10 rounded-full object-cover"
                      /> */}
                      <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                        {item.name.charAt(0)}
                      </div>
                      <span
                        className={`absolute h-3 w-3 rounded-full  border-2 border-gray-500 top-0 right-0 ${
                          item.status === 'online'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <div className="ml-2 text-sm font-semibold">
                      {item.name}
                    </div>
                    {RenderMessageNotification(dataNewMessage, item.uuid)}
                  </button>
                ) : null
              })}
            </div>
            <div className="flex flex-row items-center justify-between text-xs mt-6">
              <span className="font-bold">Rooms</span>
              <span className="font-bold" onClick={() => setShowModal(true)}>
                Create
              </span>
            </div>
            <div className="flex flex-col">
              {rooms?.map((item, index) => {
                return (
                  <button
                    key={index}
                    className="flex flex-row items-center bg-gray-100 hover:bg-gray-100 rounded-xl p-2 my-2"
                    onClick={() => checkRoom(item)}
                  >
                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                      {item.name.charAt(0)}
                    </div>
                    <div className="ml-2 text-sm font-semibold">
                      {item.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {chat?.recipient !== '' ? (
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div
                className="flex flex-col h-full overflow-x-auto mb-4 scroll-auto"
                ref={messageListRef}
              >
                <div className="flex flex-col h-full">
                  {dataMessage?.map((item, index) => {
                    return item.sender === localStorage.getItem('uuid') ? (
                      <div
                        key={index}
                        className="col-start-6 col-end-13 p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-start flex-row-reverse">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                            A
                          </div>
                          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            <div>{item.text}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="grid grid-cols-12 gap-y-2">
                        <div className="col-start-1 col-end-8 p-3 rounded-lg">
                          <div className="flex flex-row items-center">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              A
                            </div>
                            <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                              <div>{item.text}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div className="flex-grow">
                  <div className="relative w-full">
                    <input
                      onChange={handleMessageChange}
                      type="text"
                      value={newMessage}
                      className="flex w-full border rounded-xl focus:outline-none bg-slate-100 focus:border-indigo-300 pl-4 h-10"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    className="flex items-center justify-center bg-gray-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    onClick={sendMessage}
                  >
                    <span>Send</span>
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {joinModal && (
        <div className="fixed top-0 right-0 bottom-0 left-0 bg-gray-700 bg-opacity-75 flex justify-center items-center">
          <div className="w-11/12 md:w-2/3 max-w-lg">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 text-lg font-bold tracking-normal leading-tight mb-2">
                Join Room
              </h1>
              <label
                htmlFor="name"
                className="text-gray-800 text-sm leading-tight tracking-normal"
              >
                Are you sure to join{' '}
                <span className="font-bold">{joinRoom.name}</span>
              </label>
              <div className="flex items-center justify-start w-full mt-[20px]">
                <button
                  onClick={userJoinRoom}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => setJoinModal(false)}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
              <button
                className="cursor-pointer bg-white absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                aria-label="close modal"
                role="button"
                onClick={() => setJoinModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed top-0 right-0 bottom-0 left-0 bg-gray-700 bg-opacity-75 flex justify-center items-center">
          <div className="w-11/12 md:w-2/3 max-w-lg">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 text-lg font-bold tracking-normal leading-tight mb-4">
                Create Room
              </h1>
              <label
                htmlFor="name"
                className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
              >
                Room Name
              </label>
              <input
                id="name"
                className="mb-5 mt-2 bg-white text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                placeholder={'Name'}
                onChange={handleRoomChange}
              />

              <div className="flex items-center justify-start w-full">
                <button
                  onClick={submitRoom}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
              <button
                className="cursor-pointer bg-white absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                aria-label="close modal"
                role="button"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null
}

export default Home
