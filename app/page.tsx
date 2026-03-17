import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DoorOpen, Clock, Users } from "lucide-react"
import Link from "next/link"

const cards = [
  {
    href: "/edificios",
    title: "Edificios",
    description: "Gestionar edificios del campus",
    icon: Building2,
  },
  {
    href: "/aulas",
    title: "Aulas",
    description: "Administrar aulas y su capacidad",
    icon: DoorOpen,
  },
  {
    href: "/movimientos",
    title: "Movimientos",
    description: "Registrar uso de aulas por horario",
    icon: Clock,
  },
  {
    href: "/encargados",
    title: "Encargados",
    description: "Gestionar personal encargado",
    icon: Users,
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <PageHeader 
          title="Bienvenido al Sistema" 
          description="Selecciona una opción para comenzar a gestionar"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.href} href={card.href}>
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
