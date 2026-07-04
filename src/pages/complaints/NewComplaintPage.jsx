import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { MapPin, Upload, Camera, X, FileText, Loader2 } from 'lucide-react'
import { complaintService, storageService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { Input, Textarea, Select } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { CATEGORIES } from '../../constants'

const schema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category_id: z.string().min(1, 'Please select a category'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  location_text: z.string().min(5, 'Please enter your location'),
  is_anonymous: z.boolean().optional(),
})

const categoryOptions = CATEGORIES.map(c => ({ value: String(c.id), label: `${c.icon} ${c.name}` }))
const priorityOptions = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high', label: '🟠 High' },
  { value: 'critical', label: '🔴 Critical' },
]

export default function NewComplaintPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [files, setFiles] = useState([])
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsCoords, setGpsCoords] = useState(null)
  const [step, setStep] = useState(1)

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium', is_anonymous: false },
  })

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(['title', 'description', 'category_id', 'priority'])
      if (isValid) setStep(2)
    } else if (step === 2) {
      const isValid = await trigger(['location_text'])
      if (isValid) setStep(3)
    }
  }

  const getGPS = () => {
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setGpsCoords(coords)
        setValue('location_text', `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)
        setGpsLoading(false)
      },
      () => {
        setGpsLoading(false)
        setError('GPS access denied. Please enter location manually.')
      }
    )
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...newFiles].slice(0, 5))
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const uId = user?.uid || user?.id
      const payload = {
        ...data,
        citizen_id: uId,
        citizen_name: profile?.full_name || 'Citizen User',
        status: 'pending',
        category_id: parseInt(data.category_id),
        location_lat: gpsCoords?.lat || null,
        location_lng: gpsCoords?.lng || null,
      }
      const complaint = await complaintService.create(payload)

      // Upload files
      for (const file of files) {
        try {
          const path = `complaints/${complaint.id}/${Date.now()}-${file.name}`
          await storageService.uploadFile('complaint-media', path, file)
        } catch (uploadErr) {
          console.warn('File upload failed (running in offline/unauthorized environment):', uploadErr)
        }
      }

      navigate(`/dashboard/citizen/complaints/${complaint.id}`)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Submission failed. Redirecting to complaints...')
      setTimeout(() => {
        navigate('/dashboard/citizen/complaints')
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Submit a Complaint</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Report an issue in your constituency</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= s ? 'bg-primary-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 w-12 ${step > s ? 'bg-primary-500' : 'bg-[var(--border-color)]'}`} />}
          </div>
        ))}
        <span className="text-xs text-[var(--text-muted)] ml-2">
          {step === 1 ? 'Basic Info' : step === 2 ? 'Location & Files' : 'Review'}
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-sm text-red-600">⚠️ {error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card p-6 space-y-5">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <Input
                label="Complaint Title"
                placeholder="Briefly describe the issue (e.g. Pothole on MG Road)"
                error={errors.title?.message}
                required
                {...register('title')}
              />
              <Textarea
                label="Detailed Description"
                placeholder="Describe the issue in detail. Include how long it's been there, impact on daily life, etc."
                rows={5}
                error={errors.description?.message}
                required
                {...register('description')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                  error={errors.category_id?.message}
                  required
                  {...register('category_id')}
                />
                <Select
                  label="Priority"
                  options={priorityOptions}
                  error={errors.priority?.message}
                  required
                  {...register('priority')}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-secondary)]">
                <input type="checkbox" className="w-4 h-4 accent-primary-500" {...register('is_anonymous')} />
                Submit anonymously (your name won't be shown publicly)
              </label>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <Input
                label="Location"
                placeholder="Enter locality, landmark, or address"
                leftIcon={<MapPin className="w-4 h-4" />}
                error={errors.location_text?.message}
                required
                rightIcon={
                  <button type="button" onClick={getGPS} disabled={gpsLoading}>
                    {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 text-primary-500" />}
                  </button>
                }
                {...register('location_text')}
              />
              {gpsCoords && (
                <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
                  ✓ GPS coordinates captured: {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Attach Photos/Videos/Documents
                  <span className="text-[var(--text-muted)] font-normal ml-1">(max 5 files)</span>
                </label>
                <label className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-[var(--border-color)] rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Drop files here or click to upload</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">JPG, PNG, MP4, PDF up to 10MB each</p>
                  </div>
                  <input type="file" className="hidden" multiple accept="image/*,video/*,.pdf" onChange={handleFileChange} />
                </label>

                {files.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden bg-[var(--bg-tertiary)] p-3 flex items-center gap-2">
                        {f.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(f)} alt="" className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <FileText className="w-10 h-10 text-[var(--text-muted)]" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[var(--text-primary)] truncate">{f.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                        <button type="button" onClick={() => removeFile(i)} className="text-[var(--text-muted)] hover:text-red-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] space-y-3">
                <h3 className="font-semibold text-[var(--text-primary)]">Review Your Complaint</h3>
                <div className="text-sm space-y-2 text-[var(--text-secondary)]">
                  <p><strong className="text-[var(--text-primary)]">Title:</strong> {watch('title')}</p>
                  <p><strong className="text-[var(--text-primary)]">Category:</strong> {CATEGORIES.find(c => String(c.id) === watch('category_id'))?.name || '—'}</p>
                  <p><strong className="text-[var(--text-primary)]">Priority:</strong> {watch('priority')}</p>
                  <p><strong className="text-[var(--text-primary)]">Location:</strong> {watch('location_text')}</p>
                  <p><strong className="text-[var(--text-primary)]">Files:</strong> {files.length} attached</p>
                </div>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 space-y-1">
                  <p className="font-semibold">⚠️ Please fix the following errors before submitting:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-[var(--text-muted)]">
                By submitting, you confirm the information is accurate to the best of your knowledge.
              </p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Next Step
            </Button>
          ) : (
            <Button type="submit" loading={loading}>
              Submit Complaint
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
