// services/showcase.ts
import { supabase } from '@/lib/supabaseClient'
import { ShowcaseItem } from '@/types'

export async function getShowcaseData(): Promise<ShowcaseItem[]> {
  console.log('🚀 Buscando dados do portfólio via Database...')
  
  const { data: portfolioData, error } = await supabase
    .from('portfolio')
    .select(`
      id,
      project_name,
      frameworks,
      display_order,
      is_featured,
      mobile_images_urls,
      desktop_images_urls,
      projects (
        lead_name
      )
    `)
    .order('display_order', { ascending: true })

  if (error || !portfolioData) {
    console.error("❌ Erro ao buscar dados do DB:", error)
    return []
  }

  console.log(`✅ ${portfolioData.length} projetos encontrados.`)

  // Mapeia os dados do banco (snake_case) para o tipo do Front-end (camelCase)
  const items: ShowcaseItem[] = portfolioData.map((item: any) => {
    // Garante que sejam arrays, mesmo que venha null do banco
    const mobileImages = item.mobile_images_urls || []
    const desktopImages = item.desktop_images_urls || []

    return {
      id: item.id,
      title: item.project_name,
      // Pega o nome do cliente da tabela relacionada 'projects', ou usa fallback
      client: item.projects?.lead_name || 'Cliente', 
      tags: item.frameworks || [],
      isFeatured: item.is_featured,
      mobileImages,
      desktopImages
    }
  })

  return items
}