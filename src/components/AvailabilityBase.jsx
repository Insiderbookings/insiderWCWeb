import * as React from 'react'
import { apiSearchAvailability } from '../api/client'
import { useNavigate } from 'react-router-dom'

const todayISO = () => new Date().toISOString().slice(0,10)
const addDaysISO = (d) => new Date(Date.now()+d*86400000).toISOString().slice(0,10)

export default function AvailabilityBase({ children }) {
  const navigate = useNavigate()
  const [form, setForm] = React.useState({
    checkIn: todayISO(),
    checkOut: addDaysISO(2),
    adults: 2,
    children: 0,
    currency: 'EUR',
    language: 'en',
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [options, setOptions] = React.useState([])

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  async function runSearch(e) {
    if (e) e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await apiSearchAvailability(form)
      setOptions(Array.isArray(res?.options) ? res.options : [])
    } catch (e) {
      setError(e?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { runSearch() }, [])

  const priceLabel = (opt) => {
    const n = Number(opt.priceUser ?? opt.price)
    if (!Number.isFinite(n)) return '—'
    const curr = (opt.currency || 'EUR').toUpperCase()
    return `${curr} ${n.toFixed(2)}`
  }

  const goBook = (opt) => {
    const params = new URLSearchParams()
    params.set('optionRefId', opt.rateKey)
    params.set('ci', form.checkIn)
    params.set('co', form.checkOut)
    if (opt.hotelCode) params.set('hotel', opt.hotelCode)
    navigate(`/book?${params}`)
  }

  return children({ form, onChange, runSearch, loading, error, options, priceLabel, goBook })
}

