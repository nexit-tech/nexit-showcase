import { supabase } from '@/lib/supabaseClient'
import { ShowcaseItem } from '@/types'

async function getImagesFromFolder(folderName: string, subfolder: 'mobile' | 'desktop') {
  const cleanFolderName = folderName.trim()
  const pathToCheck = `${cleanFolderName}/${subfolder}`
  
  console.log(`🔍 Buscando em: [${pathToCheck}]`)
  
  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .list(pathToCheck, {
      limit: 50,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

  if (error) {
    console.error(`❌ Erro [${pathToCheck}]:`, error.message)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  const imageRegex = /\.(png|jpg|jpeg|webp|gif)$/i
  
  const validFiles = data
    .filter((file) => imageRegex.test(file.name))
    .sort((a, b) => {
      const numA = parseInt(a.name.replace(/\D/g, '')) || 0
      const numB = parseInt(b.name.replace(/\D/g, '')) || 0
      return numA - numB
    })

  const urls = await Promise.all(
    validFiles.map(async (file) => {
      const filePath = `${cleanFolderName}/${subfolder}/${file.name}`
      
      const { data } = await supabase.storage
        .from('portfolio-images')
        .createSignedUrl(filePath, 31536000)

      if (data?.signedUrl) {
        // --- O PULO DO GATO ---
        // Se a URL tiver espaço (Next Finance), o navegador pode quebrar.
        // Trocamos espaço por %20 manualmente para garantir.
        return data.signedUrl.replace(/\s/g, '%20') 
      }
      return null
    })
  )

  const finalUrls = urls.filter((url): url is string => url !== null)
  console.log(`✅ [${folderName}] Geradas ${finalUrls.length} URLs válidas.`)
  return finalUrls
}

export async function getShowcaseData(): Promise<ShowcaseItem[]> {
  const { data: portfolioData, error } = await supabase
    .from('portfolio')
    .select(`
      id,
      project_name,
      frameworks,
      display_order,
      is_featured,
      projects (
        lead_name
      )
    `)
    .order('display_order', { ascending: true })

  if (error || !portfolioData) {
    console.error("Erro DB:", error)
    return []
  }

  const itemsWithImages = await Promise.all(
    portfolioData.map(async (item: any) => {
      const folderName = item.project_name
      
      const mobileImages = await getImagesFromFolder(folderName, 'mobile')
      const desktopImages = await getImagesFromFolder(folderName, 'desktop')

      return {
        id: item.id,
        title: item.project_name,
        client: item.projects?.lead_name || 'Cliente',
        tags: item.frameworks || [],
        isFeatured: item.is_featured,
        mobileImages,
        desktopImages
      }
    })
  )

  return itemsWithImages
}