// ** MUI Imports
import { useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from 'src/context/AuthContext'
import axios from 'axios'

const SecondPage = () => {
  const { user, setLoading, setUser } = useContext(AuthContext)
  const [developers, setDevelopers] = useState([])
  const router = useRouter()
  const fetchDevelopers = async () => {
    try {
      const res = await fetch('/api/read', {
        method: 'GET'
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      console.log(data)
      setDevelopers(data.developers)
    } catch (e: any) {
      console.error(e)
    }
  }
  useEffect(() => {
    const initAuth = async () => {
      if (!user) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userData')
        setUser(null)
        setLoading(false)
        router.push('/login')
      }
    }
    initAuth(), fetchDevelopers()
    console.log('in useeffect')
  }, [])
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete('/api/delete', { data: { id } })
      if (res.status === 200) {
        setDevelopers(developers.filter((developer: any) => developer.id !== id))
      } else {
        console.error('Failed to delete developer')
      }
    } catch (error) {
      console.error('Error deleting developer:', error)
    }
  }

  const handleEdit = (id: string) => {
    console.log(`Edit developer with id: ${id}`)

    // Navigate to edit page
  }

  const handleDownload = async (resume: string) => {
    console.log('file path is', resume)
    try {
      const response = await fetch(`/api/download?filePath=${encodeURIComponent(resume)}`)

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = resume.split('/').pop() ?? 'downloaded_file'

      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Developer Management' />
          <CardContent>
            <Typography sx={{ mb: 2 }}>Manage your developers' data here.</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Created by</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Resume</TableCell>
                    <TableCell>Delete</TableCell>
                    <TableCell>Edit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {developers.map((developer: any) => (
                    <TableRow key={developer.id}>
                      <TableCell>{developer.creator.username}</TableCell>
                      <TableCell>{developer.name}</TableCell>
                      <TableCell>{new Date(developer.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleDownload(developer.resume)}>Download</Button>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleDelete(developer.id)} color='error'>
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(developer.id)} color='primary'>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SecondPage
