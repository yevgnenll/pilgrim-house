'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createPrayerRequest, createGalleryItem, createNewsPost } from '@/lib/notion'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  return user
}

export async function submitPrayerRequest(formData: FormData) {
  await requireAuth()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const status = (formData.get('status') as '기도중' | '응답됨') ?? '기도중'
  const category = (formData.get('category') as string) ?? ''

  if (!title || !content) throw new Error('제목과 내용을 입력해주세요.')

  await createPrayerRequest({ title, content, status, category })
  revalidatePath('/prayer')
  revalidatePath('/')
}

export async function submitGalleryItem(formData: FormData) {
  await requireAuth()

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) ?? ''
  const tagsRaw = (formData.get('tags') as string) ?? ''
  const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
  const file = formData.get('image') as File

  if (!title || !file || file.size === 0) throw new Error('제목과 이미지를 입력해주세요.')

  const supabase = createAdminClient()
  const ext = file.name.split('.').pop()
  const path = `gallery/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('gallery')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`)

  const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path)
  const photoUrl = urlData.publicUrl

  await createGalleryItem({ title, photoUrl, description, tags })
  revalidatePath('/gallery')
}

export async function submitNewsPost(formData: FormData) {
  await requireAuth()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const summary = formData.get('summary') as string
  const coverUrl = (formData.get('coverUrl') as string) ?? ''
  const body = (formData.get('body') as string) ?? ''

  if (!title || !slug || !summary) throw new Error('제목, 슬러그, 요약을 입력해주세요.')

  await createNewsPost({ title, slug, summary, coverUrl, body })
  revalidatePath('/news')
  revalidatePath('/')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
