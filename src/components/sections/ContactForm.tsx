import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/Input'
import { submitLead } from '@/services/leads.api'
import { projects as staticProjects } from '@/data/projects'
import { useUiStore } from '@/store/ui-store'
import type { LeadInterest } from '@/types/lead'

const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  interest: z.enum(['site-visit', 'brochure', 'invest', 'general']),
  projectSlug: z.string().optional(),
  message: z.string().max(500, 'Please keep the message under 500 characters').optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please accept to continue' }) }),
  company: z.string().optional(),
})

type LeadFormValues = z.infer<typeof leadSchema>

const INTEREST_OPTIONS: { value: LeadInterest; label: string }[] = [
  { value: 'site-visit', label: 'Book a Site Visit' },
  { value: 'brochure', label: 'Download Brochure' },
  { value: 'invest', label: 'Investment Enquiry' },
  { value: 'general', label: 'General Enquiry' },
]

export function ContactForm() {
  const pushToast = useUiStore((state) => state.pushToast)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      interest: 'site-visit',
    },
  })

  const onSubmit = async (values: LeadFormValues) => {
    // Honeypot — silently ignore bot submissions.
    if (values.company) return
    setSubmitting(true)
    try {
      await submitLead({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        interest: values.interest,
        projectSlug: values.projectSlug || undefined,
        message: values.message || undefined,
        consent: true,
      })
      pushToast('Thank you! Our team will reach out within 24 hours.', 'success')
      reset()
    } catch {
      pushToast('Something went wrong. Please try again or call us directly.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Honeypot — hidden from humans and screen readers */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        {...register('company')}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Your name"
            autoComplete="name"
            invalid={Boolean(errors.name)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="phone" required>
            Mobile Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="10-digit mobile number"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="interest">I am interested in</Label>
          <Select id="interest" {...register('interest')}>
            {INTEREST_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="project">Which project?</Label>
        <Select id="project" {...register('projectSlug')}>
          <option value="">Not sure yet — advise me</option>
          {staticProjects.map((project) => (
            <option key={project.id} value={project.slug}>
              {project.title}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          placeholder="Tell us a little about what you are looking for"
          invalid={Boolean(errors.message)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        <FieldError id="message-error" message={errors.message?.message} />
      </div>

      <div>
        <Checkbox
          invalid={Boolean(errors.consent)}
          label="I agree to be contacted by Signature City regarding my enquiry. Your details are never shared with third parties."
          {...register('consent')}
        />
        {errors.consent ? (
          <p role="alert" className="mt-1.5 text-sm text-red-700">
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={submitting}>
        {submitting ? 'Sending…' : 'Submit Enquiry'}
      </Button>
    </form>
  )
}
