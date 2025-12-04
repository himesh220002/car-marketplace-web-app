import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdminAccessGuard from './components/AdminAccessGuard'
import UserCard from './components/UserCard'
import EditListingModal from './components/EditListingModal'
import AdminService, { UserWithListings, ListingWithImages } from './services/AdminService'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

function AdminPanel() {
    const [users, setUsers] = useState<UserWithListings[]>([])
    const [userListings, setUserListings] = useState<Map<string, ListingWithImages[]>>(new Map())
    const [loading, setLoading] = useState(true)
    const [editingListing, setEditingListing] = useState<ListingWithImages | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setLoading(true)
        const usersData = await AdminService.getAllUsers()
        setUsers(usersData)
        setLoading(false)
    }

    const loadUserListings = async (email: string) => {
        if (userListings.has(email)) return // Already loaded

        const listings = await AdminService.getUserListings(email)
        setUserListings(new Map(userListings.set(email, listings)))
    }

    const handleEdit = (listing: ListingWithImages) => {
        setEditingListing(listing)
    }

    const handleSave = async (id: number, data: Partial<ListingWithImages>) => {
        const success = await AdminService.updateListing(id, data)
        if (success) {
            // Reload the user's listings
            const userEmail = editingListing?.createdBy as string
            if (userEmail) {
                const listings = await AdminService.getUserListings(userEmail)
                setUserListings(new Map(userListings.set(userEmail, listings)))
            }
        }
    }

    const handleDelete = async (id: number) => {
        const success = await AdminService.deleteListing(id)
        if (success) {
            // Find which user this listing belongs to and reload their listings
            for (const [email, listings] of userListings.entries()) {
                if (listings.some((l) => l.id === id)) {
                    const updatedListings = await AdminService.getUserListings(email)
                    setUserListings(new Map(userListings.set(email, updatedListings)))

                    // Update user count
                    const updatedUsers = users.map((u) =>
                        u.email === email ? { ...u, listingCount: u.listingCount - 1 } : u
                    )
                    setUsers(updatedUsers.filter((u) => u.listingCount > 0))
                    break
                }
            }
        }
        setDeletingId(null)
    }

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuthenticated')
        window.location.reload()
    }

    return (
        <AdminAccessGuard>
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8">
                    {/* Admin Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-gray-600 mt-1">Manage users and their car listings</p>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-600">Total Listings</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {users.reduce((sum, u) => sum + u.listingCount, 0)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-600">Avg Listings/User</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {users.length ? (users.reduce((sum, u) => sum + u.listingCount, 0) / users.length).toFixed(1) : 0}
                            </p>
                        </div>
                    </div>

                    {/* Users List */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl h-24 animate-pulse" />
                            ))}
                        </div>
                    ) : users.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <p className="text-gray-600">No users found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div
                                    key={user.email}
                                    onClick={() => loadUserListings(user.email)}
                                >
                                    <UserCard
                                        email={user.email}
                                        listingCount={user.listingCount}
                                        listings={userListings.get(user.email) || []}
                                        onEdit={handleEdit}
                                        onDelete={(id) => setDeletingId(id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Footer />

                {/* Edit Modal */}
                <EditListingModal
                    listing={editingListing}
                    isOpen={!!editingListing}
                    onClose={() => setEditingListing(null)}
                    onSave={handleSave}
                />

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete this car listing. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletingId && handleDelete(deletingId)}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminAccessGuard>
    )
}

export default AdminPanel
