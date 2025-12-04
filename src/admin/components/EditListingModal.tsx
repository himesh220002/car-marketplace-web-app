import { useState, useEffect } from 'react'
import { ListingWithImages } from '../services/AdminService'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FiX, FiUpload } from 'react-icons/fi'

interface EditListingModalProps {
    listing: ListingWithImages | null
    isOpen: boolean
    onClose: () => void
    onSave: (id: number, data: Partial<ListingWithImages>) => Promise<void>
}

const EditListingModal: React.FC<EditListingModalProps> = ({ listing, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<ListingWithImages>>({
        listingTitle: '',
        sellingPrice: '',
        originalPrice: '',
        category: '',
        type: '',
        make: '',
        model: '',
        year: '',
        driveType: '',
        transmission: '',
        fuelType: '',
        mileage: '',
        distanceTravelled: '',
        engineSize: '',
        cylinder: '',
        color: '',
        door: '',
        offerType: '',
        vin: '',
        description: '',
    })
    const [isSaving, setIsSaving] = useState(false)
    const [images, setImages] = useState<{ imageUrl?: string; id?: number }[]>([])
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (listing) {
            setFormData({
                listingTitle: listing.listingTitle || '',
                sellingPrice: listing.sellingPrice || '',
                originalPrice: listing.originalPrice || '',
                category: listing.category || '',
                type: listing.type || '',
                make: listing.make || '',
                model: listing.model || '',
                year: listing.year || '',
                driveType: listing.driveType || '',
                transmission: listing.transmission || '',
                fuelType: listing.fuelType || '',
                mileage: listing.mileage || '',
                distanceTravelled: listing.distanceTravelled || '',
                engineSize: listing.engineSize || '',
                cylinder: listing.cylinder || '',
                color: listing.color || '',
                door: listing.door || '',
                offerType: listing.offerType || '',
                vin: listing.vin || '',
                description: listing.description || '',
            })
            setImages(listing.images || [])
        }
    }, [listing])

    const handleChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSetCoverImage = (index: number) => {
        if (index === 0) return // Already cover image
        setImages((prev) => {
            const newImages = [...prev]
            const [coverImage] = newImages.splice(index, 1)
            newImages.unshift(coverImage)
            return newImages
        })
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setSelectedFiles((prev) => [...prev, ...files])
    }

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleUploadFiles = async () => {
        if (selectedFiles.length === 0) return

        setUploading(true)
        const uploadedUrls: string[] = []

        for (const file of selectedFiles) {
            const data = new FormData()
            data.append('file', file)
            data.append('upload_preset', 'car_marketplace')
            data.append('cloud_name', 'dbcx5bxea')
            data.append('folder', 'Car-marketplace')

            try {
                const res = await fetch('https://api.cloudinary.com/v1_1/dbcx5bxea/image/upload', {
                    method: 'POST',
                    body: data,
                })

                if (!res.ok) throw new Error('Failed to upload image')

                const uploadImageURL = await res.json()
                uploadedUrls.push(uploadImageURL.secure_url)
            } catch (error) {
                console.error('Error uploading image:', error)
            }
        }

        // Add uploaded images to the images array
        setImages((prev) => [...prev, ...uploadedUrls.map((url) => ({ imageUrl: url }))])
        setSelectedFiles([])
        setUploading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!listing?.id) return

        setIsSaving(true)
        try {
            await onSave(listing.id, { ...formData, images })
            onClose()
        } catch (error) {
            console.error('Error saving listing:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (!listing) return null

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Listing</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="listingTitle">Listing Title</label>
                            <Input
                                id="listingTitle"
                                value={(formData.listingTitle || '') as string}
                                onChange={(e) => handleChange('listingTitle', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="sellingPrice">Selling Price</label>
                            <Input
                                id="sellingPrice"
                                type="number"
                                value={(formData.sellingPrice || '') as string}
                                onChange={(e) => handleChange('sellingPrice', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="originalPrice">Original Price</label>
                            <Input
                                id="originalPrice"
                                type="number"
                                value={(formData.originalPrice || '') as string}
                                onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="category">Category</label>
                            <Select value={(formData.category || '') as string} onValueChange={(value) => handleChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SUV">SUV</SelectItem>
                                    <SelectItem value="Sedan">Sedan</SelectItem>
                                    <SelectItem value="Truck">Truck</SelectItem>
                                    <SelectItem value="Off-road">Off-road</SelectItem>
                                    <SelectItem value="Convertible">Convertible</SelectItem>
                                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                                    <SelectItem value="Sports">Sports</SelectItem>
                                    <SelectItem value="Van">Van</SelectItem>
                                    <SelectItem value="Electric">Electric</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="type">Type</label>
                            <Select value={(formData.type || '') as string} onValueChange={(value) => handleChange('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Used">Used</SelectItem>
                                    <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                                    <SelectItem value="Demo">Demo</SelectItem>
                                    <SelectItem value="Rental">Rental</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="make">Make</label>
                            <Select value={(formData.make || '') as string} onValueChange={(value) => handleChange('make', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select make" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Toyota">Toyota</SelectItem>
                                    <SelectItem value="Honda">Honda</SelectItem>
                                    <SelectItem value="Ford">Ford</SelectItem>
                                    <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                                    <SelectItem value="Nissan">Nissan</SelectItem>
                                    <SelectItem value="BMW">BMW</SelectItem>
                                    <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                                    <SelectItem value="Audi">Audi</SelectItem>
                                    <SelectItem value="Tesla">Tesla</SelectItem>
                                    <SelectItem value="Kia">Kia</SelectItem>
                                    <SelectItem value="Tata">Tata</SelectItem>
                                    <SelectItem value="Suzuki">Suzuki</SelectItem>
                                    <SelectItem value="Jaguar-Land-Rover">Jaguar-Land-Rover</SelectItem>
                                    <SelectItem value="Mahindra">Mahindra</SelectItem>
                                    <SelectItem value="Koenigsegg">Koenigsegg</SelectItem>
                                    <SelectItem value="New_temporary">New_temporary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="model">Model</label>
                            <Input
                                id="model"
                                value={(formData.model || '') as string}
                                onChange={(e) => handleChange('model', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="year">Year</label>
                            <Input
                                id="year"
                                type="number"
                                value={(formData.year || '') as string}
                                onChange={(e) => handleChange('year', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="transmission">Transmission</label>
                            <Select value={(formData.transmission || '') as string} onValueChange={(value) => handleChange('transmission', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select transmission" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Automatic">Automatic</SelectItem>
                                    <SelectItem value="Manual">Manual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="fuelType">Fuel Type</label>
                            <Select value={(formData.fuelType || '') as string} onValueChange={(value) => handleChange('fuelType', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select fuel type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Petrol">Petrol</SelectItem>
                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                    <SelectItem value="Electric">Electric</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="mileage">Mileage</label>
                            <Input
                                id="mileage"
                                type="number"
                                value={(formData.mileage || '') as string}
                                onChange={(e) => handleChange('mileage', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="distanceTravelled">Distance Travelled (Km)</label>
                            <Input
                                id="distanceTravelled"
                                type="number"
                                value={(formData.distanceTravelled || '') as string}
                                onChange={(e) => handleChange('distanceTravelled', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="color">Color</label>
                            <Select value={(formData.color || '') as string} onValueChange={(value) => handleChange('color', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Red">Red</SelectItem>
                                    <SelectItem value="Blue">Blue</SelectItem>
                                    <SelectItem value="Green">Green</SelectItem>
                                    <SelectItem value="Black">Black</SelectItem>
                                    <SelectItem value="White">White</SelectItem>
                                    <SelectItem value="Silver">Silver</SelectItem>
                                    <SelectItem value="Gray">Gray</SelectItem>
                                    <SelectItem value="Yellow">Yellow</SelectItem>
                                    <SelectItem value="Orange">Orange</SelectItem>
                                    <SelectItem value="Brown">Brown</SelectItem>
                                    <SelectItem value="Gold">Gold</SelectItem>
                                    <SelectItem value="Beige">Beige</SelectItem>
                                    <SelectItem value="Maroon">Maroon</SelectItem>
                                    <SelectItem value="Navy Blue">Navy Blue</SelectItem>
                                    <SelectItem value="Sky Blue">Sky Blue</SelectItem>
                                    <SelectItem value="Purple">Purple</SelectItem>
                                    <SelectItem value="Pink">Pink</SelectItem>
                                    <SelectItem value="Teal">Teal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Image Gallery Section */}
                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium mb-2">Images</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Existing Images */}
                            {images.map((image, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img
                                        src={image.imageUrl || '/st_road.jpg'}
                                        alt={`Car ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                    {index === 0 && (
                                        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                            Cover
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetCoverImage(index)}
                                            className="absolute bottom-1 left-1 right-1 bg-blue-500 text-white text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Set as Cover
                                        </button>
                                    )}
                                </div>
                            ))}


                            {/* Selected Files (not yet uploaded) */}
                            {selectedFiles.map((file, index) => (
                                <div key={`file-${index}`} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                        Not uploaded
                                    </div>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label htmlFor="upload-images" className="cursor-pointer">
                                <div className="w-full h-24 border-2 border-dashed border-blue-500 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <FiUpload className="w-8 h-8 text-blue-500" />
                                </div>
                                <input
                                    type="file"
                                    id="upload-images"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Upload Button */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    onClick={handleUploadFiles}
                                    disabled={uploading}
                                    className="w-full"
                                >
                                    {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} image(s) to Cloud`}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <Textarea
                            id="description"
                            value={(formData.description || '') as string}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EditListingModal
