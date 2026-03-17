"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface Edificio {
  id: number
  nombre: string
}

interface Aula {
  id: number
  nombre: string
  edificio_id: number
  capacidad: number
  detalles: string | null
  edificios: { nombre: string }
}

export default function AulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([])
  const [edificios, setEdificios] = useState<Edificio[]>([])
  const [nombre, setNombre] = useState("")
  const [edificioId, setEdificioId] = useState("")
  const [capacidad, setCapacidad] = useState("")
  const [detalles, setDetalles] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchEdificios()
    fetchAulas()
  }, [])

  async function fetchEdificios() {
    const { data } = await supabase.from("edificios").select("*").order("nombre")
    setEdificios(data || [])
  }

  async function fetchAulas() {
    const { data, error } = await supabase
      .from("aulas")
      .select("*, edificios(nombre)")
      .order("created_at", { ascending: false })

    if (!error) {
      setAulas(data || [])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !edificioId || !capacidad) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.from("aulas").insert([
      {
        nombre: nombre.trim(),
        edificio_id: parseInt(edificioId),
        capacidad: parseInt(capacidad),
        detalles: detalles.trim() || null,
      },
    ])

    if (error) {
      setMessage({ type: "error", text: "Error al guardar el aula" })
    } else {
      setMessage({ type: "success", text: "Aula guardada correctamente" })
      setNombre("")
      setEdificioId("")
      setCapacidad("")
      setDetalles("")
      fetchAulas()
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("aulas").delete().eq("id", id)
    if (!error) {
      setMessage({ type: "success", text: "Aula eliminada" })
      fetchAulas()
    } else {
      setMessage({ type: "error", text: "Error al eliminar el aula" })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <PageHeader 
          title="Aulas" 
          description="Registra las aulas con su edificio y capacidad"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Nueva Aula</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Aula</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Aula 101"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edificio">Edificio</Label>
                  <Select value={edificioId} onValueChange={setEdificioId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar edificio" />
                    </SelectTrigger>
                    <SelectContent>
                      {edificios.map((edificio) => (
                        <SelectItem key={edificio.id} value={edificio.id.toString()}>
                          {edificio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidad">Capacidad</Label>
                  <Input
                    id="capacidad"
                    type="number"
                    placeholder="Ej: 30"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detalles">Detalles (opcional)</Label>
                  <Textarea
                    id="detalles"
                    placeholder="Ej: Proyector, aire acondicionado..."
                    value={detalles}
                    onChange={(e) => setDetalles(e.target.value)}
                    rows={3}
                  />
                </div>

                {message && (
                  <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {message.text}
                  </p>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Guardando..." : "Guardar Aula"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aulas Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              {aulas.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay aulas registradas</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Edificio</TableHead>
                        <TableHead>Capacidad</TableHead>
                        <TableHead className="w-20">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aulas.map((aula) => (
                        <TableRow key={aula.id}>
                          <TableCell className="font-medium">{aula.nombre}</TableCell>
                          <TableCell>{aula.edificios?.nombre}</TableCell>
                          <TableCell>{aula.capacidad}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(aula.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
