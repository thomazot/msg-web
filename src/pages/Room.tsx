import { FormEvent, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { database } from "../services/firebase"

type FirebaseQuestion = Record<
  string,
  {
    author: {
      name: string
      avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
  }
>
type Question = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
}
type RoomParams = {
  id: string
}

export function Room() {
  const params = useParams<RoomParams>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState("")
  const [newQuestion, setNewQuestion] = useState("")
  const { user } = useAuth()

  const roomId = params.id

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === "") {
      return
    }

    if (!user) {
      throw new Error("You must be logged in")
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion("")
  }

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on("value", (room) => {
      const databaseRoom = room.val()
      const firebaseQuestions =
        (databaseRoom.questions as FirebaseQuestion) ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered
          }
        }
      )

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

  return (
    <>
      {title}
      <form onSubmit={handleSendQuestion}>
        <textarea
          onChange={(event) => setNewQuestion(event.target.value)}
          value={newQuestion}
        />

        <button type="submit">Enviar pergunta</button>
      </form>
      <div>
        {questions.map((question) => (
          <div>{JSON.stringify(question)}</div>
        ))}
      </div>
    </>
  )
}
