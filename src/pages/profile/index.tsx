import * as React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { http } from 'src/configs/http'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from 'src/context/AuthContext'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from 'src/@core/components/icon'

const Profile = () => {
  const { user, loading, setLoading, setUser } = useContext(AuthContext)
  const [newPassword, setNewPassword] = useState('') // New Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      setUser(null)
      setLoading(false)
      router.push('/login')
    }
  }, [])
  const handleUpdateProfile = async () => {
    if (!currentPassword) {
      setCurrentPasswordError('please enter password')
      setNewPasswordError('')
      setConfirmPasswordError('')
    } else if (!newPassword) {
      setNewPasswordError('please enter password')
      setCurrentPasswordError('')
      setConfirmPasswordError('')
    } else if (!confirmPassword) {
      setConfirmPasswordError('please enter password')
      setNewPasswordError('')
      setCurrentPasswordError('')
    } else if (confirmPassword != newPassword) {
      setConfirmPasswordError('Passwords do not match')
      setCurrentPasswordError('')
      setNewPasswordError('')

      return
    } else if (confirmPassword === newPassword) {
      try {
        const response = await http({
          url: 'changeUser',
          method: 'post',
          data: { newPassword, currentPassword }
        })

        const { testuser, success } = response
        if (success) {
          window.localStorage.removeItem('userData')
          window.localStorage.setItem('userData', testuser)
          setNewPassword('')
          setCurrentPassword('')
          setConfirmPassword('')
          setConfirmPasswordError('')
          setCurrentPasswordError('')
          setNewPasswordError('')
          toast.success('Password updated successfully!')
        } else {
          setCurrentPasswordError('Incorrect password')
          setConfirmPasswordError('')
          setNewPasswordError('')
        }
      } catch (error) {
        console.error('Error updating password:', error)
        setCurrentPasswordError('Incorrect password')
        setConfirmPasswordError('')
      }
    }
  }

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={user?.username} avatar={<Avatar alt={user?.username} />} />
            <CardContent>
              <Typography variant='body1'>
                <strong>Username:</strong> {user?.username} <br />
                <strong>Email:</strong> {user?.email} <br />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4} p={3} component={Card}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TextField
              id='current-password'
              label='Current Password'
              type={showCurrentPassword ? 'text' : 'password'}
              fullWidth
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              error={Boolean(currentPasswordError)}
              helperText={currentPasswordError}
              sx={{
                '& .MuiOutlinedInput-root.Mui-error': {
                  '& fieldset': {
                    borderColor: 'red'
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge='end'
                    >
                      <Icon icon={showCurrentPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id='new-password'
              label='New Password'
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              error={Boolean(newPasswordError)}
              helperText={newPasswordError}
              sx={{
                '& .MuiOutlinedInput-root.Mui-error': {
                  '& fieldset': {
                    borderColor: 'red'
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge='end'
                    >
                      <Icon icon={showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Confirm Password'
              type='password'
              fullWidth
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' onClick={handleUpdateProfile} fullWidth>
              Update Password
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Profile
