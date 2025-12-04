import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AdminAccessGuardProps {
    children: React.ReactNode
}

const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [accessCode, setAccessCode] = useState('')
    const [error, setError] = useState('')
    const [showDialog, setShowDialog] = useState(true)

    useEffect(() => {
        // Check if already authenticated in this session
        const authenticated = sessionStorage.getItem('adminAuthenticated')
        if (authenticated === 'true') {
            setIsAuthenticated(true)
            setShowDialog(false)
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const correctCode = import.meta.env.VITE_ADMIN_CODE

        if (accessCode === correctCode) {
            setIsAuthenticated(true)
            setShowDialog(false)
            sessionStorage.setItem('adminAuthenticated', 'true')
            setError('')
        } else {
            setError('Invalid access code. Please try again.')
            setAccessCode('')
        }
    }

    if (!isAuthenticated) {
        return (
            <AlertDialog open={showDialog}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Admin Access Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please enter the admin access code to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="password"
                                placeholder="Enter access code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="w-full"
                                autoFocus
                            />
                            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return <>{children}</>
}

export default AdminAccessGuard
