
import { db } from './../../../configs';
import { CarImages } from './../../../configs/schema';
import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { eq } from 'drizzle-orm';

type UploadImagesProps = {
  triggerUploadImages: number | null;
  setTriggerUploadImages: (id: number | null) => void;
  setLoader: (value: boolean) => void;
  carInfo: any;
  mode: string;
  recordId: number;
};

function UploadImages({
  triggerUploadImages,
  setTriggerUploadImages,
  setLoader,
  carInfo,
  mode,
  recordId
}: UploadImagesProps) {
  const [selectedFileList, setSelectedFileList] = useState<File[]>([]);
  const [_uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);
  const [editCarImageList, setEditCarImageList] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (mode === 'edit' && recordId && carInfo?.id) {
      const recordIdParam = searchParams.get('id');
      setEditCarImageList([]);
      setTriggerUploadImages(Number(recordIdParam));

      carInfo?.images.forEach((image: any) => {
        setEditCarImageList(prev => [...prev, image?.imageUrl]);
      });
    }
  }, [carInfo, mode]);

  useEffect(() => {
    const listingId = Number(triggerUploadImages ?? carInfo?.id);
    if (!listingId || isNaN(listingId)) return;

    if (Number(triggerUploadImages) > 0 && selectedFileList.length > 0) {
      UploadImageToServer(listingId);
    }
  }, [triggerUploadImages, selectedFileList]);

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newFiles = files.filter(file => !selectedFileList.includes(file));

    console.log("📁 Selected files:");
    newFiles.forEach((file, _index) => {
      console.log(`- ${file.name} (${file.type}, ${file.size} bytes)`);
    });

    setSelectedFileList(prev => [...prev, ...newFiles]);
  };


  const onImageRemove = (image: File, _index: number) => {
    const result = selectedFileList.filter((item) => item !== image);
    setSelectedFileList(result);
  };

  const onImageRemoveFromDB = async (image: string, index: number) => {
    const result = await db.delete(CarImages)
      .where(eq(CarImages.id, carInfo?.images[index]?.id))
      .returning({ id: CarImages.id });

    if (result) {
      const imageList = editCarImageList.filter(item => item !== image);
      setEditCarImageList(imageList);
    }
  };

  const onSetCoverImage = async (index: number) => {
    if (index === 0) return; // Already cover image

    setLoader(true);

    // Reorder images in state
    const newImageList = [...editCarImageList];
    const [coverImage] = newImageList.splice(index, 1);
    newImageList.unshift(coverImage);
    setEditCarImageList(newImageList);

    // Save to database - delete all images and reinsert in new order
    try {
      const listingId = carInfo?.id;
      if (!listingId) return;

      // Delete all existing images for this listing
      await db.delete(CarImages).where(eq(CarImages.CarListingId, listingId));

      // Reinsert images in new order
      for (const imageUrl of newImageList) {
        await db.insert(CarImages).values({
          imageUrl: imageUrl,
          CarListingId: listingId,
        });
      }

      console.log('Cover image updated successfully');
    } catch (error) {
      console.error('Error updating cover image:', error);
    } finally {
      setLoader(false);
    }
  };

  const UploadImageToServer = async (listingId: number): Promise<void> => {
    if (selectedFileList.length === 0 || !listingId || isNaN(listingId)) return;

    // ✅ IMPORTANT: Check if listing ID exists
    const check = await db.query.CarListing.findFirst({
      where: (car) => eq(car.id, listingId),
    });
    if (!check) return;

    setLoader(true);

    const promises = selectedFileList.map(async (file) => {
      console.log("Uploading files ...");
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "car_marketplace");
      data.append("cloud_name", "dbcx5bxea");
      data.append("folder", "Car-marketplace");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dbcx5bxea/image/upload", {
          method: "POST",
          body: data,
        });

        if (!res.ok) throw new Error("Failed to upload image");

        const uploadImageURL = await res.json();
        await db.insert(CarImages).values({
          imageUrl: uploadImageURL.secure_url,
          CarListingId: listingId,
        });

        setUploadedImageURLs(prev => [...prev, uploadImageURL.secure_url]);

      } catch (error) {
        console.error("Error uploading image:", error);
      }
    });

    await Promise.all(promises);
    console.log("files uploaded sucessfully")

    if (!mode) {
      setSelectedFileList([]);
      console.log("reached !mode");
    }

    setLoader(false);
    navigate('/profile');
  };

  if (!triggerUploadImages) return null;

  return (
    <div>
      <h2 className='font-medium text-xl my-3'>Upload Car Images</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-center gap-5'>

        {/* Existing Images (Edit Mode) */}
        {mode === 'edit' &&
          editCarImageList.map((image, index) => (
            <div key={index} className="relative group">
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
                  Cover
                </div>
              )}
              <IoMdCloseCircle
                className="absolute top-2 right-2 text-lg text-white cursor-pointer z-10"
                onClick={() => onImageRemoveFromDB(image, index)}
              />
              {index !== 0 && (
                <button
                  onClick={() => onSetCoverImage(index)}
                  className="absolute bottom-2 left-2 right-2 bg-blue-500 text-white text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  Set as Cover
                </button>
              )}
              <img src={image}
                onError={(e) => {
                  e.currentTarget.src = "/Bad_Req404.png";
                  e.currentTarget.classList.add("opacity-70");
                  e.currentTarget.alt = "Image failed to load";
                  e.currentTarget.classList.add("opacity-60", "grayscale");
                }}
                className="w-full h-[130px] object-cover rounded-xl" />
            </div>
          ))}

        {/* Selected New Images (Edit Mode) */}
        {
          selectedFileList.map((image, index) => (
            <div key={index} className="relative">
              <IoMdCloseCircle
                className="absolute top-2 right-2 text-lg text-white cursor-pointer "
                onClick={() => onImageRemove(image, index)}
              />
              <img src={URL.createObjectURL(image)}

                className="w-full h-[130px] object-cover rounded-xl"
                alt={`preview-${index}`}

              />
            </div>
          ))}

        {/* Upload Button */}
        <label htmlFor='upload-images'>
          <div className='relative border rounded-xl border-dotted border-blue-700 bg-blue-100 p-10 cursor-pointer hover:shadow-md'>
            <h2 className='text-lg text-center text-blue-700'>+</h2>
            <input
              type="file"
              multiple
              id='upload-images'
              onChange={onFileSelected}
              className='absolute inset-0 rounded-xl opacity-0 cursor-pointer'
            />
          </div>
        </label>

      </div>
    </div>
  );
}

export default UploadImages;
