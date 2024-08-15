'use client'
import { useState, useContext, useEffect } from 'react'
import { Button, TextField, Card, CardContent, CardHeader, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
import { AuthContext } from 'src/context/AuthContext'
import toast from 'react-hot-toast'

export default function DeveloperForm() {
  const { user, setLoading, setUser } = useContext(AuthContext)
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [nameError, setNameError] = useState(false)
  const [dateError, setDateError] = useState(false)
  const [fileError, setFileError] = useState(false)

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      setUser(null)
      setLoading(false)
      router.push('/login')
    }
  }, [])
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNameError(!name)
    setDateError(!date)
    setFileError(!file)
    if (!file || !name || !date) return

    try {
      const accessToken = localStorage.getItem('accessToken')
      const data = new FormData()
      data.set('file', file)
      data.set('name', name)
      data.set('date', date)

      const res = await fetch('/api/create', {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${accessToken}` // Add Authorization header
        }
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('successfully created')
    } catch (e: any) {
      console.error(e)
      toast.error(e.message)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Create Developer' />
          <CardContent>
            <form onSubmit={onSubmit}>
              <TextField
                fullWidth
                label='Name'
                variant='outlined'
                value={name}
                onChange={e => setName(e.target.value)}
                error={nameError}
                helperText={nameError ? 'Please enter a name' : ''}
                sx={{ marginBottom: 4 }}
              />

              <TextField
                fullWidth
                type='date'
                label='Date'
                variant='outlined'
                InputLabelProps={{
                  shrink: true
                }}
                value={date}
                onChange={e => setDate(e.target.value)}
                error={dateError}
                helperText={dateError ? 'Please select a date' : ''}
                sx={{ marginBottom: 4 }}
              />

              <Button variant='contained' component='label'>
                Upload Resume
                <input
                  type='file'
                  hidden
                  onChange={e => {
                    setFile(e.target.files?.[0] ?? null)
                    setFileError(false)
                  }}
                />
              </Button>
              <br />
              <br />
              {fileError && <div style={{ color: 'red', marginTop: '5px' }}>Please upload a file</div>}

              <Button type='submit' variant='contained' color='primary'>
                Create Developer
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
