import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog"

interface ImageCropperProps {
    open: boolean
    imageSrc: string
    onCropComplete: (croppedFile: File) => void
    onCancel: () => void
    aspectRatio: number
    currentStep?: number
    totalSteps?: number
    onBack?: () => void
    onRemove?: () => void
}

// Utility to extract a canvas image
const getCroppedImg = async (imageSrc: string, pixelCrop: any, fileName: string): Promise<File> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageSrc
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
    })

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
        throw new Error("No 2d context")
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Canvas is empty"))
                return
            }
            resolve(new File([blob], fileName, { type: "image/jpeg" }))
        }, "image/jpeg")
    })
}

export function ImageCropper({
    open,
    imageSrc,
    onCropComplete,
    onCancel,
    aspectRatio,
    currentStep,
    totalSteps,
    onBack,
    onRemove
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [isCropping, setIsCropping] = useState(false)
    const [showCancelWarning, setShowCancelWarning] = useState(false)

    const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return
        setIsCropping(true)
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, `cropped_${Date.now()}.jpg`)
            onCropComplete(croppedFile)
        } catch (e) {
            console.error(e)
        } finally {
            setIsCropping(false)
        }
    }

    const handleCancelClick = () => {
        if (totalSteps && totalSteps > 1) {
            setShowCancelWarning(true)
        } else {
            onCancel()
        }
    }

    const confirmCancel = () => {
        setShowCancelWarning(false)
        onCancel()
    }

    return (
        <>
            <AlertDialog open={open} onOpenChange={(open) => !open && handleCancelClick()}>
                <AlertDialogContent className="w-[95vw] max-w-2xl bg-slate-900 border-slate-800 text-slate-200 p-0 sm:p-6 rounded-2xl">
                    <AlertDialogHeader className="p-4 sm:p-0">
                        <AlertDialogTitle className="flex items-center gap-2">
                            Crop Image
                            {currentStep && totalSteps && totalSteps > 1 && (
                                <span className="text-sm font-normal text-slate-400">
                                    ({currentStep} of {totalSteps})
                                </span>
                            )}
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    <div className="relative w-full h-[50vh] sm:h-[60vh] bg-black/50 rounded-lg overflow-hidden my-4 sm:my-6">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={handleCropComplete}
                            onZoomChange={setZoom}
                            classes={{ containerClassName: "!rounded-lg" }}
                        />
                    </div>

                    <div className="px-4 pb-4 sm:p-0">
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-xs text-slate-400 font-medium">Zoom</label>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <AlertDialogFooter className="sm:justify-between w-full flex-col sm:flex-row gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button variant="outline" onClick={handleCancelClick} className="w-full sm:w-auto border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
                                    Cancel
                                </Button>
                                {onRemove && (
                                    <Button variant="ghost" onClick={onRemove} className="w-full sm:w-auto text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                        Skip/Remove
                                    </Button>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {onBack && (
                                    <Button variant="outline" onClick={onBack} className="w-full sm:w-auto border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
                                        Back
                                    </Button>
                                )}
                                <Button onClick={handleConfirm} disabled={isCropping} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white">
                                    {isCropping ? "Cropping..." : "Confirm"}
                                </Button>
                            </div>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Warning Sub-Dialog */}
            <AlertDialog open={showCancelWarning} onOpenChange={setShowCancelWarning}>
                <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel entire upload?</AlertDialogTitle>
                        <div className="text-sm text-slate-400">
                            If you cancel now, none of the images in this batch will be added.
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowCancelWarning(false)} className="border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700">
                            No, keep editing
                        </Button>
                        <Button onClick={confirmCancel} className="bg-red-600 hover:bg-red-500 text-white">
                            Yes, cancel upload
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
