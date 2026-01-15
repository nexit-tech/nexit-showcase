import { ShowcaseItem } from "@/types"

export function getMockShowcase(): ShowcaseItem[] {
  return [
    {
      id: "nxt-01",
      title: "Fintech App",
      client: "BankOne",
      mobileImages: [
        "https://picsum.photos/seed/m1a/390/844",
        "https://picsum.photos/seed/m1b/390/844",
        "https://picsum.photos/seed/m1c/390/844"
      ],
      desktopImages: [
        "https://picsum.photos/seed/d1a/1280/800",
        "https://picsum.photos/seed/d1b/1280/800"
      ],
      tags: ["Fintech", "Mobile Only"],
    },
    {
      id: "nxt-02",
      title: "E-commerce Fashion",
      client: "VogueStyle",
      mobileImages: [
        "https://picsum.photos/seed/m2a/390/844",
        "https://picsum.photos/seed/m2b/390/844"
      ],
      desktopImages: [
        "https://picsum.photos/seed/d2a/1280/800",
        "https://picsum.photos/seed/d2b/1280/800"
      ],
      tags: ["Fashion", "Web"],
    },
  ]
}