import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'


// initialize socket connection endpoint
const socket = io('http://localhost:8080')

// generating random username
const username = nanoid(4)

export default function Home() {

  const [message, setMessage] = useState<string>('')
  const [chats, setChats] = useState<{message: string, username: string}[]>([])

  // handles form submit
  const handleSubmit = (e: any) => {
    e.preventDefault()

    // avoid senfding empty message
    if (message.trim() === '') return

    // emit message to server
    socket.emit('chat', {message, username})

    // clear input for new message
    setMessage('')
  }

  useEffect(() => {
    socket.on('chat', (payload: {message:string, username:string}) => {
      setChats([...chats, payload])
    })

    return(() => {
      socket.off('chat')
    })
  }, [chats])

  return (
    <div className='w-screen h-screen flex flex-col gap-4 items-center justify-center'>
      <h1>Chat App - socket.io</h1>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          className='bg-gray-100 border'
          placeholder='enter chat here...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type='submit'>Enter</button>
      </form>

      <div className='w-96 space-y-1'>
        {chats.map((payload, index) => (
          <p className={`${username === payload.username ? 'text-right' : ''}`} key={index}>{payload.username} - {payload.message}</p>
        ))}
      </div>

    </div>
  )
}
