import React, { useEffect, useState } from 'react'
import axios from 'axios'

export const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')

  const fetchValues = async () => {
    const values = await axios.get('/api/values/current')
    setValues(values.data)
  }

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get('/api/values/all')
    setSeenIndexes(seenIndexes.data)
  }

  const renderSeenIndexes = () => {
    if (!seenIndexes) return 'no data'
    if (!Array.isArray(seenIndexes)) return 'results are not array'

    return seenIndexes.map(({ number }) => number).join(', ')
  }

  const renderValues = () => {
    const entries = []

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      )
    }

    return entries
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await axios.post('/api/values', {
      index: index,
    })

    setIndex('')
  }

  useEffect(() => {
    fetchValues()
    fetchIndexes()
  }, [])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  )
}
