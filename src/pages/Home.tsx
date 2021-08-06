import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { database } from "../services/firebase"

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [room, setRoom] = useState("")

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }
    history.push("/room/new")
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()
    if (room.trim() === "") {
      return
    }

    const roomRef = await database.ref(`rooms/${room}`).get()

    if (!roomRef.exists()) {
      alert("Room does not exists!")
      return
    }

    history.push(`/room/${roomRef.key}`)
  }

  return (
    <>
      <button onClick={handleCreateRoom}>Login Google</button>

      <form onSubmit={handleJoinRoom}>
        <input
          type="text"
          onChange={(event) => setRoom(event.target.value)}
          value={room}
        />
        <button>Entrar na sala</button>
      </form>
    </>
  )
}
