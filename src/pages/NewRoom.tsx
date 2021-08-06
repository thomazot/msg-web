import { FormEvent, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "../hooks/useAuth"
import { useHistory } from "react-router-dom"

export function NewRoom() {
  const history = useHistory()
  const [room, setRoom] = useState("")
  const { user } = useAuth()

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()
    if (room.trim() === "") {
      return
    }

    const roomRef = database.ref("rooms")
    const firebaseRoom = await roomRef.push({
      title: room,
      authorId: user?.id
    })
    history.push(`/room/${firebaseRoom.key}`)
  }
  return (
    <>
      <form action="" onSubmit={handleCreateRoom}>
        <input
          type="text"
          onChange={(event) => setRoom(event.target.value)}
          value={room}
        />
        <button type="submit">criar</button>
      </form>
    </>
  )
}
