import React, { useEffect, useState } from 'react'
import '../../App.css'

const Home: React.FC = () => {
  const [uuid, setUuid] = useState('')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [socket, setSocket] = useState(null as WebSocket | null)

  const [users, setUsers] = useState(
    [] as { name: string; status: string; uuid: string; email: string }[],
  )

  useEffect(() => {
    checkUserLogin()
  }, [])

  const checkUserLogin = () => {
    setUuid(localStorage.getItem('uuid') || '')
    setName(localStorage.getItem('name') || '')
    setToken(localStorage.getItem('token') || '')

    if (localStorage.getItem('token') === '') {
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
      console.log('Websocket connection established', res)
      setSocket(ws)
    }

    ws.onerror = function (event) {
      console.log('WebSocket error:', event)
    }

    ws.onclose = function () {
      console.log('WebSocket connection closed')
    }

    ws.onmessage = function (event) {
      const message = event.data
      const data: any = JSON.parse(message)
      if (data?.action === 'user-online') {
        setUsers(data?.users)
      }
    }
  }

  const sendMessage = () => {
    const message = {
      sender: localStorage.getItem('uuid'),
      recipient: 'Gembul UUID', // Replace with the recipient's name (e.g., 'gembul')
      content: 'Hello, Gembul!', // Replace with the desired message content
    }
    socket?.send(JSON.stringify(message))
    // } else {
    //   console.log('WebSocket connection not open')
    // }
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
            <div className="ml-2 font-bold text-2xl">QuickChat</div>
          </div>

          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">Online Users</span>
            </div>
            <div className="flex flex-col mt-4">
              {users.map((item, index) => {
                return item.uuid !== uuid ? (
                  <button
                    onClick={sendMessage}
                    key={index}
                    className="flex flex-row items-center bg-gray-100 hover:bg-gray-100 rounded-xl p-2 my-2"
                  >
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1624669240815-815a23372f37?"
                        alt="baby with headphones"
                        className="w-10 h-10 rounded-full object-cover"
                      />
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
                  </button>
                ) : null
              })}
            </div>
            <div className="flex flex-row items-center justify-between text-xs mt-6">
              <span className="font-bold">Archived</span>
            </div>
            <div className="flex flex-col">
              <button className="flex flex-row items-center bg-gray-100 hover:bg-gray-100 rounded-xl p-2 my-2">
                <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                  H
                </div>
                <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>Hey How are you today?</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Vel ipsa commodi illum saepe numquam maxime
                          asperiores voluptate sit, minima perspiciatis.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <div>I'm ok what about you?</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <div>
                          Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>Lorem ipsum dolor sit amet !</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-6 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <div>
                          Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                        </div>
                        <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                          Seen
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Perspiciatis, in.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-start-1 col-end-8 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        A
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div className="flex flex-row items-center">
                          <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-800 rounded-full h-8 w-10">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </button>
                          <div className="flex flex-row items-center space-x-px ml-4">
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-4 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-12 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-6 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-5 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-4 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-3 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-10 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-1 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-1 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-8 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-2 w-1 bg-gray-500 rounded-lg"></div>
                            <div className="h-4 w-1 bg-gray-500 rounded-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div className="flex-grow">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="flex w-full border rounded-xl focus:outline-none bg-slate-100 focus:border-indigo-300 pl-4 h-10"
                  />
                </div>
              </div>
              <div className="ml-4">
                <button className="flex items-center justify-center bg-gray-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
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
      </div>
    </div>
  ) : null
}

export default Home
