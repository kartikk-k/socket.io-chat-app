import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useRouter } from 'next/router'
import names from 'random-names-generator'


// initialize socket connection endpoint
const socket = io('http://localhost:8080/room')

// generating random username
const username = names.random()

export default function GroupChat() {
    let router = useRouter()
    const { id } = router.query
    const roomId = id as string

    const [message, setMessage] = useState<string>('')
    const [chats, setChats] = useState<{ roomId: string, message: string, username: string }[]>([])

    // connect to room socket
    useEffect(() => {
        if (!id) return
        socket.emit('joinRoom', id)
    }, [id])


    // listen for new message
    useEffect(() => {
        socket.on('message', (payload) => {
            setChats((prevChats) => [...prevChats, payload]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    // handles form submit
    const handleSubmit = (e: any) => {
        e.preventDefault()

        // avoid senfding empty message
        if (message.trim() === '') return

        // emit message to server
        socket.emit('message', { roomId, message, username })

        // clear input for new message
        setMessage('')
    }

    return (
        <div className='w-screen h-screen flex flex-col gap-4 items-center justify-center'>
            <h1>Chat App - socket.io</h1>
            <p>Room no: {id}</p>

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
