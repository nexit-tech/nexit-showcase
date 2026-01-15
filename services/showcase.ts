import { supabase } from '@/lib/supabaseClient'
import { ShowcaseItem } from '@/types'

const getPublicUrl = (path: string) => {
  const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
  return data.publicUrl
}

async function getImagesFromFolder(folderName: string, subfolder: 'mobile' | 'desktop') {
  const { data } = await supabase.storage
    .from('portfolio-images')
    .list(`${folderName}/${subfolder}`, {
      limit: 20,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

  if (!data) return []

  return data
    .filter((file) => file.name.toLowerCase().endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.name.replace(/\D/g, '')) || 0
      const numB = parseInt(b.name.replace(/\D/g, '')) || 0
      return numA - numB
    })
    .map((file) => getPublicUrl(`${folderName}/${subfolder}/${file.name}`))
}

export async function getShowcaseData(): Promise<ShowcaseItem[]> {
  const { data: portfolioData } = await supabase
    .from('portfolio')
    .select(`
      id,
      project_name,
      frameworks,
      projects (
        lead_name
      )
    `)
    .eq('is_featured', true) // Opcional: só trazer os destacados
    .order('display_order', { ascending: true })

  if (!portfolioData) return []

  const itemsWithImages = await Promise.all(
    portfolioData.map(async (item: any) => {
      const folderName = item.project_name
      
      const mobileImages = await getImagesFromFolder(folderName, 'mobile')
      const desktopImages = await getImagesFromFolder(folderName, 'desktop')

      // Se não tiver imagens, retorna null para filtrar depois (opcional)
      // Aqui mantemos mesmo sem imagens para debugging visual se necessário
      return {
        id: item.id,
        title: item.project_name,
        client: item.projects?.lead_name || 'CLIENTE',
        tags: item.frameworks || [],
        mobileImages,
        desktopImages
      }
    })
  )

  return itemsWithImages
}