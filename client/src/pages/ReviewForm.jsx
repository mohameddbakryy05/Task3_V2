
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  courseCode: '',
  rating: 5,
  comment: ''
}

export default function ReviewForm() {
  const nav = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // TODO 3: Load the review when editing
  useEffect(() => {
    if (!id) return

    async function loadReview() {
      try {
        const res = await api.get('/reviews/' + id)
        const review = res.data.review ?? res.data

        setForm({
          courseCode: review.courseCode,
          rating: Number(review.rating),
          comment: review.comment || ''
        })
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          'Failed to load review'
        )
      }
    }

    loadReview()
  }, [id])

  // TODO 1: Update form when an input changes
  function onChange(e) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: name === 'rating'
        ? Number(value)
        : value
    }))
  }

  // TODO 2 and 3: Create or update a review
  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const data = {
        courseCode: form.courseCode,
        rating: form.rating,
        comment: form.comment
      }

      if (id) {
        await api.patch('/reviews/' + id, data)
      } else {
        await api.post('/reviews', data)
      }

      nav('/reviews')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to save review'
      )
    }
  }

  // TODO 4: Delete a review
  async function onDelete() {
    if (!window.confirm(
      'Are you sure you want to delete this review?'
    )) {
      return
    }

    setError('')

    try {
      await api.delete('/reviews/' + id)
      nav('/reviews')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to delete review'
      )
    }
  }

  return (
    <div className="max-w-lg mx-auto card">

      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'Write'} Review
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">

        {/* Course Code */}
        <div>
          <label>Course Code</label>
          <input
            className="input"
            type="text"
            name="courseCode"
            placeholder="e.g. CS101"
            value={form.courseCode}
            onChange={onChange}
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label>Rating</label>
          <select
            className="input"
            name="rating"
            value={form.rating}
            onChange={onChange}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        {/* Comment */}
        <div>
          <label>Comment (optional)</label>
          <textarea
            className="input"
            name="comment"
            placeholder="Write your review..."
            value={form.comment}
            onChange={onChange}
            rows={4}
          />
        </div>

        {/* Server error */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Save and Delete buttons */}
        <div className="flex gap-2">

          <button className="btn" type="submit">
            Save
          </button>

          {id && (
            <button
              className="btn"
              type="button"
              onClick={onDelete}
            >
              Delete
            </button>
          )}

        </div>

      </form>
    </div>
  )
}
