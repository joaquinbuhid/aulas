"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface Edificio {
  id: number
  nombre: string
  created_at: string
}

export default function EdificiosPage() {
  const [edificios, setEdificios] = useState<Edificio[]>([])
  const [nombre, setNombre] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchEdificios()
  }, [])

  async function fetchEdificios() {
    const { data, error } = await supabase
      .from("edificios")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      setMessage({ type: "error", text: "Error al cargar edificios" })
    } else {
      setEdificios(data || [])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from("edificios")
      .insert([{ nombre: nombre.trim() }])

    if (error) {
      setMessage({ type: "error", text: "Error al guardar el edificio" })
    } else {
      setMessage({ type: "success", text: "Edificio guardado correctamente" })
      setNombre("")
      fetchEdificios()
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("edificios").delete().eq("id", id)
    if (error) {
      setMessage({ type: "error", text: "Error al eliminar el edificio" })
    } else {
      setMessage({ type: "success", text: "Edificio eliminado" })
      fetchEdificios()
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <PageHeader 
          title="Edificios" 
          description="Registra los edificios del campus"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Edificio</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Edificio</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Edificio A"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                {message && (
                  <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {message.text}
                  </p>
                )}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Guardando..." : "Guardar Edificio"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edificios Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              {edificios.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay edificios registrados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="w-20">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {edificios.map((edificio) => (
                      <TableRow key={edificio.id}>
                        <TableCell className="font-medium">{edificio.nombre}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(edificio.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
